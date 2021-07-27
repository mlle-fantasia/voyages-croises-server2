import { LOADIPHLPAPI } from "dns";
import { Request, Response } from "express";
import { getManager, getRepository, getConnection } from "typeorm";
import { Users } from "../entity/Users";
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");

/**
 * Loads all posts from the database.
 */
export async function userGetAction(request: Request, response: Response) {
	const entities = await getRepository(Users)
		.createQueryBuilder("user")
		.select(["user.id", "user.email", "user.firstname", ])
		.getMany();
	response.send(entities);
}

export async function userGetOneAction(request: Request, response: Response) {
	let dataResponse={user:{}}
	if (request.params.id === "-1") {
		let columns = await getConnection().getMetadata(Users).ownColumns.map(column => column.propertyName);
		let defaults = await getConnection().getMetadata(Users).ownColumns.map(column => column.default);
		//let columns = await getConnection().getMetadata(Articles).ownColumns;
		let empty = {}
		for (let i = 0; i < columns.length; i++) {
			empty[columns[i]] = defaults[i]
		}
		dataResponse.user = empty;
	} else {
		const userRepository = getManager().getRepository(Users);
		dataResponse.user = await userRepository.findOne(request.params.id);
	}
	response.send(dataResponse);
}

export async function userPutAction(request: Request, response: Response) {
	const userRepository = getManager().getRepository(Users);

	const user = await userRepository.findOne(request.params.id);

	user.email = request.body.email;
	user.firstname = request.body.firstname;
	user.birthday = request.body.birthday;
	if (request.body.password) {
		user.password = bcrypt.hashSync(request.body.password, 10);
	}
console.log(user)

	await userRepository.save(user);
	response.send(user);
}

export async function userPostAction(request: Request, response: Response) {
	const userRepository = getManager().getRepository(Users);

	let user = new Users();
	user.email = request.body.email;
	user.firstname = request.body.firstname;
	user.password = request.body.password;
	user.birthday = request.body.birthday;

	const  newUser = await userRepository.create(user);
	// save received post
	await userRepository.save(newUser);

	// return saved post back
	response.send(newUser);
}


export async function newMessageAction(request: Request, response: Response) {
	console.log("request.body", request.body,)
	response.send("ok");
}

