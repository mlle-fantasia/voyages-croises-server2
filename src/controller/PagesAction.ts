import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Articles } from "../entity/Articles";
import { Pages } from "../entity/Pages";
import { Texts } from "../entity/Texts";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");



/**
 *  * get by key
 * Loads page by a given key.  pour le site public
 */
 export async function siteGetOnePageAction(request: Request, response: Response) {
	
		const pageRepository = getManager().getRepository(Pages);
	 const entitie = await pageRepository.findOne({ where: { key: request.params.key }, relations: ["texts"] });
	 let responseData = { page: entitie, apropos:{}, lastarticles:[] }
	 
	 if (request.query.aside) {
		 const textRepository = getManager().getRepository(Texts);
		 const aproposTxt = await textRepository.findOne({ where: { key: "résumé à propos" } });
		 console.log("aproposTxt", aproposTxt)
		 if (aproposTxt) responseData.apropos = aproposTxt;
		 
		 const articleRepository = getManager().getRepository(Articles);
		 const entities = await articleRepository.find({ select: ["id", "title", "resume", "date"], where: { visible: true }, relations: ["user", "category"], order: { date: 'DESC' }, take: 3, });
		 if (entities.length) responseData.lastarticles = entities;
	 }


		response.send(responseData);
	}



/**
 * get all pour admin
 * 
 */
export async function adminGetAllPagesAction(request: Request, response: Response) {
	const pageRepository = getManager().getRepository(Pages);
	const entities = await pageRepository.find({ select: ["id", "name", "key"] });
	console.log(entities)	
	response.send(entities);
}

/**
 *  * get by id
 * Loads page by a given id.
 */
export async function adminGetOnePageAction(request: Request, response: Response) {
	// get a post repository to perform operations with post

	const articleRepository = getManager().getRepository(Pages);
	const entities = await articleRepository.findOne(request.params.id, { relations: ["texts" ] });
	console.log(entities)

	// if post was not found return 404 to the client
/* 	if (!page) {
		response.status(404);
		response.end("page not found");
		return;
	} */



	response.send(entities);
}

/**
 * post article
 * Saves given new article .
 */
 export async function adminPagePostAction(request: Request, response: Response) {
	// get a post repository to perform operations with post
	const pageRepository = getManager().getRepository(Pages);
	
	let page = new Pages();
	page.name = request.body.name;
	page.key = request.body.key;
	page.in_menuprincipal = request.body.in_menuprincipal;
	page.in_menufooter = request.body.in_menufooter;
	page.have_image = request.body.have_image;
	 

	const newPage = pageRepository.create(page);
console.log(newPage)
	// save received post
	await pageRepository.save(newPage);

	// return saved post back
	response.send(newPage);
 }


/**
 * put page
 * Saves given .
 */
export async function adminPagePutAction(request: Request, response: Response) {

	// get a post repository to perform operations with post
	const pageRepository = getManager().getRepository(Pages);
	// load a artticle by a given post id
	const page = await pageRepository.findOne(request.params.id);

	page.name = request.body.name;
	page.image = request.body.image;
	page.key = request.body.key;
	page.in_menuprincipal = request.body.in_menuprincipal;
	page.in_menufooter = request.body.in_menufooter;
	page.have_image = request.body.have_image;

	// save received post
	await pageRepository.save(page);

	// return saved post back
	response.send(page);
}

/**
 * delete by given id .
 */
export async function adminPageDeleteAction(request: Request, response: Response) {
	// delete textes
	await getConnection().createQueryBuilder().delete().from(Texts).where("pagesId = :pagesId", { pagesId: request.params.id }).execute();

	// delete page
	await getConnection().createQueryBuilder().delete().from(Pages).where("id = :id", { id: request.params.id }).execute();
	response.send("ok");

}




export async function adminPagePostImageAction(req, res) {
	const Repository = getManager().getRepository(Pages);
	const page = await Repository.findOne(req.params.id);

	let ext = path.extname(req.files.image.name).toLowerCase();
	fs.ensureDirSync(process.cwd() + "/uploads/pages");
	let filenameOrigin = process.cwd() + "/uploads/pages/page" + req.params.id + ext;
	req.files.image.mv(filenameOrigin, async function (err) {
		if (err) return res.status(500).send(err);

		page.image = req.files.image.name;
		await Repository.save(page);

		res.send("ok");
	});
}


/**
 * 
 * @param req 
 * @param res 
 */
export async function pagesGetImageAction(req, res) {
	const Repository = getManager().getRepository(Pages);
	const page = await Repository.findOne(req.params.id);
	let ext = "";
	if (page.image) ext = path.extname(page.image).toLowerCase();

	let filenameDest = process.cwd() + "/uploads/pages/page" + req.params.id + ext;
	if (!fs.existsSync(filenameDest)) return res.send("not_found");

	let readStream = fs.createReadStream(filenameDest);
	readStream.pipe(res);
}
