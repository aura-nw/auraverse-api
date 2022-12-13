/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as generator from "generate-password";
import { Common } from "../utils";
import { DatabaseAccountMixin } from "../mixins/database";
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
	private commonService  = new Common();

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: ModulePath.AUTH,
			mixins: [this.accountMixin],
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
					openapi: {
						summary: "Sign up a personal account",
						description: "Sign up a personal account",
					},
					params: {
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
					openapi: {
						summary: "Confirm account sign up via email",
						description: "Confirm account sign up via email",
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
					openapi: {
						summary: "Login to Auraverse",
						description: "Login to Auraverse",
					},
					params: {
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
					openapi: {
						summary: "Forgot password",
						description: "Forgot password",
					},
					params: {
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
		const existAccount: Account = await this.accountMixin.checkExistAccount(username, email);
		if (existAccount) {
			if (existAccount.username === username) {
				return ResponseDto.response(ErrorMap.E001, { username, email, password });
			}
			if (existAccount.email === email) {
				return ResponseDto.response(ErrorMap.E002, { username, email, password });
			}
		}

		const token = jwt.sign({ username, email, password }, process.env.JWT_SECRET!);
		const account = {
			username,
			email,
			password: bcrypt.hashSync(password, 8),
			accountType: AccountType.AUTHORIZED,
			accountStatus: AccountStatus.WAITING,
			confirmationToken: token,
		} as Account;
		// TODO: Edit email content
		await this.commonService.sendEmail(
			email,
			"Confirm Auraverse account sign-up",
			`<h1>Email Confirmation</h1>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.BASE_URL}:${process.env.BASE_PORT}/public/${ModulePath.AUTH}/${ApiConstants.CONFIRM_SIGN_UP}?confirmationToken=${token}> 
		Click here</a>
        </div>`
		);
		await this.accountMixin.insert(account);

		return ResponseDto.response(ErrorMap.SENT_VERIFICATION, { account });
	}

	public async confirmSignUp(confirmationToken: string): Promise<ResponseDto> {
		const account: Account = await this.accountMixin.findOne({
			confirmation_token: confirmationToken,
			account_status: AccountStatus.WAITING,
		});
		if (!account) { return ResponseDto.response(ErrorMap.E003, { confirmationToken }); }
		await this.accountMixin.update({ id: account.id }, { account_status: AccountStatus.ACTIVATED });

		return ResponseDto.response(ErrorMap.SUCCESSFUL);
	}

	public async login(username: string, password: string): Promise<ResponseDto> {
		const account: Account = await this.accountMixin.findOne({ username });
		if (!account) { return ResponseDto.response(ErrorMap.E004, { username, password }); }
		if (account.accountStatus === AccountStatus.WAITING) { return ResponseDto.response(ErrorMap.E005, { username, password }); }
		if (!bcrypt.compareSync(password, account.password!)) { return ResponseDto.response(ErrorMap.E005, { username, password }); }
		const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET!, {
			expiresIn: 86400, // Expires in 24 hours
		});

		return ResponseDto.response(ErrorMap.SUCCESSFUL, { token });
	}

	public async forgotPassword(email: string): Promise<ResponseDto> {
		const account: Account = await this.accountMixin.findOne({ email });
		if (!account) { return ResponseDto.response(ErrorMap.E004, { email }); }
		if (account.accountStatus === AccountStatus.WAITING) { return ResponseDto.response(ErrorMap.E005, { email }); }
		const newPassword = generator.generate({
			length: 10,
			numbers: true,
			symbols: true,
			excludeSimilarCharacters: true,
		});
		await this.commonService.sendEmail(
			email,
			"Reset Auraverse password",
			`<h1>New Password</h1>
        <p>Your new password is: ${newPassword}</p>
        </div>`
		);
		await this.accountMixin.update({ id: account.id }, { password: bcrypt.hashSync(newPassword, 8) });

		return ResponseDto.response(ErrorMap.SENT_NEW_PASSWORD);
	}
}
