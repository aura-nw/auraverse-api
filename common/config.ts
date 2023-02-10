/* eslint-disable capitalized-comments */
import os from 'os';
import _ from 'lodash';
import * as dotenv from 'dotenv';
import { DBDialog, DBInfo } from '../types';

dotenv.config();

const processEnv = process.env;
const configObj = processEnv;

const isTrue = (text?: string | number) => [1, true, '1', 'true', 'yes'].includes(text || '');

const isFalse = (text?: string | number) => [0, false, '0', 'false', 'no'].includes(text || '');

const getValue = (text?: string, defaultValud?: string | boolean) => {
	const vtrue = isTrue(text);
	const vfalse = isFalse(text);
	const val = text || defaultValud;
	if (vtrue) {
		return true;
	} else if (vfalse) {
		return false;
	}
	return val;
};

const HOST_NAME = os.hostname().toLowerCase();

const getDbInfo = (where: string, what: string, defaultValue: string) => {
	const value = process.env[`DB_${where}_${what}`];
	const generic = process.env[`DB_GENERIC_${what}`];
	return value || generic || defaultValue;
};

const genericDbInfo = (where: string): DBInfo => ({
	dialect: getDbInfo(where, 'DIALECT', 'local') as DBDialog,
	user: getDbInfo(where, 'USER', ''),
	password: getDbInfo(where, 'PASSWORD', ''),
	host: getDbInfo(where, 'HOST', ''),
	port: +getDbInfo(where, 'PORT', '0'),
	dbname: getDbInfo(where, 'DBNAME', ''),
	collection: getDbInfo(where, 'COLLECTION', where.toLowerCase()),
});

export default class ConfigClass {
	// Dynamic property key
	[index: string]: any;
	public static NODE_ENV: string;
	public static NODEID: string;
	public static DB_ACCOUNT: any;
	public static DB_CODE_ID: any;
	public static DB_PROJECT_CODE_ID: any;
	public static DB_PROJECT: any;
	public static DB_REQUEST: any;

	public constructor() {
		Object.keys(configObj).forEach((key: string) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this[key] = configObj[key];
		});
		this.NODE_ENV = process.env.NODE_ENV;
		this.NODEID = `${process.env.NODEID ? process.env.NODEID + '-' : ''}${HOST_NAME}-${
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.NODE_ENV
		}`;
		this.DB_ACCOUNT = genericDbInfo('ACCOUNT');
		this.DB_CODE_ID = genericDbInfo('CODE_ID');
		this.DB_PROJECT_CODE_ID = genericDbInfo('PROJECT_CODE_ID');
		this.DB_PROJECT = genericDbInfo('PROJECT');
		this.DB_REQUEST = genericDbInfo('REQUEST');
	}
}
