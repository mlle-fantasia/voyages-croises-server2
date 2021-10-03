import { Request, Response } from "express";
import { getManager, getRepository, getConnection } from "typeorm";
/// les entités
import { Articles } from "../entity/Articles";
import { Categories } from "../entity/Categories";
import { Users } from "../entity/Users";
import { Tags } from "../entity/Tags";
import { Texts } from "../entity/Texts";
import { Comments } from "../entity/Comments";
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
	console.log("je passe", );
	const articleRepository = getManager().getRepository(Articles);
	let entities = []
	if (request.query.page === "home") {
		 entities = await articleRepository.find({ select: ["id", "title", "resume", "date"], where: { visible: true,  }, relations: ["user", "category"], order: { date: 'DESC' }, take: 6 });
	}
	else{
		if (request.query.category) {
			const articleCat = getManager().getRepository(Categories);
			const cat = await articleCat.findOne({ select: ["id", "value", "text"], where: { value: request.query.category } });
			entities = await articleRepository.find({ select: ["id", "title", "resume", "date"], where: { visible: true, category: {id: cat.id} }, relations: ["user", "category"], order: { date: 'DESC' } });
		};
		
	}
	
	response.send(entities);
}




/**
 *  * get stats home
 * get les stats à afficher sur  la page d'accueil admin : le derniers article publié,  le dernier article de l'utilisateur, les nouveau commentaires,  le nombre d'articles total, le nombre de  followers...
 */
 export async function adminHomeStatsAction(request: Request, response: Response) {
	 const articleRepository = getManager().getRepository(Articles);

	// nombre d'article
	const nbArticle = await articleRepository.count({ visible: true });
	// nombre de commentaire visibles et non visibles
	const comRepository = getManager().getRepository(Comments);
	const nbComVisible = await comRepository.count({ visible: true });
	 const nbComNotVisible = await comRepository.count({ visible: false });
	 // nombre de tags et de catégories
	 const tagRepository = getManager().getRepository(Tags);
	 const nbTags = await tagRepository.count();
	 const catRepository = getManager().getRepository(Categories);
	const nbCategories = await catRepository.count();

	 // dernier article publié sur le site
	//  const lastArticle = await articleRepository.find({ select: ["id", "title", "resume", "date",], where: { visible: true }, relations: ["user", "category"], order: { date: 'DESC' }, take: 1, });
	const lastArticle = await getRepository(Articles).createQueryBuilder("article")
	 .leftJoinAndSelect("article.user", "user")
	 .leftJoinAndSelect("article.category", "category")
		  .where('article.visible = :visible', { visible: true })
		  .orderBy("article.date", "DESC").limit(1)
	 .getOne();

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
		 lastArticleUser,
		 nbArticle,
		 nbComVisible,
		 nbComNotVisible,
		 nbCategories,
		 nbTags
	 }

	response.send(responseData);
 }



/**
 *  * get all for admin
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
	// remplacer les images 
	// exemple : {{{insertImage:11:template:one}}}
	const regex = new RegExp('({{{[a-zA-Z0-9,:]*}}})', 'g');
	const found = article.contenu.match(regex);
	console.log(found,)
	if (found && found.length) {
		for (let i = 0; i < found.length; i++) {
			let str1 = found[i];
			let str = str1.substring(3, str1.length - 3)
			let tab = str.split(":");
			let htmlImage = "";
			let template = tab[3];
			// template one
			if (template === "one") {
				let id = tab[1];
				htmlImage = `<div><img class="img-fluid template-image-${template}" src="${process.env.SERVER_URL}/files/${id}" alt="image"/></div>`;
			}
			//template masonry
			if (template === "masonry") {
				let tabids = tab[1].split(",");
				htmlImage = `<div v-masonry="containerId" transition-duration="0.3s" item-selector=".item">`;
				for (let j = 0; j < tabids.length; j++) {
					const id = tabids[j];
					htmlImage += `<div v-masonry-tile class="mb-4 item"><img class="img-fluid template-image-${template}" src="${process.env.SERVER_URL}/files/${id}" alt="image"/></div>`;
				}
				htmlImage +=`</div>`
			}
			//template flex
			if (template === "flex") {
				let tabids = tab[1].split(",");
				htmlImage = `<div class="d-flex flex-wrap p-2 align-items-stretch">`;
				for (let j = 0; j < tabids.length; j++) {
					const id = tabids[j];
					htmlImage += `<div class=" p-1 flex-fill" style="max-width:50%;"><img class="img-fluid h-100 template-image-${template}" src="${process.env.SERVER_URL}/files/${id}" alt="image"/></div>`;
				}
				htmlImage +=`</div>`
			}
			article.contenu = article.contenu.replace(str1, htmlImage);

		}
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
 *  * get by id admin
 * Loads articles by a given id. pour l'espace admin charge aussi les catégores
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
