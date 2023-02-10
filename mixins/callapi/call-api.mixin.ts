import { Service, ServiceSchema } from 'moleculer';
import { Config } from '../../common';
const axios = require('axios').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Resilient = require('resilient');
export default class CallApiMixin implements Partial<ServiceSchema>, ThisType<Service> {
	private schema: Partial<ServiceSchema> & ThisType<Service>;
	public constructor() {
		this.schema = {
			settings: {
				enableLoadBalancer: Config.ENABLE_LOADBALANCER,
			},
			methods: {
				async callApiFromDomain(domain: string[], path: string, retry: number = Infinity) {
					let callApiClient = null;
					if (this.settings.enableLoadBalancer === 'false') {
						const axiosClient = axios.create({
							baseURL: domain[0],
						});
						callApiClient = axiosClient;
					} else {
						const resilientClient = Resilient({
							service: { basePath: '/', retry },
						});
						resilientClient.setServers(domain);
						callApiClient = resilientClient;
					}
					try {
						const result = await callApiClient.get(path);
						if (result.data) {
							return result.data;
						} else {
							return null;
						}
					} catch (error) {
						this.logger.error(error);
						return null;
					}
				},
			},
		};
	}

	public start() {
		return this.schema;
	}
}

export const callApiMixin = new CallApiMixin().start();
