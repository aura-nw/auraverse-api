export * from './error.map';
export * from './constants/api.constant';
export * from './constants/app.constant';
export * from './customError';

import ConfigClass from './config';
const config = new ConfigClass();
export { config as Config };
