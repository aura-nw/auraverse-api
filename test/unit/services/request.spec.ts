'use strict';

import { ServiceBroker } from 'moleculer';
import RequestService from '../../../services/request.service';
import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import {
	AccountStatus,
	AccountType,
	ErrorMap,
	ProjectActiveStatus,
	ProjectCategories,
	ProjectStatus,
	RequestType,
} from '../../../common';
import {
	DatabaseAccountMixin,
	DatabaseCodeIdMixin,
	DatabaseProjectCodeIdMixin,
	DatabaseProjectMixin,
	DatabaseRequestMixin,
} from '../../../mixins/database';
import { ResponseDto } from '../../../types';
import { Account, CodeId, Project, Request } from '../../../models';

describe("Test 'request' service", () => {
	const broker = new ServiceBroker({ logger: false });
	broker.createService(RequestService);

	const projectMixin = new DatabaseProjectMixin();
	const requestMixin = new DatabaseRequestMixin();
	const codeIdMixin = new DatabaseCodeIdMixin();
	const accountMixin = new DatabaseAccountMixin();
	const projectCodeIdMixin = new DatabaseProjectCodeIdMixin();

	beforeAll(async () => {
		await broker.start();
		const insertedAccount = await accountMixin.insert({
			username: 'andqk',
			email: 'doquockhanhan@gmail.com',
			password: bcrypt.hashSync('123456', 8),
			accountType: AccountType.AUTHORIZED,
			accountStatus: AccountStatus.ACTIVATED,
			confirmationToken: null,
		});
		const insertedProject = await projectMixin.insert([
			{
				accountId: insertedAccount[0],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				status: ProjectStatus.SUBMITTED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: JSON.stringify([ProjectCategories.DAO]),
			},
			{
				accountId: insertedAccount[0],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				status: ProjectStatus.APPROVED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: JSON.stringify([ProjectCategories.ART]),
			},
			{
				accountId: insertedAccount[0],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				status: ProjectStatus.APPROVED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: JSON.stringify([ProjectCategories.COLLECTIBLE]),
			},
			{
				accountId: insertedAccount[0],
				name: 'AnDQK',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				status: ProjectStatus.SUBMITTED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: JSON.stringify([ProjectCategories.DAO]),
			},
		]);
		await Promise.all([
			codeIdMixin.insert({
				codeId: 19,
				accountId: insertedAccount[0],
				creator: 'aura1h6r78trkk2ewrry7s3lclrqu9a22ca3hpmyqfu',
				dataHash: '7FB9F2FACAA25339E68DED7EEB2A17AB1749F19D0DFF7A05FBB42809B301CC24',
				data: 'AGFzbQEAAAABjAEVYAJ/fwF/YAJ/fwBgA39/fwF/YAN/f38AYAF/AX9gAX8AYAR/f39/AGAFf39/',
				mainnetCodeId: null,
			}),
			requestMixin.insert([
				{
					accountId: insertedAccount[0],
					projectId: insertedProject[0],
					codeIds: JSON.stringify([19]),
					name: 'Khanh An',
					email: 'doquockhanhan@gmail.com',
					description: 'Anything',
					otherDocumentation: 'Something else',
					activeStatus: ProjectActiveStatus.RELEASED,
					status: ProjectStatus.SUBMITTED,
					type: RequestType.CREATE,
					website: 'github.com',
					imageLink: 'facebook.com/doquockhanhan',
					categories: JSON.stringify([ProjectCategories.ANALYTICS]),
				},
				{
					accountId: insertedAccount[0],
					projectId: insertedProject[0] + 1,
					codeIds: JSON.stringify([19]),
					name: 'Khanh An',
					email: 'doquockhanhan@gmail.com',
					description: 'Anything',
					otherDocumentation: 'Something else',
					activeStatus: ProjectActiveStatus.RELEASED,
					status: ProjectStatus.SUBMITTED,
					type: RequestType.UPDATE,
					website: 'github.com',
					imageLink: 'facebook.com/doquockhanhan',
					categories: JSON.stringify([ProjectCategories.ANALYTICS]),
					whitepaper: 'gitlab.com/absciwe',
					github: 'github.com/andqk',
					telegram: 'telegram.io/sawe',
					wechat: 'wechat.nw/qwerr',
					linkedin: 'linkedin.com/noah',
					discord: 'discord.gg/sbioqne',
					medium: 'medium.com/jqaj',
					reddit: 'reddit.tv/edawerg',
					slack: 'slack.io',
					facebook: 'facebook.com/dqka',
					twitter: 'twitter.com/medi',
					bitcointalk: 'sbrt,ase/e3rag',
				},
				{
					accountId: insertedAccount[0],
					projectId: insertedProject[0] + 2,
					codeIds: JSON.stringify([19]),
					name: 'Khanh An',
					email: 'doquockhanhan@gmail.com',
					description: 'Anything',
					otherDocumentation: 'Something else',
					activeStatus: ProjectActiveStatus.RELEASED,
					status: ProjectStatus.SUBMITTED,
					type: RequestType.DELETE,
					website: 'github.com',
					imageLink: 'facebook.com/doquockhanhan',
					categories: JSON.stringify([ProjectCategories.ANALYTICS]),
				},
				{
					accountId: insertedAccount[0],
					codeIds: JSON.stringify([19]),
					email: 'doquockhanhan@gmail.com',
					status: ProjectStatus.SUBMITTED,
					type: RequestType.STORE_CODE_ID,
				},
				{
					accountId: insertedAccount[0],
					projectId: 0,
					codeIds: JSON.stringify([19]),
					name: 'Khanh An',
					email: 'doquockhanhan@gmail.com',
					description: 'Anything',
					otherDocumentation: 'Something else',
					activeStatus: ProjectActiveStatus.RELEASED,
					status: ProjectStatus.SUBMITTED,
					type: RequestType.CREATE,
					website: 'github.com',
					imageLink: 'facebook.com/doquockhanhan',
					categories: JSON.stringify([ProjectCategories.ANALYTICS]),
				},
				{
					accountId: insertedAccount[0],
					projectId: insertedProject[0] + 3,
					codeIds: JSON.stringify([19]),
					name: 'AnDQK',
					email: 'doquockhanhan@gmail.com',
					description: 'Anything',
					otherDocumentation: 'Something else',
					activeStatus: ProjectActiveStatus.RELEASED,
					status: ProjectStatus.SUBMITTED,
					type: RequestType.CREATE,
					website: 'github.com',
					imageLink: 'facebook.com/doquockhanhan',
					categories: JSON.stringify([ProjectCategories.ANALYTICS]),
				},
			]),
		]);
	});
	afterAll(async () => {
		await Promise.all([
			accountMixin.delete({ account_type: AccountType.AUTHORIZED }),
			codeIdMixin.delete({}),
			projectMixin.delete({}),
			requestMixin.delete({}),
			projectCodeIdMixin.delete({}),
		]);
		await broker.stop();
	});

	describe("Test 'request.listRequests' action", () => {
		it('Should return all requests', async () => {
			const res: ResponseDto = await broker.call('request.listRequests', {
				limit: 10,
				offset: 0,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(res.Data.requests.length).toEqual(6);
		});
	});

	describe("Test 'request.listYourRequests' action", () => {
		it('Should return all requests of an account', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('request.listYourRequests', {
				accountId: account.id,
				limit: 10,
				offset: 0,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(res.Data.requests.length).toEqual(6);
		});
	});

	describe("Test 'request.requestDetails' action", () => {
		it('Should return request data', async () => {
			const request: Request = await requestMixin.findOne({});

			const res: ResponseDto = await broker.call('request.requestDetails', {
				id: request.id,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(
				_.omit(res.Data.request, [
					'id',
					'accountId',
					'projectId',
					'createdAt',
					'updatedAt',
				]),
			).toEqual({
				codeIds: [19],
				activeStatus: ProjectActiveStatus.RELEASED,
				bitcointalk: null,
				categories: [ProjectCategories.ANALYTICS],
				description: 'Anything',
				discord: null,
				email: 'doquockhanhan@gmail.com',
				facebook: null,
				github: null,
				imageLink: 'facebook.com/doquockhanhan',
				linkedin: null,
				medium: null,
				name: 'Khanh An',
				otherDocumentation: 'Something else',
				reddit: null,
				slack: null,
				status: ProjectStatus.SUBMITTED,
				type: RequestType.CREATE,
				telegram: null,
				twitter: null,
				website: 'github.com',
				wechat: null,
				whitepaper: null,
			});
		});

		it('Should return error E018 if provided request id does not exist', async () => {
			const res: ResponseDto = await broker.call('request.requestDetails', {
				id: 0,
			});

			expect(res.Code).toEqual(ErrorMap.E018.Code);
			expect(res.Message).toEqual(ErrorMap.E018.Message);
		});
	});

	describe("Test 'request.requestStoreCodeId' action", () => {
		it('Should return message successful', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('request.requestStoreCodeId', {
				accountId: account.id,
				codeIds: [19],
				email: 'doquockhanhan@gmail.com',
			});

			const insertedRequest: Request = await requestMixin.findOne({
				type: RequestType.STORE_CODE_ID,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(_.omit(insertedRequest, ['id', 'createdAt', 'updatedAt', 'accountId'])).toEqual({
				projectId: null,
				codeIds: [19],
				activeStatus: null,
				bitcointalk: null,
				categories: null,
				description: null,
				discord: null,
				email: 'doquockhanhan@gmail.com',
				facebook: null,
				github: null,
				imageLink: null,
				linkedin: null,
				medium: null,
				name: null,
				otherDocumentation: null,
				reddit: null,
				slack: null,
				status: ProjectStatus.SUBMITTED,
				type: RequestType.STORE_CODE_ID,
				telegram: null,
				twitter: null,
				website: null,
				wechat: null,
				whitepaper: null,
			});
		});

		it('Should return error E020 if request does not contain any Code ID', async () => {
			const res: ResponseDto = await broker.call('request.requestStoreCodeId', {
				accountId: 1,
				codeIds: [],
				email: 'doquockhanhan@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.E020.Code);
			expect(res.Message).toEqual(ErrorMap.E020.Message);
		});

		it('Should return error E013 if Code ID has not been claimed ownership yet', async () => {
			const res: ResponseDto = await broker.call('request.requestStoreCodeId', {
				accountId: 1,
				codeIds: [1, 19],
				email: 'doquockhanhan@gmail.com',
			});

			expect(res.Code).toEqual(ErrorMap.E013.Code);
			expect(res.Message).toEqual(ErrorMap.E013.Message);
		});
	});

	describe("Test 'request.confirmRequest' action", () => {
		it('Should update project status to APPROVED case request type CREATE', async () => {
			const createRequest: Request = await requestMixin.findOne({ type: RequestType.CREATE });

			const res: ResponseDto = await broker.call('request.confirmRequest', {
				id: createRequest.id,
			});

			const [updatedProject, updatedRequest]: [Project, Request] = await Promise.all([
				projectMixin.findOne({
					id: createRequest.projectId,
				}),
				requestMixin.findOne({ type: RequestType.CREATE }),
			]);

			expect(res.Code).toEqual(ErrorMap.REQUEST_CONFIRMED.Code);
			expect(res.Message).toEqual(ErrorMap.REQUEST_CONFIRMED.Message);
			expect(updatedRequest.status).toEqual(ProjectStatus.APPROVED);
			expect(res.Data.id).toEqual(createRequest.id);
			expect(updatedProject.status).toEqual(ProjectStatus.APPROVED);
		});

		it('Should update project status to APPROVED case request type UPDATE', async () => {
			const updateRequest: Request = await requestMixin.findOne({ type: RequestType.UPDATE });

			const res: ResponseDto = await broker.call('request.confirmRequest', {
				id: updateRequest.id,
			});

			const [updatedProject, updatedRequest]: [Project, Request] = await Promise.all([
				projectMixin.findOne({
					id: updateRequest.projectId,
				}),
				requestMixin.findOne({ type: RequestType.UPDATE }),
			]);

			expect(res.Code).toEqual(ErrorMap.REQUEST_CONFIRMED.Code);
			expect(res.Message).toEqual(ErrorMap.REQUEST_CONFIRMED.Message);
			expect(updatedRequest.status).toEqual(ProjectStatus.APPROVED);
			expect(res.Data.id).toEqual(updateRequest.id);
			expect(_.omit(updatedProject, ['id', 'createdAt', 'updatedAt', 'accountId'])).toEqual({
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				status: ProjectStatus.APPROVED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.ANALYTICS],
				whitepaper: 'gitlab.com/absciwe',
				github: 'github.com/andqk',
				telegram: 'telegram.io/sawe',
				wechat: 'wechat.nw/qwerr',
				linkedin: 'linkedin.com/noah',
				discord: 'discord.gg/sbioqne',
				medium: 'medium.com/jqaj',
				reddit: 'reddit.tv/edawerg',
				slack: 'slack.io',
				facebook: 'facebook.com/dqka',
				twitter: 'twitter.com/medi',
				bitcointalk: 'sbrt,ase/e3rag',
				isNew: 1,
			});
		});

		it('Should delete project case request type DELETE', async () => {
			const deleteRequest: Request = await requestMixin.findOne({ type: RequestType.DELETE });

			const res: ResponseDto = await broker.call('request.confirmRequest', {
				id: deleteRequest.id,
			});

			const [updatedProject, updatedRequest]: [Project, Request] = await Promise.all([
				projectMixin.findOne({
					id: deleteRequest.projectId,
				}),
				requestMixin.findOne({ type: RequestType.DELETE }),
			]);

			expect(res.Code).toEqual(ErrorMap.REQUEST_CONFIRMED.Code);
			expect(res.Message).toEqual(ErrorMap.REQUEST_CONFIRMED.Message);
			expect(updatedRequest.status).toEqual(ProjectStatus.APPROVED);
			expect(res.Data.id).toEqual(deleteRequest.id);
			expect(updatedProject).toBeUndefined();
		});

		it('Should store Code ID to mainnet and update request status request type STORE_CODE_ID', async () => {
			const storeCodeIdRequest: Request = await requestMixin.findOne({
				type: RequestType.STORE_CODE_ID,
			});

			const res: ResponseDto = await broker.call('request.confirmRequest', {
				id: storeCodeIdRequest.id,
			});

			expect(res.Code).toEqual(ErrorMap.REQUEST_CONFIRMED.Code);
			expect(res.Message).toEqual(ErrorMap.REQUEST_CONFIRMED.Message);
		});

		it('Should return error E018 if provided request id does not exist', async () => {
			const res: ResponseDto = await broker.call('request.confirmRequest', {
				id: 0,
			});

			expect(res.Code).toEqual(ErrorMap.E018.Code);
			expect(res.Message).toEqual(ErrorMap.E018.Message);
		});

		it('Should return error E014 if provided project id does not exist', async () => {
			const request: Request = await requestMixin.findOne({ project_id: 0 });

			const res: ResponseDto = await broker.call('request.confirmRequest', {
				id: request.id,
			});

			expect(res.Code).toEqual(ErrorMap.E014.Code);
			expect(res.Message).toEqual(ErrorMap.E014.Message);
		});
	});

	describe("Test 'request.rejectRequest' action", () => {
		it('Should return message successful', async () => {
			const request: Request = await requestMixin.findOne({ name: 'AnDQK' });

			const res: ResponseDto = await broker.call('request.rejectRequest', {
				id: request.id,
				reason: 'Unit Test',
			});

			const [updatedRequest, updatedProject]: [Request, Project] = await Promise.all([
				requestMixin.findOne({ name: 'AnDQK' }),
				projectMixin.findOne({ name: 'AnDQK' }),
			]);

			expect(res.Code).toEqual(ErrorMap.REQUEST_REJECTED.Code);
			expect(res.Message).toEqual(ErrorMap.REQUEST_REJECTED.Message);
			expect(updatedRequest.status).toEqual(ProjectStatus.REJECTED);
			expect(updatedProject.status).toEqual(ProjectStatus.REJECTED);
		});

		it('Should return error E018 if provided request id does not exist', async () => {
			const res: ResponseDto = await broker.call('request.rejectRequest', {
				id: 0,
				reason: 'Unit Test',
			});

			expect(res.Code).toEqual(ErrorMap.E018.Code);
			expect(res.Message).toEqual(ErrorMap.E018.Message);
		});

		it('Should return error E021 if inputted request is already processed', async () => {
			const request: Request = await requestMixin.findOne({
				type: RequestType.UPDATE,
			});

			const res: ResponseDto = await broker.call('request.rejectRequest', {
				id: request.id,
				reason: 'Unit Test',
			});

			expect(res.Code).toEqual(ErrorMap.E021.Code);
			expect(res.Message).toEqual(ErrorMap.E021.Message);
		});
	});
});
