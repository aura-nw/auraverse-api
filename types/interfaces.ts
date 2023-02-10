import { IncomingMessage } from 'http';
import { ActionSchema, ActionParamSchema } from 'moleculer';

export type DBDialog = 'local' | 'file' | 'mongodb' | 'mysql';

export interface DBInfo {
	dialect: DBDialog;
	user: string;
	password: string;
	host: string;
	port: number;
	dbname: string;
	collection: string;
}

export interface RouteSchemaOpts {
	path: string;
	whitelist?: string[];
	authorization?: boolean;
	authentication?: boolean;
	aliases?: any;
}

export interface RouteSchema {
	path: string;
	mappingPolicy?: 'restricted' | 'all';
	opts: RouteSchemaOpts;
	middlewares: ((req: any, res: any, next: any) => void)[];
	authorization?: boolean;
	authentication?: boolean;
	logging?: boolean;
	etag?: boolean;
	cors?: any;
	rateLimit?: any;
	whitelist?: string[];
	hasWhitelist: boolean;
	callOptions?: any;
}

export interface RequestMessage extends IncomingMessage {
	$action: ActionSchema;
	$params: ActionParamSchema;
	$route: RouteSchema;
}

export interface ApiGatewayMeta {
	$statusCode?: number;
	$statusMessage?: string;
	$responseType?: string;
	$responseHeaders?: any;
	$location?: string;
}
