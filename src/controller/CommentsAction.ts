import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Users } from "../entity/Users";
import { Comments } from "../entity/Comments";
import { Articles } from "../entity/Articles";
import { CommentsResponses } from "../entity/CommentsResponses";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");
var jwt = require("jsonwebtoken");

/**
 * récupère tous les commentaires et les réponses non visible pour l'espace admin et tous les commentaires par articles
 * 
 */
export async function commentsGetAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Comments);
	const comNotVisible = await Repository.find({ where: { visible: false }, relations: ["articles"], });

	const RepositoryResponses = getManager().getRepository(CommentsResponses);
	const ResponsesNotVisible = await RepositoryResponses.find({ where: { visible: false }, relations: ["comment", "comment.responses", "comment.articles"], });

	const articleRepository = getManager().getRepository(Articles);
	let all = await articleRepository.find({ select: ["id", "title", "date"], where: { visible: true }, relations: ["category", "comments"], order: { date: 'DESC' } });
	
	let allCom = all.filter((article) => {
		return article.comments.length
	});
	
	let comData = {
		notVisible: comNotVisible,
		responsesNotVisible: ResponsesNotVisible,
		allComments:allCom
	}
	response.send(comData);
}

/**
 * ajouter une réponse à un commentaire
 * 
 */
export async function commentPostResponseAction(request: Request, response: Response) {
	 
	const commentsRepository = getManager().getRepository(Comments);
	const comment = await commentsRepository.findOne(request.params.id);

	const Repository = getManager().getRepository(CommentsResponses);

	let files = [];let numImage = 0
	if (request.headers.authorization) {
		let token = jwt.verify(request.headers.authorization, process.env.TOKEN_KEY);
		const userRepository = getManager().getRepository(Users);
		const user = await userRepository.findOne({ where: { id: token.id } });
		files = fs.readdirSync(process.cwd() + "/images/useravatars");
		if(user.firstname === "Marina") numImage = 2

	} else {
		numImage = Math.floor(Math.random() * 6); // de 0 à 5
		files = fs.readdirSync(process.cwd() + "/images/avatars");
	}
	
	
	let dataResponse = {
	   contenu: request.body.contenu,
	   visible: request.body.visible,
	   name: request.body.name,
	   email: request.body.email,
	   image: files[numImage],
	   image_alt:"",
	   comment : comment
	}
 
	await Repository.save(dataResponse);

	response.send("ok");

}

/**
 * récupère l'image  d'un commentaire
 * 
 */
 export async function commentsGetImageAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Comments);
	 const comment = await Repository.findOne(request.params.id);
	 
	 console.log(comment)
	
	let filenameDest = process.cwd() + "/images/" + comment.image ;
	if (!fs.existsSync(filenameDest)) return response.send("not_found");

	let readStream = fs.createReadStream(filenameDest);
	readStream.pipe(response);
}


/**
 * modifier un commentaire (modifier visible ou non visible seulment pour le moment)
 * 
 */
export async function commentsPutAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Comments);
	const comment = await Repository.findOne(request.params.id);
	comment.visible = request.body.visible;
	await Repository.save(comment);
	
   response.send(comment);
}

/**
 * modifier une response (modifier visible ou non visible seulement pour le moment)
 * 
 */
 export async function responsePutAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(CommentsResponses);
	const responseCom = await Repository.findOne(request.params.id);
	responseCom.visible = request.body.visible;
	await Repository.save(responseCom);
	
   response.send(responseCom);
}


/**
 * su^pprimer un commentaire
 * 
 */
export async function commentsDeleteAction(request: Request, response: Response) {
	await getConnection().createQueryBuilder().delete().from(Comments).where("id = :id", { id: request.params.id }).execute();
	response.send("ok");

}



