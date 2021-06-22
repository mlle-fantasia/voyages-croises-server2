import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { Users } from "../entity/Users";
const fs = require("fs-extra");
const path = require("path");

/**
 * Loads all posts from the database.
 */
export async function userGetAction(request: Request, response: Response) {
	const entities = await getRepository(Users)
		.createQueryBuilder("user")
		.select(["user.id", "user.email", "user.tel", "user.address", "user.city", "user.area", "user.cv"])
		.getMany();
	response.send(entities);
}

export async function userPutAction(request: Request, response: Response) {
	const userRepository = getManager().getRepository(Users);

	const moi = await userRepository.findOne(request.params.id);

	moi.email = request.body.email;

	await userRepository.save(moi);
	response.send(moi);
}

/* export async function userPostCv(req, res) {
	const userRepository = getManager().getRepository(User);
	const moi = await userRepository.findOne(req.params.id);

	let ext = path.extname(req.files.cv.name).toLowerCase();
	fs.removeSync(process.cwd() + "/uploads/cv");
	fs.ensureDirSync(process.cwd() + "/uploads/cv");

	// formater une date : DD-MM-YYYY pour renommer le cv
	let datenow = new Date();
	let day: string | number = datenow.getDate();
	if (day < 10) day = `0${day}`;
	let month: string | number = datenow.getMonth() + 1;
	if (month < 10) month = `0${month}`;
	let year = datenow.getFullYear();
	let date = day + "-" + month + "-" + year;

	let cvName = "cv-" + date + ext;
	let filenameOrigin = process.cwd() + "/uploads/cv/" + cvName;
	req.files.cv.mv(filenameOrigin, async function (err) {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		moi.cv = cvName;
		await userRepository.save(moi);

		res.send("ok");
	});
} */
