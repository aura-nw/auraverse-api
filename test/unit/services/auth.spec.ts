'use strict';

import { ServiceBroker } from 'moleculer';
import AuthService from '../../../services/auth.service';
import _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { AccountStatus, AccountType, ErrorMap } from '../../../common';
import { DatabaseAccountMixin } from '../../../mixins/database';
import { ResponseDto } from '../../../types';
import { Account } from '../../../models';

describe("Test 'auth' service", () => {
	const broker = new ServiceBroker({ logger: false });
	broker.createService(AuthService);

	const accountMixin = new DatabaseAccountMixin();

	beforeAll(() => broker.start());
	afterAll(async () => {
		await accountMixin.delete({ account_type: AccountType.AUTHORIZED });
		await broker.stop();
	});

	describe("Test 'auth.signUp' action", () => {
		it('Should return message successful with account information', async () => {
			const res: ResponseDto = await broker.call('auth.signUp', {
				username: 'andqk',
				password: '123456',
				email: 'doquockhanhan@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SENT_VERIFICATION.Message);
			expect(
				_.omit(res.Data.account, [
					'id',
					'createdAt',
					'updatedAt',
					'password',
					'confirmationToken',
				]),
			).toEqual({
				username: 'andqk',
				email: 'doquockhanhan@gmail.com',
				accountType: AccountType.AUTHORIZED,
				accountStatus: AccountStatus.WAITING,
			});
			expect(bcrypt.compareSync('123456', res.Data.account.password)).toEqual(true);
		});

		it('Should update info of the account stored in DB', async () => {
			const res: ResponseDto = await broker.call('auth.signUp', {
				username: 'andqk',
				password: '123456',
				email: 'andqk@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SENT_VERIFICATION.Message);
			expect(
				_.omit(res.Data.account, [
					'id',
					'createdAt',
					'updatedAt',
					'password',
					'confirmationToken',
				]),
			).toEqual({
				username: 'andqk',
				email: 'andqk@gmail.com',
				accountType: AccountType.AUTHORIZED,
				accountStatus: AccountStatus.WAITING,
			});
			expect(bcrypt.compareSync('123456', res.Data.account.password)).toEqual(true);
		});

		it('Should return error E001 when sign up with duplicate username', async () => {
			await accountMixin.update(
				{ username: 'andqk' },
				{ account_status: AccountStatus.ACTIVATED },
			);

			const res: ResponseDto = await broker.call('auth.signUp', {
				username: 'andqk',
				password: '123456',
				email: 'doquockhanhan@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.E001.Code);
			expect(res.Message).toEqual(ErrorMap.E001.Message);
		});

		it('Should return error E002 when sign up with duplicate email', async () => {
			const res: ResponseDto = await broker.call('auth.signUp', {
				username: 'medi',
				password: '123456',
				email: 'andqk@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.E002.Code);
			expect(res.Message).toEqual(ErrorMap.E002.Message);
		});
	});

	describe("Test 'auth.confirmSignUp' action", () => {
		it('Should return message successful and update account status to ACTIVATED', async () => {
			const resSignUp: ResponseDto = await broker.call('auth.signUp', {
				username: 'medi',
				password: '123456',
				email: 'noahmedi@gmail.com',
			});

			const res: ResponseDto = await broker.call('auth.confirmSignUp', {
				confirmationToken: resSignUp.Data.account.confirmationToken,
			});

			const updatedAccount: Account = await accountMixin.findOne({ username: 'medi' });

			expect(res).toEqual({
				Code: ErrorMap.SUCCESSFUL.Code,
				Message: ErrorMap.SUCCESSFUL.Message,
				Data: {},
			});
			expect(updatedAccount.accountStatus).toEqual(AccountStatus.ACTIVATED);
		});

		it('Should return error E015 when using a confirmationToken that does not exist', async () => {
			const res: ResponseDto = await broker.call('auth.confirmSignUp', {
				confirmationToken: 'abc',
			});

			expect(res.Code).toEqual(ErrorMap.E015.Code);
			expect(res.Message).toEqual(ErrorMap.E015.Message);
		});

		it('Should return error E003 when using a confirmationToken belongs to an ACTIVATED account', async () => {
			const activatedAccount: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('auth.confirmSignUp', {
				confirmationToken: activatedAccount.confirmationToken,
			});

			expect(res.Code).toEqual(ErrorMap.E003.Code);
			expect(res.Message).toEqual(ErrorMap.E003.Message);
		});

		it('Should return error E016 when using an expired confirmationToken', async () => {
			const token = jwt.sign(
				{
					request: {
						username: 'noah',
						password: '123456',
						email: 'jqka@gmail.com',
					},
				},
				process.env.JWT_SECRET!,
				{
					expiresIn: '1',
				},
			);
			const account = {
				username: 'noah',
				email: 'jqka@gmail.com',
				password: bcrypt.hashSync('123456', 8),
				accountType: AccountType.AUTHORIZED,
				accountStatus: AccountStatus.WAITING,
				confirmationToken: token,
			} as Account;
			await accountMixin.insert(account);

			const res: ResponseDto = await broker.call('auth.confirmSignUp', {
				confirmationToken: token,
			});

			expect(res.Code).toEqual(ErrorMap.E016.Code);
			expect(res.Message).toEqual(ErrorMap.E016.Message);
		});
	});

	describe("Test 'auth.login' action", () => {
		it('Should return message successful', async () => {
			const res: ResponseDto = await broker.call('auth.login', {
				username: 'andqk',
				password: '123456',
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
		});

		it('Should return error E004 when login using a non-exist account', async () => {
			const res: ResponseDto = await broker.call('auth.login', {
				username: 'andqkfsoft',
				password: '123456',
			});

			expect(res.Code).toEqual(ErrorMap.E004.Code);
			expect(res.Message).toEqual(ErrorMap.E004.Message);
		});

		it('Should return error E005 when account has not been ACTIVATED', async () => {
			const res: ResponseDto = await broker.call('auth.login', {
				username: 'noah',
				password: '123456',
			});

			expect(res.Code).toEqual(ErrorMap.E005.Code);
			expect(res.Message).toEqual(ErrorMap.E005.Message);
		});

		it('Should return error E006 when provided password is incorrect', async () => {
			const res: ResponseDto = await broker.call('auth.login', {
				username: 'andqk',
				password: '12345678',
			});

			expect(res.Code).toEqual(ErrorMap.E006.Code);
			expect(res.Message).toEqual(ErrorMap.E006.Message);
		});
	});

	describe("Test 'auth.forgotPassword' action", () => {
		it('Should return message successful', async () => {
			const res: ResponseDto = await broker.call('auth.forgotPassword', {
				email: 'andqk@gmail.com',
			});

			const updatedAccount: Account = await accountMixin.findOne({ username: 'andqk' });

			expect(res.Code).toEqual(ErrorMap.SENT_NEW_PASSWORD.Code);
			expect(res.Message).toEqual(ErrorMap.SENT_NEW_PASSWORD.Message);
			expect(bcrypt.compareSync('123456', updatedAccount.password!)).toEqual(false);
		});

		it('Should return error E004 when provided email does not belong to any account', async () => {
			const res: ResponseDto = await broker.call('auth.forgotPassword', {
				email: 'abc@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.E004.Code);
			expect(res.Message).toEqual(ErrorMap.E004.Message);
		});

		it('Should return error E005 when account has not been ACTIVATED', async () => {
			const res: ResponseDto = await broker.call('auth.forgotPassword', {
				email: 'jqka@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.E005.Code);
			expect(res.Message).toEqual(ErrorMap.E005.Message);
		});
	});
});
