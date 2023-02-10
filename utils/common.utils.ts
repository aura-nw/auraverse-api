/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable id-blacklist */
import { StdFee } from '@cosmjs/stargate';
import * as dotenv from 'dotenv';
import { Network } from './network.utils';
const nodemailer = require('nodemailer');

dotenv.config();

export class Common {
	private transporter: any;
	private network: Network | undefined;

	public async getTransport(transporter: any) {
		if (transporter === undefined) {
			transporter = nodemailer.createTransport({
				host: process.env.AURA_HOST,
				port: process.env.AURA_PORT,
				secureConnection: true,
				tls: {
					ciphers: 'SSLv3',
				},
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
			});
		}
		return transporter;
	}

	public async sendEmail(to: string, subject: string, html: string) {
		try {
			this.transporter = await this.getTransport(this.transporter);
			await this.transporter.sendMail({
				from: process.env.AURA_EMAIL,
				to,
				subject,
				html,
			});
		} catch (error) {
			throw error;
		}
	}

	public async storeCode(
		senderAddress: string,
		wasmCode: Uint8Array,
		fee: StdFee | 'auto' | number,
		network: Network,
	) {
		this.network = network;
		const result = await this.network!.upload(senderAddress, wasmCode, fee);
		if (!result.codeId) {
			throw result;
		}
		return result.codeId;
	}
}
