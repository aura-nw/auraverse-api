/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as generator from "generate-password";
import { DatabaseAccountMixin } from "mixins/database";
import { AccountStatus, AccountType, ApiConstants, CallApiMethod, ErrorMap, ModulePath } from "../common";
import {
	ConfirmSignUpRequest,
	ForgotPasswordRequest,
	LoginRequest,
	ResponseDto,
	SignUpPersonalAccountRequest,
} from "../types";
import { Account } from "../models";

export default class AuthService extends Service {
	private accountMixin = new DatabaseAccountMixin();

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: ModulePath.AUTH,
			actions: {
				/**
				 * Sign up a personal account
				 *
				 */
				signUp: {
					rest: {
						method: CallApiMethod.POST,
						path: ApiConstants.SIGN_UP_PERSONAL_ACCOUNT,
					},
					body: {
						username: "string",
						email: "string",
						password: "string",
					},
					async handler(ctx: Context<SignUpPersonalAccountRequest>): Promise<ResponseDto> {
						return await this.signUpPersonalAccount(
							ctx.params.username,
							ctx.params.email,
							ctx.params.password
						);
					},
				},

				/**
				 * Confirm account sign up via email
				 */
				confirmSignUp: {
					rest: {
						method: CallApiMethod.GET,
						path: ApiConstants.CONFIRM_SIGN_UP,
					},
					params: {
						confirmationToken: "string",
					},
					async handler(ctx: Context<ConfirmSignUpRequest>): Promise<ResponseDto> {
						return await this.confirmSignUp(ctx.params.confirmationToken);
					},
				},

				/**
				 * Login to Auraverse
				 */
				login: {
					rest: {
						method: CallApiMethod.POST,
						path: ApiConstants.LOGIN,
					},
					body: {
						username: "string",
						password: "string",
					},
					async handler(ctx: Context<LoginRequest>): Promise<ResponseDto> {
						return await this.login(
							ctx.params.username,
							ctx.params.password
						);
					},
				},

				/**
				 * Forgot password
				 */
				forgotPassword: {
					rest: {
						method: CallApiMethod.POST,
						path: ApiConstants.FORGOT_PASSWORD,
					},
					body: {
						email: "string",
					},
					async handler(ctx: Context<ForgotPasswordRequest>): Promise<ResponseDto> {
						return await this.forgotPassword(
							ctx.params.email,
						);
					},
				},
			},
		});
	}

	// Action
	public async signUpPersonalAccount(username: string, email: string, password: string): Promise<ResponseDto> {
		const existAccounts: Account[] = this.accountMixin.findOne("account", {
			account_status: AccountStatus.ACTIVATED,
			$or: [
				{ username },
				{ email },
			],
		});
		this.logger.info(`Result: ${this.accountMixin.findOne("account", {
			account_status: AccountStatus.ACTIVATED,
			$or: [
				{ username },
				{ email },
			],
		})}`);
		if (existAccounts.length > 0) {
			if (existAccounts[0].username === username) {
				return ResponseDto.response(ErrorMap.E001, { username, email, password });
			}
			if (existAccounts[0].email === email) {
				return ResponseDto.response(ErrorMap.E002, { username, email, password });
			}
		}
		const token = jwt.sign({ username, email, password }, process.env.SECRET!);
		const account = new Account();
		account.username = username;
		account.email = email;
		account.password = bcrypt.hashSync(password, 8);
		account.accountType = AccountType.AUTHORIZED;
		account.accountStatus = AccountStatus.WAITING;
		account.confirmationToken = token;
		this.accountMixin.upsert("account", account);

		// TODO: Edit email content
		this.commonService.sendEmail(
			email,
			"Confirm Auraverse account sign-up",
			`<h1>Email Confirmation</h1>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.SERVER_HOST}/${ModulePath.AUTH}/${ApiConstants.CONFIRM_SIGN_UP}/${token}> Click here</a>
        </div>`
		);

		return ResponseDto.response(ErrorMap.SENT_VERIFICATION, { account });
	}

	public async confirmSignUp(confirmationToken: string): Promise<ResponseDto> {
		const account: Account = this.accountMixin.findOne("account", {
			confirmation_token: confirmationToken,
			account_status: AccountStatus.WAITING,
		});
		if (!account) { return ResponseDto.response(ErrorMap.E003, { confirmationToken }); }
		account.accountStatus = AccountStatus.ACTIVATED;
		this.accountMixin.upsert("account", account);
		return ResponseDto.response(ErrorMap.SUCCESSFUL);
	}

	public async login(username: string, password: string): Promise<ResponseDto> {
		const account: Account = this.accountMixin.findOne("account", { username });
		if (!account) { return ResponseDto.response(ErrorMap.E004, { username, password }); }
		if (account.accountStatus === AccountStatus.WAITING) { return ResponseDto.response(ErrorMap.E005, { username, password }); }
		if (!bcrypt.compareSync(password, account.password!)) { return ResponseDto.response(ErrorMap.E005, { username, password }); }
		const token = jwt.sign({ id: account.id }, process.env.SECRET!, {
			expiresIn: 86400, // Expires in 24 hours
		});
		return ResponseDto.response(ErrorMap.SUCCESSFUL, { token });
	}

	public async forgotPassword(email: string): Promise<ResponseDto> {
		const account: Account = this.accountMixin.findOne("account", { email });
		if (!account) { return ResponseDto.response(ErrorMap.E004, { email }); }
		if (account.accountStatus === AccountStatus.WAITING) { return ResponseDto.response(ErrorMap.E005, { email }); }
		const newPassword = generator.generate({
			length: 10,
			numbers: true,
			symbols: true,
			excludeSimilarCharacters: true,
		});
		account.password = bcrypt.hashSync(newPassword, 8);
		this.accountMixin.upsert("account", account);

		this.commonService.sendEmail(
			email,
			"Reset Auraverse password",
			`<h1>New Password</h1>
        <p>Your new password is: ${newPassword}</p>
        </div>`
		);
		return ResponseDto.response(ErrorMap.SENT_NEW_PASSWORD);
	}
}
