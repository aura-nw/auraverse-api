'use strict';
import Knex from 'knex';
import * as dotenv from 'dotenv';
import * as knexfile from '../knexfile';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const knexFile: any = knexfile;
const config = knexFile[environment];
export const knex = Knex(config);
