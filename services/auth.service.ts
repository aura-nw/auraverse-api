/* eslint-disable camelcase */
'use strict';

import { Service, ServiceBroker, Context } from 'moleculer';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as generator from 'generate-password';
import { Common } from '../utils';
import { DatabaseAccountMixin } from '../mixins/database';
import {
	AccountStatus,
	AccountType,
	ApiConstants,
	CallApiMethod,
	ErrorMap,
	ModulePath,
} from '../common';
import {
	ConfirmSignUpRequest,
	ForgotPasswordRequest,
	LoginRequest,
	ResponseDto,
	SignUpPersonalAccountRequest,
} from '../types';
import { Account } from '../models';

export default class AuthService extends Service {
	private accountMixin = new DatabaseAccountMixin();
	private commonService = new Common();

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: ModulePath.AUTH,
			mixins: [],
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
						summary: 'Sign up a personal account',
						description: 'Sign up a personal account',
					},
					params: {
						username: 'string',
						email: 'string',
						password: 'string',
					},
					async handler(
						ctx: Context<SignUpPersonalAccountRequest>,
					): Promise<ResponseDto> {
						return await this.signUpPersonalAccount(ctx);
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
						summary: 'Confirm account sign up via email',
						description: 'Confirm account sign up via email',
					},
					params: {
						confirmationToken: 'string',
					},
					async handler(ctx: Context<ConfirmSignUpRequest>): Promise<ResponseDto> {
						return await this.confirmSignUp(ctx);
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
						summary: 'Login to Auraverse',
						description: 'Login to Auraverse',
					},
					params: {
						username: 'string',
						password: 'string',
					},
					async handler(ctx: Context<LoginRequest>): Promise<ResponseDto> {
						return await this.login(ctx);
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
						summary: 'Forgot password',
						description: 'Forgot password',
					},
					params: {
						email: 'string',
					},
					async handler(ctx: Context<ForgotPasswordRequest>): Promise<ResponseDto> {
						return await this.forgotPassword(ctx);
					},
				},
			},
		});
	}

	// Action
	public async signUpPersonalAccount(
		ctx: Context<SignUpPersonalAccountRequest>,
	): Promise<ResponseDto> {
		const existAccount: Account = await this.accountMixin.checkExistAccount(
			ctx.params.username!,
			ctx.params.email!,
		);
		const token = jwt.sign({ request: ctx.params }, process.env.JWT_SECRET!);
		const account = {
			username: ctx.params.username,
			email: ctx.params.email,
			password: bcrypt.hashSync(ctx.params.password!, 8),
			accountType: AccountType.AUTHORIZED,
			accountStatus: AccountStatus.WAITING,
			confirmationToken: token,
		} as Account;

		if (existAccount) {
			if (existAccount.accountStatus === AccountStatus.ACTIVATED) {
				if (existAccount.username === ctx.params.username) {
					return ResponseDto.response(ErrorMap.E001, { request: ctx.params });
				}
				if (existAccount.email === ctx.params.email) {
					return ResponseDto.response(ErrorMap.E002, { request: ctx.params });
				}
			} else {
				await this.accountMixin.update({ id: existAccount.id }, account);
			}
		} else {
			await this.accountMixin.insert(account);
		}

		// TODO: Edit email content
		await this.commonService.sendEmail(
			ctx.params.email!,
			'Confirm Auraverse account sign-up',
			`<h1>Email Confirmation</h1>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.APP_DOMAIN}/public/${ModulePath.AUTH}/confirm/${token}> Click here</a>
        </div>`,
		);

		return ResponseDto.response(ErrorMap.SENT_VERIFICATION, { account });
	}

	public async confirmSignUp(ctx: Context<ConfirmSignUpRequest>): Promise<ResponseDto> {
		const account: Account = await this.accountMixin.findOne({
			confirmation_token: ctx.params.confirmationToken,
		});

		if (!account) {
			return ResponseDto.response(ErrorMap.E015, { request: ctx.params.confirmationToken });
		} else if (account.accountStatus !== AccountStatus.WAITING) {
			return ResponseDto.response(ErrorMap.E003, { request: ctx.params.confirmationToken });
		}
		try {
			const decoded: jwt.JwtPayload = jwt.verify(
				ctx.params.confirmationToken!,
				process.env.JWT_SECRET!,
			) as jwt.JwtPayload;
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				return ResponseDto.response(ErrorMap.E016, {
					request: ctx.params.confirmationToken,
				});
			}
			this.logger.error(error);
		}
		await this.accountMixin.update(
			{ id: account.id },
			{ account_status: AccountStatus.ACTIVATED },
		);

		return ResponseDto.response(ErrorMap.SUCCESSFUL);
	}

	public async login(ctx: Context<LoginRequest>): Promise<ResponseDto> {
		const account: Account = await this.accountMixin.findOne({ username: ctx.params.username });
		if (!account) {
			return ResponseDto.response(ErrorMap.E004, { request: ctx.params });
		}
		if (account.accountStatus === AccountStatus.WAITING) {
			return ResponseDto.response(ErrorMap.E005, { request: ctx.params });
		}
		if (!bcrypt.compareSync(ctx.params.password!, account.password!)) {
			return ResponseDto.response(ErrorMap.E006, { request: ctx.params });
		}
		const token = jwt.sign(
			{ id: account.id, accountType: account.accountType },
			process.env.JWT_SECRET!,
			{
				expiresIn: 86400, // Expires in 24 hours
			},
		);

		return ResponseDto.response(ErrorMap.SUCCESSFUL, { token });
	}

	public async forgotPassword(ctx: Context<ForgotPasswordRequest>): Promise<ResponseDto> {
		const account: Account = await this.accountMixin.findOne({ email: ctx.params.email });
		if (!account) {
			return ResponseDto.response(ErrorMap.E004, { request: ctx.params });
		}
		if (account.accountStatus === AccountStatus.WAITING) {
			return ResponseDto.response(ErrorMap.E005, { request: ctx.params });
		}
		const newPassword = generator.generate({
			length: 10,
			numbers: true,
			symbols: true,
			excludeSimilarCharacters: true,
		});
		await Promise.all([
			this.commonService.sendEmail(
				ctx.params.email!,
				'Reset Auraverse password',
				`<h1>New Password</h1>
        <p>Your new password is: ${newPassword}</p>
        </div>`,
			),
			this.accountMixin.update(
				{ id: account.id },
				{ password: bcrypt.hashSync(newPassword, 8) },
			),
		]);

		return ResponseDto.response(ErrorMap.SENT_NEW_PASSWORD);
	}
}
