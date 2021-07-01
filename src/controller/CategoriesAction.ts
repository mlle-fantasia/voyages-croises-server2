import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Categories } from "../entity/Categories";
import { SubCategories } from "../entity/SubCategories";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");

/**
 * get all pour admin
 * 
 */
export async function GetAllCategoriesAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	const entities = await Repository.find({relations:["subcategories"]});
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

	response.send();
}

/**
 *  * post 
 */
 export async function AdminPostSubCategoryAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	
	let cat = new SubCategories();
	cat.value = request.body.value;
	cat.text = request.body.text;

	const newCat= Repository.create(cat);
console.log(newCat)
	await Repository.save(newCat);

	response.send(newCat);

	response.send();
}

