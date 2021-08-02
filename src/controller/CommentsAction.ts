import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Categories } from "../entity/Categories";
import { Comments } from "../entity/Comments";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");

/**
 * récupère tous les commentaires non visible pour l'espace admin
 * 
 */
export async function commentsGetAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Comments);
	const entities = await Repository.find({ where: { visible: false} });
	
	response.send(entities);
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
 * su^pprimer un commentaire
 * 
 */
export async function commentsDeleteAction(request: Request, response: Response) {
	await getConnection().createQueryBuilder().delete().from(Comments).where("id = :id", { id: request.params.id }).execute();
	response.send("ok");

}



