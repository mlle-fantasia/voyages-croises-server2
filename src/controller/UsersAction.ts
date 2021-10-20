import { Request, Response } from "express";
import { getManager, getRepository, getConnection } from "typeorm";
import { Users } from "../entity/Users";
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");
const mustache = require("mustache");

const includeMail = {
	header: fs.readFileSync("viewsemail/headerMail.html", "utf8"),
	footer: fs.readFileSync("viewsemail/footerMail.html", "utf8"),
};

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
	//console.log("ici",request)
	user.email = request.body.email;
	if(request.body.type.value)user.type = request.body.type.value;
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
	user.type = request.body.type.value;
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
	console.log( process.env.MAILJET_APIKEY,process.env.MAILJET_SECRETKEY )
	const mailjet = require("node-mailjet").connect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY);
	let obj = {
		name: request.body.name,
		email:request.body.email,
		message: request.body.message,
	};
	let html = fs.readFileSync("viewsemail/contactUs.html", "utf8");
	let email = mustache.render(html, obj, includeMail);
	const requete = mailjet.post("send", { version: "v3.1" }).request({
		Messages: [
			{
				From: {
					Email: "marinafront@hotmail.fr",
					Name: "voyages-croises",
				},
				To: [
					{
						Email: "marinafront@hotmail.fr",
						Name: "voyages-croises",
					},
				],
				Subject: "Voyages croisés : Nouveau message ",
				TextPart: "",
				HTMLPart: email,
				CustomID: "AppGettingStartedTest",
			},
		],
	});
	requete
		.then((result) => {
			response.send({ success: "message_envoye", successtxt: "Votre message a bien été envoyé" });
		})
		.catch((err) => {
			console.log(err);
			response.send({ err: "message_error", errtxt: "Nous sommes désolé, une erreur est survenue" });
		}); 
	



	//response.send("ok");
}

