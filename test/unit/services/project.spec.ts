'use strict';

import { ServiceBroker } from 'moleculer';
import ProjectService from '../../../services/project.service';
import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import {
	AccountStatus,
	AccountType,
	ErrorMap,
	ProjectActiveStatus,
	ProjectCategories,
	ProjectStatus,
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

describe("Test 'project' service", () => {
	const broker = new ServiceBroker({ logger: false });
	broker.createService(ProjectService);

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
		await Promise.all([
			codeIdMixin.insert({
				codeId: 19,
				accountId: insertedAccount[0],
				creator: 'aura1h6r78trkk2ewrry7s3lclrqu9a22ca3hpmyqfu',
				dataHash: '7FB9F2FACAA25339E68DED7EEB2A17AB1749F19D0DFF7A05FBB42809B301CC24',
				data: 'AGFzbQEAAAABjAEVYAJ/fwF/YAJ/fwBgA39/fwF/YAN/f38AYAF/AX9gAX8AYAR/f39/AGAFf39/',
				mainnetCodeId: null,
			}),
			projectMixin.insert({
				accountId: insertedAccount[0],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				status: ProjectStatus.APPROVED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: JSON.stringify([ProjectCategories.DAO]),
			}),
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

	describe("Test 'project.createProject' action", () => {
		it('Should return message successful with the request id', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('project.createProject', {
				accountId: account.id,
				codeIds: [],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.DAO],
			});

			const [project, request]: [Project, Request] = await Promise.all([
				projectMixin.findOne({ status: ProjectStatus.SUBMITTED }),
				requestMixin.findOne({ account_id: account.id }),
			]);

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(res.Data.requestId).toEqual(request.id);
			expect(request.projectId).toEqual(project.id);
		});

		it('Should return message successful with the request id when provide Code ID', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('project.createProject', {
				accountId: account.id,
				codeIds: [19],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.DAO],
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
		});

		it('Should return error E010 when inputted categories exceed 4', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('project.createProject', {
				accountId: account.id,
				codeIds: [],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [
					ProjectCategories.DAO,
					ProjectCategories.ART,
					ProjectCategories.AVATAR,
					ProjectCategories.FUNGIBLE_TOKEN,
					ProjectCategories.GAME,
				],
			});

			expect(res.Code).toEqual(ErrorMap.E010.Code);
			expect(res.Message).toEqual(ErrorMap.E010.Message);
		});

		it('Should return error E013 when inputted Code IDs have not been claimed ownership yet', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('project.createProject', {
				accountId: account.id,
				codeIds: [1],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			expect(res.Code).toEqual(ErrorMap.E013.Code);
			expect(res.Message).toEqual(ErrorMap.E013.Message);
		});

		it('Should return error E004 when accountId does not exist', async () => {
			const res: ResponseDto = await broker.call('project.createProject', {
				accountId: 0,
				codeIds: [],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			expect(res.Code).toEqual(ErrorMap.E004.Code);
			expect(res.Message).toEqual(ErrorMap.E004.Message);
		});
	});

	describe("Test 'project.updateProject' action", () => {
		it('Should return message successful', async () => {
			const approvedProject: Project = await projectMixin.findOne({
				status: ProjectStatus.APPROVED,
			});

			const res: ResponseDto = await broker.call('project.updateProject', {
				projectId: approvedProject.id,
				accountId: approvedProject.accountId,
				codeIds: [],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			const updatedProject: Project = await projectMixin.findOne({
				status: ProjectStatus.APPROVED,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(updatedProject.categories).toEqual([ProjectCategories.FUNGIBLE_TOKEN]);
		});

		it('Should return error E014 when provided project id does not exist', async () => {
			const res: ResponseDto = await broker.call('project.updateProject', {
				projectId: 0,
				accountId: 1,
				codeIds: [],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			expect(res.Code).toEqual(ErrorMap.E014.Code);
			expect(res.Message).toEqual(ErrorMap.E014.Message);
		});

		it('Should return error E017 when project status is still SUBMITTED', async () => {
			const submittedProject: Project = await projectMixin.findOne({
				status: ProjectStatus.SUBMITTED,
			});

			const res: ResponseDto = await broker.call('project.updateProject', {
				projectId: submittedProject.id,
				accountId: submittedProject.accountId,
				codeIds: [],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			expect(res.Code).toEqual(ErrorMap.E017.Code);
			expect(res.Message).toEqual(ErrorMap.E017.Message);
		});

		it('Should return error E004 when accountId does not exist', async () => {
			const approvedProject: Project = await projectMixin.findOne({
				status: ProjectStatus.APPROVED,
			});

			const res: ResponseDto = await broker.call('project.updateProject', {
				projectId: approvedProject.id,
				accountId: 0,
				codeIds: [],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			expect(res.Code).toEqual(ErrorMap.E004.Code);
			expect(res.Message).toEqual(ErrorMap.E004.Message);
		});

		it('Should return error E019 when inputted Code ID does not belongs to account', async () => {
			const approvedProject: Project = await projectMixin.findOne({
				status: ProjectStatus.APPROVED,
			});

			const res: ResponseDto = await broker.call('project.updateProject', {
				projectId: approvedProject.id,
				accountId: 1,
				codeIds: [19],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			expect(res.Code).toEqual(ErrorMap.E019.Code);
			expect(res.Message).toEqual(ErrorMap.E019.Message);
		});

		it('Should return error E013 when inputted Code ID has not claimed ownership yet', async () => {
			const approvedProject: Project = await projectMixin.findOne({
				status: ProjectStatus.APPROVED,
			});

			const res: ResponseDto = await broker.call('project.updateProject', {
				projectId: approvedProject.id,
				accountId: approvedProject.accountId,
				codeIds: [1, 19],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			expect(res.Code).toEqual(ErrorMap.E013.Code);
			expect(res.Message).toEqual(ErrorMap.E013.Message);
		});

		it('Should return message successful when Code IDs are provided', async () => {
			const approvedProject: Project = await projectMixin.findOne({
				status: ProjectStatus.APPROVED,
			});

			const res: ResponseDto = await broker.call('project.updateProject', {
				projectId: approvedProject.id,
				accountId: approvedProject.accountId,
				codeIds: [19],
				name: 'Khanh An',
				email: 'doquockhanhan@gmail.com',
				description: 'Anything',
				otherDocumentation: 'Something else',
				activeStatus: ProjectActiveStatus.RELEASED,
				website: 'github.com',
				imageLink: 'facebook.com/doquockhanhan',
				categories: [ProjectCategories.FUNGIBLE_TOKEN],
			});

			const updatedProject: Project = await projectMixin.findOne({
				id: approvedProject.id,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(updatedProject.status).toEqual(ProjectStatus.SUBMITTED);
		});
	});

	describe("Test 'project.listProjects' action", () => {
		it('Should return all projects', async () => {
			const res: ResponseDto = await broker.call('project.listProjects', {
				limit: 10,
				offset: 0,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(res.Data.projects.length).toEqual(3);
		});
	});

	describe("Test 'project.listYourProjects' action", () => {
		it('Should return all projects of an account', async () => {
			const account: Account = await accountMixin.findOne({ username: 'andqk' });

			const res: ResponseDto = await broker.call('project.listYourProjects', {
				accountId: account.id,
				limit: 10,
				offset: 0,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(res.Data.projects.length).toEqual(3);
		});
	});

	describe("Test 'project.projectDetails' action", () => {
		it('Should return project data', async () => {
			const [project, codeId]: [Project, CodeId] = await Promise.all([
				projectMixin.findOne({}),
				codeIdMixin.findOne({ code_id: 19 }),
			]);

			await projectCodeIdMixin.insert({
				projectId: project.id,
				internalCodeId: codeId.id,
			});

			const res: ResponseDto = await broker.call('project.projectDetails', {
				id: project.id,
			});

			expect(res.Code).toEqual(ErrorMap.SUCCESSFUL.Code);
			expect(res.Message).toEqual(ErrorMap.SUCCESSFUL.Message);
			expect(_.omit(res.Data.project, ['id', 'accountId', 'createdAt', 'updatedAt'])).toEqual(
				{
					activeStatus: ProjectActiveStatus.RELEASED,
					bitcointalk: null,
					categories: [ProjectCategories.FUNGIBLE_TOKEN],
					description: 'Anything',
					discord: null,
					email: 'doquockhanhan@gmail.com',
					facebook: null,
					github: null,
					imageLink: 'facebook.com/doquockhanhan',
					isNew: 1,
					linkedin: null,
					medium: null,
					name: 'Khanh An',
					otherDocumentation: 'Something else',
					reddit: null,
					slack: null,
					status: ProjectStatus.SUBMITTED,
					telegram: null,
					twitter: null,
					website: 'github.com',
					wechat: null,
					whitepaper: null,
					codeIds: [
						{
							codeId: 19,
							mainnetCodeId: null,
						},
					],
				},
			);
		});

		it('Should return error E014 if provided project id does not exist', async () => {
			const res: ResponseDto = await broker.call('project.projectDetails', {
				id: 0,
			});

			expect(res.Code).toEqual(ErrorMap.E014.Code);
			expect(res.Message).toEqual(ErrorMap.E014.Message);
		});
	});
});
