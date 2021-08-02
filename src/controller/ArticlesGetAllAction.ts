import { Request, Response } from "express";
import { getManager, getRepository, getConnection } from "typeorm";
/// les entités
import { Articles } from "../entity/Articles";
import { Categories } from "../entity/Categories";
import { Users } from "../entity/Users";
import { Tags } from "../entity/Tags";
import { Texts } from "../entity/Texts";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");
var jwt = require("jsonwebtoken");

/**
 * get all
 * Loads all posts from the database sauf ceux hidden. cette fonction sert à afficher sur le site
 * on récupère pas tous les champs juste ceux à afficher
 */
export async function articlesGetAllAction(request: Request, response: Response) {
	/* const entities = await getRepository(Articles)
		.createQueryBuilder("article")
		.select(["article.id", "article.title", "article.miniature", "article.resume",])
		.leftJoinAndSelect(Users.articles, "users")
		.where("article.visible = :visible", { visible: 1 })
		.orderBy("article.date", "DESC")
		.getMany(); */
	let limit = 3
	if (request.query.page === "home") limit = 6;
	const articleRepository = getManager().getRepository(Articles);
	const entities = await articleRepository.find({ select: ["id", "title", "resume", "date"], where: { visible:true }, relations: ["user", "category" ], order: {date: 'DESC'}, take:limit});
	
	response.send(entities);
}



/**
 *  * get all
 * get les stats à afficher sur  la page d'accueil admin : le derniers article publié,  le dernier article de l'utilisateur, les nouveau commentaires,  le nombre d'articles total, le nombre de  followers...
 */
 export async function adminHomeStatsAction(request: Request, response: Response) {
	 const articleRepository = getManager().getRepository(Articles);

	 // dernier article publié sur le site
	 const lastArticle = await articleRepository.find({ select: ["id", "title", "resume", "date", ], where: { visible: true }, relations: ["user", "category"], order: { date: 'DESC' }, take: 1, });

	 // dernier article publié par l'utilisateur
	 //// get id  user
	 let token = jwt.verify(request.headers.authorization, process.env.TOKEN_KEY);
	 const userRepository = getManager().getRepository(Users);
	 /// get article
	 const lastArticleUser = await getRepository(Articles).createQueryBuilder("article")
    .leftJoinAndSelect("article.user", "user")
    .leftJoinAndSelect("article.category", "category")
		 .where("user.id = :id", { id: token.id })
		 .andWhere('article.visible = :visible', { visible: true })
		 .orderBy("article.date", "DESC").limit(1)
    .getOne();
	 
	 let responseData = {
		 lastArticle,
		 lastArticleUser
	 }

	response.send(responseData);
 }



/**
 *  * get all
 * Loads all posts from the database y compris ceux hidden. cette fonction sert à afficher sur l'espace admin
 * on récupère pas tous les champs juste ceux à afficher
 */
export async function articlesGetAllAdminAction(request: Request, response: Response) {
	const entities = await getRepository(Articles)
		.createQueryBuilder("article")
		.select(["article.id", "article.title", "article.image", "article.visible"]).orderBy("article.date", "DESC")
		.getMany();

	response.send(entities);
}


/**
 *  * get by id
 * Loads post by a given id.
 */
export async function articlesGetByIdAction(request: Request, response: Response) {
	// get a post repository to perform operations with post
	const articleRepository = getManager().getRepository(Articles);
	const article = await articleRepository.findOne(request.params.id, { relations: ["comments", "category", "tags", "user"] });
	// if post was not found return 404 to the client
	if (!article) {
		response.status(404);
		response.end("article not found");
		return;
	}
	let responseData = { article: article, apropos: {}, lastarticles: [] }
	
	if (request.query.aside) {
		const textRepository = getManager().getRepository(Texts);
		const aproposTxt = await textRepository.findOne({ where: { key: "résumé à propos" } });
		if (aproposTxt) responseData.apropos = aproposTxt;
		
		const articleRepository = getManager().getRepository(Articles);
		const entities = await articleRepository.find({ select: ["id", "title", "resume", "date"], where: { visible: true }, relations: ["user", "category"], order: { date: 'DESC' }, take: 3, });
		if (entities.length) responseData.lastarticles = entities;
	}


	// return loaded article, les autres articles

	response.send(responseData);
}

/**
 *  * get by id
 * Loads articles by a given id. pour l'espace admin garge aussi les catégores
 */
 export async function adminArticlesGetByIdAction(request: Request, response: Response) {
	 let dataResponse = {article:{},categories:[], tags:[]};
		if (request.params.id === "-1") {
			let columns = await getConnection().getMetadata(Articles).ownColumns.map(column =>   column.propertyName );
			let defaults = await getConnection().getMetadata(Articles).ownColumns.map(column => column.default );
			//let columns = await getConnection().getMetadata(Articles).ownColumns;
			let empty={}
			for (let i = 0; i < columns.length; i++) {
				empty[columns[i]] = defaults[i]	
			}
			dataResponse.article = empty;
		} else {
			
			// get a post repository to perform operations with post
			const articleRepository = getManager().getRepository(Articles);
			const article = await articleRepository.findOne(request.params.id, { relations: ["comments", "category","tags", "user" ] });
			// if post was not found return 404 to the client 
			if (!article) {
				response.status(404);
				response.end("article not found");
				return;
			}
			dataResponse.article = article
		}
	 
	//load les categories
	const catRepository = getManager().getRepository(Categories);
	const cat = await catRepository.find();
	 dataResponse.categories = cat
	 
	 	//load les tags
	const tagsRepository = getManager().getRepository(Tags);
	const tags = await tagsRepository.find();
	dataResponse.tags = tags
		
	response.send(dataResponse);
	}

/**
 * 
 * @param id id d'un article
 * 
 * récupère les articles (juste le titre) qui ne sont pas égales à celui de l'id passé en paramèttre
 * c'est pour afficher la liste des autres articles dans l'asaide
 */
export async function listeAsideGetByIdAction(id) {
	const liste = await getRepository(Articles).createQueryBuilder("article").select(["article.id", "article.title"]).getMany();
	let listaside = liste.filter((article) => {
		return article.id !== parseInt(id);
	});
	return listaside;
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
