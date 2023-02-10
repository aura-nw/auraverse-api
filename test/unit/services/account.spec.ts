'use strict';

import { ServiceBroker } from 'moleculer';
import AccountService from '../../../services/account.service';
import * as bcrypt from 'bcryptjs';
import { AccountStatus, AccountType, ErrorMap } from '../../../common';
import { DatabaseAccountMixin, DatabaseCodeIdMixin } from '../../../mixins/database';
import { ResponseDto } from '../../../types';
import { Account } from '../../../models';

describe("Test 'account' service", () => {
	const broker = new ServiceBroker({ logger: false });
	broker.createService(AccountService);

	const accountMixin = new DatabaseAccountMixin();
	const codeIdMixin = new DatabaseCodeIdMixin();

	beforeAll(async () => {
		await broker.start();
		await accountMixin.insert([
			{
				username: 'andqk',
				email: 'doquockhanhan@gmail.com',
				password: bcrypt.hashSync('123456', 8),
				accountType: AccountType.AUTHORIZED,
				accountStatus: AccountStatus.ACTIVATED,
				confirmationToken: null,
			},
			{
				username: 'noah',
				email: 'andqk@gmail.com',
				password: bcrypt.hashSync('123456', 8),
				accountType: AccountType.AUTHORIZED,
				accountStatus: AccountStatus.WAITING,
				confirmationToken: null,
			},
		]);
	});
	afterAll(async () => {
		await accountMixin.delete({ account_type: AccountType.AUTHORIZED });
		await codeIdMixin.delete({});
		await broker.stop();
	});

	describe("Test 'account.changePassword' action", () => {
		it('Should return message successful', async () => {
			const res: ResponseDto = await broker.call('account.changePassword', {
				username: 'andqk',
				oldPassword: '123456',
				newPassword: '12345678',
			});

			const updatedAccount: Account = await accountMixin.findOne({ username: 'andqk' });

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(bcrypt.compareSync('12345678', updatedAccount.password!)).toEqual(true);
		});

		it('Should return error E004 when attempt to change password of a non-exist account', async () => {
			const res: ResponseDto = await broker.call('account.changePassword', {
				username: 'andqkfsoft',
				oldPassword: '123456',
				newPassword: 'abc',
			});

			expect(res.Code).toEqual(ErrorMap.E004.Code);
			expect(res.Message).toEqual(ErrorMap.E004.Message);
		});

		it('Should return error E005 when account has not been ACTIVATED', async () => {
			const res: ResponseDto = await broker.call('account.changePassword', {
				username: 'noah',
				oldPassword: '123456',
				newPassword: 'abc',
			});

			expect(res.Code).toEqual(ErrorMap.E005.Code);
			expect(res.Message).toEqual(ErrorMap.E005.Message);
		});

		it('Should return error E006 when provided old password is incorrect', async () => {
			const res: ResponseDto = await broker.call('account.changePassword', {
				username: 'andqk',
				oldPassword: '123456',
				newPassword: 'abc',
			});

			expect(res.Code).toEqual(ErrorMap.E006.Code);
			expect(res.Message).toEqual(ErrorMap.E006.Message);
		});
	});

	describe("Test 'account.changeEmail' action", () => {
		it('Should return message successful', async () => {
			const res: ResponseDto = await broker.call('account.changeEmail', {
				username: 'andqk',
				newEmail: 'noahmedi@gmail.com',
				password: '12345678',
			});

			const updatedAccount: Account = await accountMixin.findOne({ username: 'andqk' });

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(updatedAccount.email).toEqual('noahmedi@gmail.com');
		});

		it('Should return message valid email address', async () => {
			const res: ResponseDto = await broker.call('account.changeEmail', {
				username: 'andqk',
				newEmail: 'medinoah@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.EMAIL_VALID.Code);
			expect(res.Message).toEqual(ErrorMap.EMAIL_VALID.Message);
		});

		it('Should return error E004 when attempt to change email of a non-exist account', async () => {
			const res: ResponseDto = await broker.call('account.changeEmail', {
				username: 'andqkfsoft',
				newEmail: 'noahmedi@gmail.com',
				password: '12345678',
			});

			expect(res.Code).toEqual(ErrorMap.E004.Code);
			expect(res.Message).toEqual(ErrorMap.E004.Message);
		});

		it('Should return error E005 when account has not been ACTIVATED', async () => {
			const res: ResponseDto = await broker.call('account.changeEmail', {
				username: 'noah',
				newEmail: 'noahmedi@gmail.com',
				password: '123456',
			});

			expect(res.Code).toEqual(ErrorMap.E005.Code);
			expect(res.Message).toEqual(ErrorMap.E005.Message);
		});

		it('Should return error E006 when provided password is incorrect', async () => {
			const res: ResponseDto = await broker.call('account.changeEmail', {
				username: 'andqk',
				newEmail: 'jqka@gmail.com',
				password: 'abc',
			});

			expect(res.Code).toEqual(ErrorMap.E006.Code);
			expect(res.Message).toEqual(ErrorMap.E006.Message);
		});

		it('Should return error E002 if provided new email is already bound to another account', async () => {
			const res: ResponseDto = await broker.call('account.changeEmail', {
				username: 'andqk',
				newEmail: 'andqk@gmail.com',
				password: '12345678',
			});

			expect(res.Code).toEqual(ErrorMap.E002.Code);
			expect(res.Message).toEqual(ErrorMap.E002.Message);
		});
	});

	describe("Test 'account.verifyCodeIdOwnership' action", () => {
		it('Should return message successful', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('account.verifyCodeIdOwnership', {
				codeId: 21,
				accountId: account.id,
			});

			expect(res.Code).toEqual(ErrorMap.VERIFY_CODE_ID_OWNERSHIP.Code);
			expect(res.Message).toEqual(ErrorMap.VERIFY_CODE_ID_OWNERSHIP.Message);
			expect(res.Data.codeId).toEqual(21);
		});

		it('Should return error E007 if provided Code ID does not exist', async () => {
			const res: ResponseDto = await broker.call('account.verifyCodeIdOwnership', {
				codeId: 0,
				accountId: 1,
			});

			expect(res.Code).toEqual(ErrorMap.E007.Code);
			expect(res.Message).toEqual(ErrorMap.E007.Message);
		});

		it('Should return error E008 if source code of Code ID has not been verified yet', async () => {
			const res: ResponseDto = await broker.call('account.verifyCodeIdOwnership', {
				codeId: 19,
				accountId: 1,
			});

			expect(res.Code).toEqual(ErrorMap.E008.Code);
			expect(res.Message).toEqual(ErrorMap.E008.Message);
		});

		it('Should return error E009 if Code ID has already claimed ownership', async () => {
			const res: ResponseDto = await broker.call('account.verifyCodeIdOwnership', {
				codeId: 21,
				accountId: 1,
			});

			expect(res.Code).toEqual(ErrorMap.E009.Code);
			expect(res.Message).toEqual(ErrorMap.E009.Message);
		});
	});
});
