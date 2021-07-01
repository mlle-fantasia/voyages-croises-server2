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
console.log("je passe", request.params.id)
	// get a post repository to perform operations with post

	const articleRepository = getManager().getRepository(Pages);
	const entities = await articleRepository.findOne(request.params.id, { relations: ["texts" ] });
	console.log(entities)

/* 	const pageRepository = getManager().getRepository(Pages);
	const page = await pageRepository.find({ where: { id: parseInt(request.params.id) }, relations:["texts"] }); */

	// if post was not found return 404 to the client
/* 	if (!page) {
		response.status(404);
		response.end("page not found");
		return;
	} */

	// get texts
/* 	const Repository = getManager().getRepository(Texts);
	const texts = await Repository.find({ where: { page: page.id } });
	console.log(texts); */

	let dataResponse = {
	//	page,
	};
	response.send(dataResponse);
}

/**
 * post article
 * Saves given new article .
 */
 export async function pagePostAction(request: Request, response: Response) {
	// get a post repository to perform operations with post
	const pageRepository = getManager().getRepository(Pages);
	
	let page = new Pages();
	page.name = request.body.name;
	page.key = request.body.key;
	page.in_menuprincipal = request.body.in_menuprincipal;
	page.in_menufooter = request.body.in_menufooter;

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
export async function pagePutAction(request: Request, response: Response) {

	// get a post repository to perform operations with post
	const pageRepository = getManager().getRepository(Pages);
	// load a artticle by a given post id
	const page = await pageRepository.findOne(request.params.id);

	page.name = request.body.name;
	page.key = request.body.key;
	page.in_menuprincipal = request.body.in_menuprincipal;
	page.in_menufooter = request.body.in_menufooter;

	// save received post
	await pageRepository.save(page);

	// return saved post back
	response.send(page);
}




/**
 * 
 * @param req 
 * @param res 
 * récupère l'image miniature de l'article enregistrée dans uploads/miniature/ 
 * avec l'id de l'article passé en params à la route
 */
export async function articlesGetMiniatureAction(req, res) {
	const articleRepository = getManager().getRepository(Articles);
	const article = await articleRepository.findOne(req.params.id);
	let ext = "";
	if (article.image) ext = path.extname(article.image).toLowerCase();

	let filenameDest = process.cwd() + "/uploads/images/article" + req.params.id + ext;
	if (!fs.existsSync(filenameDest)) return res.send("not_found");

	let readStream = fs.createReadStream(filenameDest);
	readStream.pipe(res);
}
