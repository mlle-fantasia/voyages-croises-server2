import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { Users } from "../entity/Users";
var jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

/**
 * 
 */
 export async function autoAuthAction(request: Request, response: Response) {
	const userRepository = getManager().getRepository(Users);
	 console.log("request.body", request.body)
	 // décripté l'id dans le token 
	 let decoded = {id:0};
		try {
			decoded = jwt.verify(request.body.token, process.env.TOKEN_KEY);
		} catch (error) {
			return response.status(401).send({ err: "user_not_found", errtxt: "utilisateur non trouvé" });
		}
		// chercher l'utilisateur
		const user = await userRepository.findOne({
			where: {
				id: decoded.id,
			},
		});
		// si pas de user
		if (!user) return response.status(401).send({ err: "user_not_found", errtxt: "utilisateur non trouvé" });
		console.log(user)
		// si un user
		let token = generateToken(user);
		response.send({ token, user});

}


/**
 * 
 */
export async function authAction(request: Request, response: Response) {
	const userRepository = getManager().getRepository(Users);
	console.log("request.body", request.body)
	const user = await userRepository.findOne({
		where: {
			email: request.body.login,
		},
	});
	console.log(user)
	if (!user) {
		response.status(401);
		response.send("pas ok login");
		return;
	}
	let hash = user.password;
		bcrypt.compare(request.body.pass, hash).then(async function (res) {
 			if (res) {
				let token = generateToken(user);
				user.password = "";
				response.send({ token, user});
				return;
			} else {
				response.status(401);
				response.send("pas ok mot de passe");
				return;
			}

		}).catch((err) => {
			response.status(500);
			response.send("error");
		});

}

function generateToken(user) {
	var jeton = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60, id: user.id}, process.env.TOKEN_KEY);
	return jeton;
}
