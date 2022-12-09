/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as jwt from "jsonwebtoken";
import { Service, ServiceBroker, Context } from "moleculer";
import ApiGateway from "moleculer-web";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swStats from "swagger-stats";
import { Config } from "../common";
import swaggerSpec = require("../swagger.json");
import { RequestMessage } from "../types";
const tlBucket = 60000;
const swMiddleware = swStats.getMiddleware({
	name: "swagger-stats",
	timelineBucketDuration: tlBucket,
	uriPath: "/dashboard",
	swaggerSpec,
});

export default class ApiService extends Service {

	public constructor(broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "api",
			mixins: [ApiGateway],
			// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
			settings: {
				port: process.env.PORT || 3000,

				use: [
					cookieParser(),
					helmet({
						contentSecurityPolicy: {
							directives: {
								"default-src": ["'self'"],
								"base-uri": ["'self'"],
								// "block-all-mixed-content",
								"font-src": ["'self'"],
								"frame-ancestors": ["'self'"],
								"img-src": ["'self'"],
								"object-src": ["'none'"],
								"script-src": ["'self'", "'unsafe-inline'"],
								"script-src-attr": ["'none'"],
								"style-src": ["'self'", "'unsafe-inline'"],
								"upgrade-insecure-requests": [],
							},
						},
					}),
				],
				routes: [
					// Moleculer-auto-openapi routes
					{
						path: "/openapi",
						aliases: {
							"GET /openapi.json": "openapi.generateDocs", // Swagger scheme
							"GET /ui": "openapi.ui", // Ui
						},
					},
					{
						path: "/authorized",
						whitelist: ["$node.*", "api.listAliases"],
						authorization: true,
						authentication: true,
						// Roles: [UserRole.SUPERADMIN],
						aliases: {
							"GET /health": "$node.health",
							"GET /services": "$node.services",
							"GET /actions": "$node.actions",
							"GET /list": "$node.list",
							"GET /metrics": "$node.metrics",
							"GET /events": "$node.events",
							"GET /options": "$node.options",
							"GET /aliases": "api.listAliases",
						},
					},
					{
						path: "/api",
						cors: {
							origin: ["*"],
							methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
							credentials: false,
							maxAge: 3600,
						},
						whitelist: [
							// Access to any actions in all services under "/api" URL
							"**",
						],
						// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
						use: [swMiddleware],
						// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
						mergeParams: true,

						// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
						authentication: false,

						// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
						authorization: false,

						// The auto-alias feature allows you to declare your route alias directly in your services.
						// The gateway will dynamically build the full routes from service schema.
						autoAliases: true,

						aliases: {
							"GET /": (req: any, res: any) => {
								// Console.log(swStats.getPromClient());
								res.statusCode = 302;
								res.setHeader("Location", "/api/dashboard/");
								return res.end();
							},
							"GET /stats": (req: any, res: any) => {
								res.setHeader("Content-Type", "application/json");
								return res.end(JSON.stringify(swStats.getCoreStats()));
							},
							"GET /metrics": (req: any, res: any) => {
								res.setHeader("Content-Type", "application/json");
								return res.end(JSON.stringify(swStats.getPromStats()));
							},

							"POST /auth/sign-up": "auth.signUp",
							"GET /auth/confirm": "auth.confirmSignUp",
						},
						/**
						 * Before call hook. You can check the request.
						 * @param {Context} ctx
						 * @param {Object} route
						 * @param {IncomingMessage} req
						 * @param {ServerResponse} res
						 * @param {Object} data
						onBeforeCall(ctx: Context<any,{userAgent: string}>,
						 route: object, req: IncomingMessage, res: ServerResponse) {
						  Set request headers to context meta
						  ctx.meta.userAgent = req.headers["user-agent"];
						},
						 */

						/**
						 * After call hook. You can modify the data.
						 * @param {Context} ctx
						 * @param {Object} route
						 * @param {IncomingMessage} req
						 * @param {ServerResponse} res
						 * @param {Object} data
						 *
						 onAfterCall(ctx: Context, route: object, req: IncomingMessage, res: ServerResponse, data: object) {
						// Async function which return with Promise
						return doSomething(ctx, res, data);
					},
						 */

						// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
						callingOptions: {},

						bodyParsers: {
							json: {
								strict: false,
								limit: "1MB",
							},
							urlencoded: {
								extended: true,
								limit: "1MB",
							},
						},

						// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
						mappingPolicy: "all", // Available values: "all", "restrict"

						// Enable/disable logging
						logging: true,
					},
					{
						path: "/admin",
						cors: {
							origin: ["*"],
							methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
							credentials: false,
							maxAge: 3600,
						},
						whitelist: [
							// Access to any actions in all services under "/api" URL
							"**",
						],
						// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
						use: [swMiddleware],
						// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
						mergeParams: true,

						// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
						authentication: true,

						// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
						authorization: false,

						// The auto-alias feature allows you to declare your route alias directly in your services.
						// The gateway will dynamically build the full routes from service schema.
						autoAliases: true,

						aliases: {
							"GET /": (req: any, res: any) => {
								// Console.log(swStats.getPromClient());
								res.statusCode = 302;
								res.setHeader("Location", "/api/dashboard/");
								return res.end();
							},
							"GET /stats": (req: any, res: any) => {
								res.setHeader("Content-Type", "application/json");
								return res.end(JSON.stringify(swStats.getCoreStats()));
							},
							"GET /metrics": (req: any, res: any) => {
								res.setHeader("Content-Type", "application/json");
								return res.end(JSON.stringify(swStats.getPromStats()));
							},
						},

						// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
						callingOptions: {},

						bodyParsers: {
							json: {
								strict: false,
								limit: "1MB",
							},
							urlencoded: {
								extended: true,
								limit: "1MB",
							},
						},

						// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
						mappingPolicy: Config.MAPPING_POLICY, // Available values: "all", "restrict"

						// Enable/disable logging
						logging: true,
					},
				],
				// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
				log4XXResponses: false,
				// Logging the request parameters. Set to any log level to enable it. E.g. "info"
				logRequestParams: null,
				// Logging the response data. Set to any log level to enable it. E.g. "info"
				logResponseData: null,
				// Serve assets from "public" folder
				assets: {
					folder: "public",
					// Options to `server-static` module
					options: {},
				},
			},

			methods: {

				/**
				 * Authenticate the request. It checks the `Authorization` token value in the request header.
				 * Check the token value & resolve the user by the token.
				 * The resolved user will be available in `ctx.meta.user`
				 *
				 * PLEASE NOTE, IT"S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
				 *
				 * @param {Context} ctx
				 * @param {any} route
				 * @param {IncomingMessage} req
				 * @returns {Promise}
				 */
				authenticate: async (
					ctx: Context<Record<string, unknown>, any>,
					route: any,
					req: RequestMessage,
				): Promise<unknown> => {
					const auth = req.headers.authorization;

					if (auth) {
						const type = auth.split(" ")[0];
						let token: string | undefined;
						if (type === "Token" || type === "Bearer") {
							token = auth.split(" ")[1];
						}

						if (token) {
							try {
								// TODO: Verify token
								// Const decoded = await jwt.verify(token, Config.JWT_SECRET);
								const user = await this.broker.call("users.resolveToken", { token });
								if (user) {
									ctx.meta.user = user;
									return Promise.resolve(user);
								}
							} catch (error) {
								this.logger.error("Authentication error", error);
							}
						}
						console.log("Authentication token failed");
						return Promise.reject(new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN, null));
					}
					console.log("Authentication auth failed");
					return Promise.reject(new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_NO_TOKEN, null));
				},

				/**
				 * Authorize the request. Check that the authenticated user has right to access the resource.
				 *
				 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
				 *
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingMessage} req
				 * @returns {Promise}

				async authorize (ctx: Context < any, {
					user: string;
				} > , route: Record<string, undefined>, req: IncomingMessage): Promise < any > => {
					// Get the authenticated user.
					const user = ctx.meta.user;

					// It check the `auth` property in action schema.
					// @ts-ignore
					if (req.$action.auth === "required" && !user) {
						throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", {
							error: "Unauthorized",
						});
					}
				},
				 */
			},

		});
	}
}
