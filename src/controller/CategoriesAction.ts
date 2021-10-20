import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Categories } from "../entity/Categories";
import { Tags } from "../entity/Tags";
/// les dépendences


/**
 * get all 
 * 
 */
export async function GetAllCategoriesAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	const entities = await Repository.find({ relations: ["articles"] },);
	
	response.send(entities);
}

/**
 * get all tags et categories pour admin avec les articles
 * 
 */
 export async function AdminGetCategoryAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	 const cats = await Repository.find({ relations: ["articles"] });
	 
	 const Repository2 = getManager().getRepository(Tags);
	const tags = await Repository2.find({relations: ["articles"]});
	
	response.send({categories:cats, tags:tags});
}
/**
 * get one pour admin avec les articles
 * 
 */
 export async function AdminGetOneCategoryAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	 const category = await Repository.findOne(request.params.id, {relations: ["articles"]});
	
	response.send(category);
}

/**
 *   admin post 
 */
export async function AdminPostCategoryAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	
	let cat = new Categories();
	cat.value = request.body.value;
	cat.text = request.body.text;

	const newCat= Repository.create(cat);
	await Repository.save(newCat);

	response.send(newCat);
}
/**
 * admin put 
 */
 export async function AdminPutCategoryAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Categories);
	 const category = await Repository.findOne(request.params.id);
	 
	 category.value = request.body.value;
	 category.text = request.body.text;

	// save received post
	await Repository.save(category);

	response.send(category);
 }
/**
 * admin delete 
 */
export async function AdminDeleteCategoryAction(request: Request, response: Response) {
	// vérifier s'il n'y a pas d'articles dans cette catégorie
	const Repository = getManager().getRepository(Categories);
	const entities = await Repository.findOne(request.params.id, { relations: ["articles"] });
	console.log(entities)
	
	await getConnection().createQueryBuilder().delete().from(Categories).where("id = :id", { id: request.params.id }).execute();
	response.send("ok");
}




/// les tags



/**
 *  * post 
 */
 export async function AdminPostTagAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Tags);
	
	let cat = new Tags();
	cat.value = request.body.value;
	cat.text = request.body.text;

	const newTag= Repository.create(cat);
	await Repository.save(newTag);

	response.send(newTag);

 }

 /**
 * get one pour admin avec les articles
 * 
 */
  export async function AdminGetOneTagAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Tags);
	 const tag = await Repository.findOne(request.params.id, {relations: ["articles"]});
	
	response.send(tag);
}

/**
 * admin put 
 */
 export async function AdminPutTagAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Tags);
	 const tag = await Repository.findOne(request.params.id);
	 
	 tag.value = request.body.value;
	 tag.text = request.body.text;

	// save received post
	await Repository.save(tag);

	response.send(tag);
 }
/**
 * admin delete 
 */
export async function AdminDeleteTagAction(request: Request, response: Response) {
	await getConnection().createQueryBuilder().delete().from(Tags).where("id = :id", { id: request.params.id }).execute();
	response.send("ok");
}

