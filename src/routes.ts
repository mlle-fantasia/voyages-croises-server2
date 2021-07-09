import { userGetAction,userGetOneAction, userPutAction,userPostAction } from "./controller/UsersAction";
import { adminHomeStatsAction, articlesGetAllAction, articlesGetAllAdminAction , articlesGetMiniatureAction, articlesGetByIdAction, adminArticlesGetByIdAction} from "./controller/ArticlesGetAllAction";
import {
	articlesSaveAction,
	articlesPutAction,
	articlesPostMiniatureAction,
	articlesDeleteArticlesAction,
	articlesPutByIdCommentAction
} from "./controller/ArticlesSaveAction";
import { authAction, autoAuthAction } from "./controller/AuthentificationAction";
import { adminGetAllPagesAction, adminGetOnePageAction , pagePutAction , pagePostAction} from "./controller/PagesAction";


import { Request, Response } from "express";

var jwt = require("jsonwebtoken");

function authMiddleware(request: Request, response: Response, next) {
	try {
		jwt.verify(request.headers.authorization, process.env.TOKEN_KEY);
		next();
	} catch (error) {
		response.status(401).send();
	}
}

/**
 * All application routes.
 */
export const AppRoutes = [
	{
		path: "/",
		method: "get",
		action: articlesGetAllAction,
		middlewares: [],
	},
	{
		path: "/login",
		method: "post",
		action: authAction,
		middlewares: [],
	},
	{
		path: "/autologin",
		method: "post",
		action: autoAuthAction,
		middlewares: [],
	},
	{
		path: "/articles/list",
		method: "get",
		action: articlesGetAllAction,
		middlewares: [],
	},
	{
		path: "/articles/:id",
		method: "get",
		action: articlesGetByIdAction,
		middlewares: [],
	},
	{
		path: "/articles/:id/newcomment",
		method: "put",
		action: articlesPutByIdCommentAction,
		middlewares: [],
	},
	{
		path: "/admin/users",
		method: "get",
		action: userGetAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/users/:id",
		method: "get",
		action: userGetOneAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/users/add",
		method: "post",
		action: userPostAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/users/:id",
		method: "put",
		action: userPutAction,
		middlewares: [authMiddleware],
	},

	{
		path: "/admin/articles/add",
		method: "post",
		action: articlesSaveAction,
		middlewares: [authMiddleware],
	},
	
/* 	{
		path: "/admin/articles/hide/:id",
		method: "put",
		action: articlesHiddenAction,
		middlewares: [authMiddleware],
	}, */
	{
		path: "/admin/home",
		method: "get",
		action: adminHomeStatsAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/list",
		method: "get",
		action: articlesGetAllAdminAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/:id",
		method: "put",
		action: articlesPutAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/:id",
		method: "delete",
		action: articlesDeleteArticlesAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/:id",
		method: "get",
		action: adminArticlesGetByIdAction,
		middlewares: [],
	},
	{
		path: "/admin/articles/:id/image",
		method: "post",
		action: articlesPostMiniatureAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/articles/:id/image",
		method: "get",
		action: articlesGetMiniatureAction,
		middlewares: [],
	},
	{
		path: "/admin/pages/list",
		method: "get",
		action: adminGetAllPagesAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/pages/:id",
		method: "get",
		action: adminGetOnePageAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/pages/add",
		method: "post",
		action: pagePostAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/pages/:id",
		method: "put",
		action: pagePutAction,
		middlewares: [authMiddleware],
	},
	
];
