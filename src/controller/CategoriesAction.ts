import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Categories } from "../entity/Categories";
import { Tags } from "../entity/Tags";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");

/**
 * get all 
 * 
 */
export async function GetAllCategoriesAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	const entities = await Repository.find({});
	console.log(entities)
	
	response.send(entities);
}

/**
 *  * post 
 */
export async function AdminPostCategoryAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	
	let cat = new Categories();
	cat.value = request.body.value;
	cat.text = request.body.text;

	const newCat= Repository.create(cat);
console.log(newCat)
	await Repository.save(newCat);

	response.send(newCat);

}

/**
 *  * post 
 */
 export async function AdminPostTagAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Tags);
	
	let cat = new Tags();
	cat.value = request.body.value;
	cat.text = request.body.text;

	const newTag= Repository.create(cat);
console.log(newTag)
	await Repository.save(newTag);

	response.send(newTag);

}

