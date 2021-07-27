import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Texts } from "../entity/Texts";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");




/**
 * 
 */
 export async function adminPostTextAction(request: Request, response: Response) {
	// get a post repository to perform operations with post
	const pageRepository = getManager().getRepository(Texts);
	
	let text = new Texts();
	text.text = request.body.text;
	text.key = request.body.key;
	text.pages = request.body.pagesId;


	const newText = pageRepository.create(text);
console.log(newText)
	// save received post
	await pageRepository.save(newText);

	// return saved post back
	response.send(newText);
}


/**
 * modifer plusieurs text  depuis l'admin
 * un tableau de texts est passé en paramettre de la requête
 */
export async function adminPutTextsAction(request: Request, response: Response) {

	// get a post repository to perform operations with post
	const TextsRepository = getManager().getRepository(Texts);
	console.log("request.body.texts", request.body)
	
	for (let i = 0; i < request.body.length; i++) {
		const text = request.body[i];
		
		const textfinded = await TextsRepository.findOne(text.id);
		if (!textfinded) continue;
		console.log("text.text", textfinded.key  ,   text.text);
		textfinded.text = text.text;
		textfinded.key = text.key;
		
		// save received text
		console.log("textfinded", textfinded);
		await TextsRepository.save(textfinded);
		
	}


	// return saved post back
	response.send("ok");
}

