import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Articles } from "../entity/Articles";
import { Comments } from "../entity/Comments";
import { Users } from "../entity/Users";
import { getConnection } from "typeorm";
const fs = require("fs-extra");
const path = require("path");
var jwt = require("jsonwebtoken");

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

	// get auteur
	let token = jwt.verify(request.headers.authorization, process.env.TOKEN_KEY);
	const userRepository = getManager().getRepository(Users);
	const user = await userRepository.findOne({ where: { id: token.id } });

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
	article.user = user
	article.category = request.body.category
	article.subcategory = request.body.subcategory

	// save received post
	await articleRepository.save(article);

	// return saved post back
	response.send(article);
}


/**
 * add new comment to article
 * Saves given article.
 */
 export async function articlesPutByIdCommentAction(request: Request, response: Response) {


	// get a post repository to perform operations with post
	const articleRepository = getManager().getRepository(Articles);
	// load a artticle by a given post id
	const article = await articleRepository.findOne(request.params.id);

	 let numImage = Math.floor(Math.random() * 3); // de 0 à 2
	 let dataComment = {
		title: request.body.title,
		contenu: request.body.contenu,
		visible: request.body.visible,
		name: request.body.name,
		email: request.body.email,
		image:numImage,
		articleId : article.id
	 }
	const commentsRepository = getManager().getRepository(Comments);
	await commentsRepository.save(dataComment);

	// return saved post back
	response.send("ok");
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
