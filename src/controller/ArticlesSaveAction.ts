import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Articles } from "../entity/Articles";
import { getConnection } from "typeorm";
const fs = require("fs-extra");
const path = require("path");

/**
 * post article
 * Saves given new article .
 */
export async function articlesSaveAction(request: Request, response: Response) {
	// get a post repository to perform operations with post
	const articleRepository = getManager().getRepository(Articles);
	
	let article = new Articles();
	article.title = request.body.title;
	article.resume = request.body.resume;
	article.miniature = request.body.miniature;
	article.contenu = request.body.contenu;
	article.order = parseInt(request.body.order === "" ? 1000 :request.body.order);

	const newArticles = articleRepository.create(article);

	// save received post
	await articleRepository.save(newArticles);

	// return saved post back
	response.send(newArticles);
}


/**
 * put article
 * Saves given article.
 */
export async function articlesPutAction(request: Request, response: Response) {
	// get a post repository to perform operations with post
	const articleRepository = getManager().getRepository(Articles);
	// load a artticle by a given post id
	const article = await articleRepository.findOne(request.params.id);

	article.title = request.body.title;
	article.resume = request.body.resume;
	article.contenu = request.body.contenu;
	article.order = request.body.order;
	article.visible = request.body.visible;
	article.date = request.body.date;

	// save received post
	await articleRepository.save(article);

	// return saved post back
	response.send(article);
}

// /**
//  * 
//  * @param request 
//  * @param response
//  * put d'un article pour modifier le champs hidden 
//  *  
//  */
// export async function articlesHiddenAction(request: Request, response: Response) {
// 	// get a post repository to perform operations with post
// 	const articleRepository = getManager().getRepository(Articles);
// 	// load a artticle by a given post id
// 	const article = await articleRepository.findOne(request.params.id);
// 	article.visible = request.body.visible;
// 	// save received post
// 	await articleRepository.save(article);

// 	// return saved post back
// 	response.send(article);
// }

/**
 * 
 * @param request 
 * @param response
 * enregistre l'image miniature de l'article dans uploads/miniatures 
 * sous le nom : "article" + id de l'article
 *  
 */
export async function articlesPostMiniatureAction(req, res) {
	const articleRepository = getManager().getRepository(Articles);
	const article = await articleRepository.findOne(req.params.id);

	let ext = path.extname(req.files.image.name).toLowerCase();
	fs.ensureDirSync(process.cwd() + "/uploads/images");
	let filenameOrigin = process.cwd() + "/uploads/images/article" + req.params.id + ext;
	req.files.image.mv(filenameOrigin, async function (err) {
		if (err) return res.status(500).send(err);

		article.image = req.files.image.name;
		await articleRepository.save(article);

		res.send("ok");
	});
}

/**
 * 
 * @param request 
 * @param response
 * supprime un article avec l'id donné en paramètre de la route
 *  
 */
export async function articlesDeleteArticlesAction(request: Request, response: Response) {
	await getConnection().createQueryBuilder().delete().from(Articles).where("id = :id", { id: request.params.id }).execute();
	response.send("ok");
}
