import { Request, Response } from "express";
import { getManager, getRepository, getConnection, SimpleConsoleLogger } from "typeorm";
/// les entités
import { Files } from "../entity/Files";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");
var slug = require("slug");


/**
 * get file du dossier upload route publique
 * route : "/files/:id"
 * 
 */
export async function GetFileAction(request: Request, response: Response) {
	console.log("request.params.id", request.params.id);
	let filenameDest = "";
	if (!Number.isInteger(parseInt(request.params.id))) {
		if(request.params.id === "iconimage1")filenameDest = process.cwd() + "/images/icon-images-solid1.png";
		if(request.params.id === "iconimage2")filenameDest = process.cwd() + "/images/icon-images-solid2.png";
		if(request.params.id === "iconimage3")filenameDest = process.cwd() + "/images/icon-images-solid3.png";
	} else {
		const Repository = getManager().getRepository(Files);
		const file = await Repository.findOne(request.params.id);
		console.log('file', file);
		filenameDest = process.cwd() + "/uploads/"+request.params.type+"/" + request.params.id + file.ext;
		if (!fs.existsSync(filenameDest)) return response.send("not_found");
	}
   let readStream = fs.createReadStream(filenameDest);
   readStream.pipe(response);
 }


/**
 * get all files de la tables files
 * 
 */
export async function GetAllFilesAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Files);
	const entities = await Repository.find({});
	
	response.send(entities);
}

/**
 * get all files de la tables files
 * 
 */
 export async function GetFileTypeAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Files);
	const entities = await Repository.find({where:{ type: request.params.type }, order: { createdAt: 'DESC' }});
	
	response.send(entities);
}

//// admin 
 /**
 * on recoit un tableau des fichiers instagram, il faut supprimer la diférence
 *  
 */
export async function PostFilesInstagram1Action(req, res) {
	const Repository = getManager().getRepository(Files);
	const entities = await Repository.find({ where: { type: "instagram" } });
	console.log("entities", entities, req.body);
	for (let i = 0; i < entities.length; i++) {
		const file = entities[i];
		let index = req.body.findIndex((file1) => {
			return file1.id === file.id
		});
		console.log("index", index, file.id );
		if (index < 0) {
			let filenameOrigin = process.cwd() + "/uploads/instagram/" + file.id + file.ext;
			if(fs.existsSync(filenameOrigin))fs.removeSync(filenameOrigin);
			await getConnection().createQueryBuilder().delete().from(Files).where("id = :id", { id: file.id }).execute();
		} else {
			const fileToUpdate = await Repository.findOne(file.id);

			fileToUpdate.alt = req.body[index].alt;
			fileToUpdate.description = req.body[index].description;
		   	await Repository.save(fileToUpdate);
		}
	}

	res.send("ok");
}
 /**
 * 
 *  
 */
  export async function PostFilesInstagram2Action(req, res) {
	const Repository = getManager().getRepository(Files);
	let ext = path.extname(req.files.image.name).toLowerCase();
	let name = slug(path.parse(req.files.image.name).name) + ext;
	console.log("req.files", req.files)
	// save in table
	let file = new Files();
	file.alt = req.body.alt ? req.body.alt : "";
	file.description = req.body.description ? req.body.description : "";
	file.ext = ext;
	file.name = name;
	file.type = "instagram";
	let fileSaved = await Repository.save(file);
	  
	// save in uploads
	fs.ensureDirSync(process.cwd() + "/uploads/instagram");
	let filenameOrigin = process.cwd() + "/uploads/instagram/" + fileSaved.id + ext;
	req.files.image.mv(filenameOrigin, async function (err) {
		if (err) return res.status(500).send(err);

		res.send("ok");
	});
}

/**
 * get file du dossier upload
 * route : "/admin/files/:id/miniature"
 * 
 */
 export async function GetOneFileAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Files);
	 const file = await Repository.findOne(request.params.id);

	let filenameDest = process.cwd() + "/uploads/images/" + request.params.id + file.ext;
	if (!fs.existsSync(filenameDest)) return response.send("not_found");

	let readStream = fs.createReadStream(filenameDest);
	readStream.pipe(response);
 }


 /**
 * 
 * @param request 
 * @param response
 * enregistre l'image  
 * sous le nom : id du file
 *  
 */
export async function filesPostAction(req, res) {


	let ext = path.extname(req.files.image.name).toLowerCase();
	fs.ensureDirSync(process.cwd() + "/uploads/images");
	let filenameOrigin = process.cwd() + "/uploads/images/article" + req.params.id + ext;
	req.files.image.mv(filenameOrigin, async function (err) {
		if (err) return res.status(500).send(err);

		res.send("ok");
	});
}

/**
 * admin put 
 */
 export async function AdminPutFileAction(request: Request, response: Response) {
	const Repository = getManager().getRepository(Files);
	 const file = await Repository.findOne(request.params.id);
	 
	 file.name = request.body.name;
	 file.alt = request.body.alt;
	 file.description = request.body.description;

	// save received post
	await Repository.save(file);

	response.send(file);
 }


/**
 * admin delete file dans la  table et dans uploads 
 */
export async function AdminDeleteFileAction(request: Request, response: Response) {
	console.log("coucou");
	const Repository = getManager().getRepository(Files);
	const file = await Repository.findOne(request.params.id);
	// delete image dans upload
	fs.ensureDirSync(process.cwd() + "/uploads/images");
	let filenameOrigin = process.cwd() + "/uploads/images/" + request.params.id + file.ext;
	console.log(filenameOrigin);
	fs.removeSync(filenameOrigin);
	// delete dans la table
	await getConnection().createQueryBuilder().delete().from(Files).where("id = :id", { id: request.params.id }).execute();
	
	response.send("ok");
}

/**
 * admin post files dans la table 
 */
 export async function PostFilesAction(request: Request, response: Response) {
	 const Repository = getManager().getRepository(Files);

	 for (let i = 0; i < request.body.length; i++) {
		 const file1 = request.body[i];
		 
		 let file = new Files();
		 file.alt = file1.alt?file1.alt: "";
		 file.description = file1.description?file1.description : "";
		// save received post
		 let fileSaved = await Repository.save(file);
		 console.log(fileSaved)
		 file1.id = fileSaved.id
	 }

   response.send(request.body);
 }

 /**
 * admin post files dans upload 
 */
  export async function PostFilesImageAction(req, res) {
	const Repository = getManager().getRepository(Files);
	const file = await Repository.findOne(req.params.id);
	  

	let ext = path.extname(req.files.image.name);
	let name = slug(path.parse(req.files.image.name).name) + ext;
	fs.ensureDirSync(process.cwd() + "/uploads/images");
	  let filenameOrigin = process.cwd() + "/uploads/images/" + req.params.id + ext;
	  req.files.image.mv(filenameOrigin, async function (err) {
		  if (err) return res.status(500).send(err);
		  var stat = fs.statSync(filenameOrigin);
		  
		file.ext = ext;
		file.size = stat.size;
		file.name = name;
		await Repository.save(file);

		res.send("ok");
	});
	
}

