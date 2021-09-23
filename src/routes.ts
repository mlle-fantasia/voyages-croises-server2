import { userGetAction,userGetOneAction, userPutAction,userPostAction, newMessageAction } from "./controller/UsersAction";
import { adminHomeStatsAction, articlesGetAllAction,  articlesGetAllAdminAction , articlesGetMiniatureAction, articlesGetByIdAction, adminArticlesGetByIdAction} from "./controller/ArticlesGetAllAction";
import {
	articlesSaveAction,
	articlesPutAction,
	articlesPostMiniatureAction,
	articlesDeleteArticlesAction,
	articlesPutByIdCommentAction
} from "./controller/ArticlesSaveAction";
import { commentsGetAction, commentsPutAction, commentsDeleteAction,  commentsGetImageAction, commentPostResponseAction, responsePutAction } from "./controller/CommentsAction";
import { authAction, autoAuthAction } from "./controller/AuthentificationAction";
import {siteGetOnePageAction, adminGetAllPagesAction, adminGetOnePageAction , adminPagePostAction ,adminPageDeleteAction,  adminPagePutAction, adminPagePostImageAction, pagesGetImageAction} from "./controller/PagesAction";
import { adminPutTextsAction, adminPostTextAction  } from "./controller/TextsAction";
import { AdminPostCategoryAction,AdminPostTagAction, GetAllCategoriesAction, AdminGetCategoryAction, AdminGetOneCategoryAction, AdminPutCategoryAction, AdminDeleteCategoryAction, AdminGetOneTagAction, AdminPutTagAction, AdminDeleteTagAction  } from "./controller/CategoriesAction";

import { getManager, getRepository } from "typeorm";
import { Users } from "./entity/Users";

import { Request, Response } from "express";

var jwt = require("jsonwebtoken");

async function authMiddleware(request: Request, response: Response, next) {
	let decoded = {id:0};
	try {
		 decoded = jwt.verify(request.headers.authorization, process.env.TOKEN_KEY);

		next();
	} catch (error) {
		response.status(401).send();
	}
	const userRepository = getManager().getRepository(Users);
	const user = await userRepository.findOne({
		where: {
			id: decoded.id,
		},
	});
	if (user) {
		//request.user = user;
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
		path: "/categories",
		method: "get",
		action: GetAllCategoriesAction,
		middlewares: [],
	},
	/* catégories et tags */
	{
		path: "/admin/categories/list",
		method: "get",
		action: AdminGetCategoryAction,
		middlewares: [authMiddleware],
	},
	/*  les catégories */
	{
		path: "/admin/categories/:id",
		method: "get",
		action: AdminGetOneCategoryAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/categories/add",
		method: "post",
		action: AdminPostCategoryAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/categories/:id",
		method: "put",
		action: AdminPutCategoryAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/categories/delete/:id",
		method: "delete",
		action: AdminDeleteCategoryAction,
		middlewares: [authMiddleware],
	},
	/* les tags */
	{
		path: "/admin/tags/add",
		method: "post",
		action: AdminPostTagAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/tags/:id",
		method: "get",
		action: AdminGetOneTagAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/tags/:id",
		method: "put",
		action: AdminPutTagAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/tags/:id",
		method: "delete",
		action: AdminDeleteTagAction,
		middlewares: [authMiddleware],
	},
	/*  les comments */
	{
		path: "/admin/comments",
		method: "get",
		action: commentsGetAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/comments/:id",
		method: "put",
		action: commentsPutAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/CommentsResponses/:id",
		method: "put",
		action: responsePutAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/comments/:id",
		method: "delete",
		action: commentsDeleteAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/comments/:id/newresponse",
		method: "post",
		action: commentPostResponseAction,
		middlewares: [],
	},
	{
		path: "/comments/:id/image",
		method: "get",
		action: commentsGetImageAction,
		middlewares: [],
	},
	{
		path: "/pages/:key",
		method: "get",
		action: siteGetOnePageAction,
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
		path: "/newmessage",
		method: "post",
		action: newMessageAction,
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
		action: adminPagePostAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/pages/delete/:id",
		method: "delete",
		action: adminPageDeleteAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/pages/:id",
		method: "put",
		action: adminPagePutAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/pages/:id/image",
		method: "post",
		action: adminPagePostImageAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/pages/:id/image",
		method: "get",
		action: pagesGetImageAction,
		middlewares: [],
	},
	// texts
	{
		path: "/admin/texts/add",
		method: "post",
		action: adminPostTextAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/texts/edit",
		method: "put",
		action: adminPutTextsAction,
		middlewares: [authMiddleware],
	},
	
];
