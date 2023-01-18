/* eslint-disable id-blacklist */
/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import { Job } from "bull";
import _ from "lodash";
import dayjs from "dayjs";
import { DatabaseAccountMixin, DatabaseCodeIdMixin, DatabaseProjectMixin, DatabaseRequestMixin } from "../mixins/database";
import {
    AccountType,
    ApiConstants,
    CallApiMethod,
    ErrorMap,
    ModulePath,
    ProjectActiveStatus,
    ProjectCategories,
    ProjectStatus,
    RequestType,
} from "../common";
import {
    CreateProjectRequest,
    ListRequest,
    PagingRequest,
    IdRequest,
    ResponseDto,
    UpdateProjectRequest,
} from "../types";
import { Account, CodeId, Project, Request } from "../models";
import CallApiMixin from "../mixins/callapi/call-api.mixin";
import { queueConfig } from "../config/queue";
import { Common } from "../utils";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const queueService = require("moleculer-bull");

export default class ProjectService extends Service {
    private callApiMixin = new CallApiMixin().start();
    private accountMixin = new DatabaseAccountMixin();
    private projectMixin = new DatabaseProjectMixin();
    private requestMixin = new DatabaseRequestMixin();
    private codeIdMixin = new DatabaseCodeIdMixin();
    private commonService = new Common();

    public constructor(public broker: ServiceBroker) {
        super(broker);
        this.parseServiceSchema({
            name: ModulePath.PROJECT,
            mixins: [
                queueService(queueConfig.redis, queueConfig.opts),
                this.callApiMixin,
            ],
            actions: {
                /**
                 * List a project on Auraverse
                 *
                 */
                createProject: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.CREATE,
                    },
                    openapi: {
                        summary: "List a project on Auraverse",
                        description: "List a project on Auraverse",
                        security: [{ bearerAuth: [] }],
                    },
                    params: {
                        accountId: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                        codeIds: {
                            type: "array",
                            items: "number",
                            optional: true,
                        },
                        name: "string",
                        email: "string",
                        description: "string",
                        otherDocumentation: "string",
                        activeStatus: {
                            type: "string",
                            enum: Object.values(ProjectActiveStatus),
                        },
                        website: "string",
                        imageLink: "string",
                        categories: {
                            type: "array",
                            items: "string",
                            enum: Object.values(ProjectCategories),
                        },
                        whitepaper: {
                            type: "string",
                            optional: true,
                        },
                        github: {
                            type: "string",
                            optional: true,
                        },
                        telegram: {
                            type: "string",
                            optional: true,
                        },
                        wechat: {
                            type: "string",
                            optional: true,
                        },
                        linkedin: {
                            type: "string",
                            optional: true,
                        },
                        discord: {
                            type: "string",
                            optional: true,
                        },
                        medium: {
                            type: "string",
                            optional: true,
                        },
                        reddit: {
                            type: "string",
                            optional: true,
                        },
                        slack: {
                            type: "string",
                            optional: true,
                        },
                        facebook: {
                            type: "string",
                            optional: true,
                        },
                        twitter: {
                            type: "string",
                            optional: true,
                        },
                        bitcointalk: {
                            type: "string",
                            optional: true,
                        },
                    },
                    async handler(ctx: Context<CreateProjectRequest>): Promise<ResponseDto> {
                        return await this.createProject(ctx);
                    },
                },

                /**
                 * Update information of a project on Auraverse
                 */
                updateProject: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.UPDATE,
                    },
                    openapi: {
                        summary: "Update information of a project on Auraverse",
                        description: "Update information of a project on Auraverse",
                        security: [{ bearerAuth: [] }],
                    },
                    params: {
                        projectId: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                        accountId: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                        codeIds: {
                            type: "array",
                            items: "number",
                            optional: true,
                        },
                        name: {
                            type: "string",
                            optional: true,
                        },
                        email: {
                            type: "string",
                            optional: true,
                        },
                        description: {
                            type: "string",
                            optional: true,
                        },
                        otherDocumentation: {
                            type: "string",
                            optional: true,
                        },
                        activeStatus: {
                            type: "string",
                            enum: Object.values(ProjectActiveStatus),
                            optional: true,
                        },
                        website: {
                            type: "string",
                            optional: true,
                        },
                        imageLink: {
                            type: "string",
                            optional: true,
                        },
                        categories: {
                            type: "array",
                            items: "string",
                            enum: Object.values(ProjectCategories),
                        },
                        whitepaper: {
                            type: "string",
                            optional: true,
                        },
                        github: {
                            type: "string",
                            optional: true,
                        },
                        telegram: {
                            type: "string",
                            optional: true,
                        },
                        wechat: {
                            type: "string",
                            optional: true,
                        },
                        linkedin: {
                            type: "string",
                            optional: true,
                        },
                        discord: {
                            type: "string",
                            optional: true,
                        },
                        medium: {
                            type: "string",
                            optional: true,
                        },
                        reddit: {
                            type: "string",
                            optional: true,
                        },
                        slack: {
                            type: "string",
                            optional: true,
                        },
                        facebook: {
                            type: "string",
                            optional: true,
                        },
                        twitter: {
                            type: "string",
                            optional: true,
                        },
                        bitcointalk: {
                            type: "string",
                            optional: true,
                        },
                    },
                    async handler(ctx: Context<UpdateProjectRequest>): Promise<ResponseDto> {
                        return await this.updateProject(ctx);
                    },
                },

                /**
                 * View your projects list
                 */
                listYourProjects: {
                    rest: {
                        method: CallApiMethod.GET,
                        path: ApiConstants.LIST_YOUR,
                    },
                    openapi: {
                        summary: "View your projects list",
                        description: "View your projects list",
                        security: [{ bearerAuth: [] }],
                    },
                    params: {
                        accountId: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                        limit: {
                            type: "number",
                            optional: true,
                            default: 10,
                            integer: true,
                            convert: true,
                            min: 0,
                            max: 100,
                        },
                        offset: {
                            type: "number",
                            optional: true,
                            default: 0,
                            integer: true,
                            convert: true,
                            min: 0,
                            max: 100,
                        },
                    },
                    async handler(ctx: Context<ListRequest>): Promise<ResponseDto> {
                        return await this.listProjects(ctx);
                    },
                },

                /**
                 * View all projects
                 */
                listProjects: {
                    rest: {
                        method: CallApiMethod.GET,
                        path: ApiConstants.LIST,
                    },
                    openapi: {
                        summary: "View all projects",
                        description: "View all projects",
                    },
                    params: {
                        limit: {
                            type: "number",
                            optional: true,
                            default: 10,
                            integer: true,
                            convert: true,
                            min: 0,
                            max: 100,
                        },
                        offset: {
                            type: "number",
                            optional: true,
                            default: 0,
                            integer: true,
                            convert: true,
                            min: 0,
                            max: 100,
                        },
                    },
                    async handler(ctx: Context<PagingRequest>): Promise<ResponseDto> {
                        return await this.listProjects(ctx);
                    },
                },

                /**
                 * View details of a project
                 */
                projectDetails: {
                    rest: {
                        method: CallApiMethod.GET,
                        path: ApiConstants.DETAILS,
                    },
                    openapi: {
                        summary: "View details of a project",
                        description: "View details of a project",
                    },
                    params: {
                        id: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                    },
                    async handler(ctx: Context<IdRequest>): Promise<ResponseDto> {
                        return await this.projectDetails(ctx);
                    },
                },
            },
            queues: {
                "handle.check-project-is-new": {
                    concurrency: parseInt(process.env.CONCURRENCY_CHECK_PROJECT_IS_NEW!, 10),
                    async process(job: Job) {
                        job.progress(10);
                        // @ts-ignore
                        await this.checkProjectIsNew(job.data.offset);
                        job.progress(100);
                    },
                },
            },
        });
    }

    // Action
    public async createProject(ctx: Context<CreateProjectRequest>): Promise<ResponseDto> {
        if (ctx.params.categories!.length > 4) {
            return ResponseDto.response(ErrorMap.E010, { request: ctx.params });
        }
        if (ctx.params.codeIds && ctx.params.codeIds!.length > 0) {
            const codeIds: CodeId[] = await this.codeIdMixin.find({ code_id: [...ctx.params.codeIds!] });
            const missingCodeIds = _.difference(ctx.params.codeIds!, codeIds.map((c: CodeId) => c.codeId));
            if (missingCodeIds.length > 0) {
                return ResponseDto.response(ErrorMap.E013, { codeIds: missingCodeIds });
            }
        }

        const [account, admin]: [Account, Account] = await Promise.all([
            this.accountMixin.findOne({ id: ctx.params.accountId }),
            this.accountMixin.findOne({ account_type: AccountType.ADMIN }),
        ]);
        if (!account) {
            return ResponseDto.response(ErrorMap.E004, { accountId: ctx.params.accountId });
        }

        let project = {} as Project;
        const requestProject = _.omit(ctx.params, ["codeIds", "categories"]);
        project = _.assign(project, requestProject);
        project.categories = JSON.stringify(ctx.params.categories);
        project.status = ProjectStatus.SUBMITTED;
        const insertedProject = await this.projectMixin.insert(project);

        let requestEntity = {} as Request;
        const requestReq = _.omit(ctx.params, ["codeIds", "categories"]);
        requestEntity = _.assign(requestEntity, requestReq);
        requestEntity.projectId = insertedProject[0];
        if (ctx.params.codeIds && ctx.params.codeIds!.length > 0) {
            requestEntity.codeIds = JSON.stringify(ctx.params.codeIds);
        }
        requestEntity.categories = JSON.stringify(ctx.params.categories);
        requestEntity.status = ProjectStatus.SUBMITTED;
        requestEntity.type = RequestType.CREATE;
        const insertedRequest = await this.requestMixin.insert(requestEntity);

        await Promise.all([
            this.commonService.sendEmail(
                account.email!,
                "List project request!",
                "<p>Your request has been recorded!</p>"
            ),
            this.commonService.sendEmail(
                admin.email!,
                "List project request!",
                `<p>A request to list project has been created!
                #<a href=${process.env.APP_DOMAIN}/public/${ModulePath.REQUEST}/details/${insertedRequest[0]}>${insertedRequest[0]}</a>!</p>`
            ),
        ]);

        return ResponseDto.response(ErrorMap.SUCCESSFUL, { requestId: insertedRequest[0] });
    }

    public async updateProject(ctx: Context<UpdateProjectRequest>): Promise<ResponseDto> {
        let currentProject: Project = await this.projectMixin.findOne({ id: ctx.params.projectId });
        if (!currentProject) {
            return ResponseDto.response(ErrorMap.E014, { request: ctx.params });
        } else if (currentProject.status === ProjectStatus.SUBMITTED) {
            return ResponseDto.response(ErrorMap.E017, { request: ctx.params });
        }

        const [account, admin]: [Account, Account] = await Promise.all([
            this.accountMixin.findOne({ id: ctx.params.accountId }),
            this.accountMixin.findOne({ account_type: AccountType.ADMIN }),
        ]);
        if (!account) {
            return ResponseDto.response(ErrorMap.E004, { accountId: ctx.params.accountId });
        }

        if (ctx.params.codeIds && ctx.params.codeIds!.length > 0) {
            const codeIds: CodeId[] = await this.codeIdMixin.find({ code_id: [...ctx.params.codeIds!] });

            const notOwnedCodeIds: CodeId[] = codeIds.filter((codeId: CodeId) =>
                codeId.accountId !== ctx.params.accountId);
            if (notOwnedCodeIds.length > 0) {
                return ResponseDto.response(ErrorMap.E019, { codeIds: notOwnedCodeIds });
            }

            const missingCodeIds: (number | undefined)[] =
                _.difference(ctx.params.codeIds!, codeIds.map((c: CodeId) => c.codeId));
            if (missingCodeIds.length > 0) {
                return ResponseDto.response(ErrorMap.E013, { codeIds: missingCodeIds });
            }

            await this.projectMixin.update({ id: currentProject.id }, { status: ProjectStatus.SUBMITTED });

            let requestEntity = {} as Request;
            const requestReq = _.omit(ctx.params, ["codeIds", "categories"]);
            requestEntity = _.assign(requestEntity, requestReq);
            if (ctx.params.codeIds) { requestEntity.codeIds = JSON.stringify(ctx.params.codeIds); }
            if (ctx.params.categories) { requestEntity.categories = JSON.stringify(ctx.params.categories); }
            requestEntity.status = ProjectStatus.SUBMITTED;
            requestEntity.type = RequestType.UPDATE;
            const insertedRequest = await this.requestMixin.insert(requestEntity);

            await Promise.all([
                this.commonService.sendEmail(
                    account.email!,
                    "Update project request!",
                    "<p>Your request has been recorded!</p>"
                ),
                this.commonService.sendEmail(
                    admin.email!,
                    "Update project request!",
                    `<p>A request to update project has been created!
                    #<a href=${process.env.APP_DOMAIN}/public/${ModulePath.REQUEST}/details/${insertedRequest[0]}>${insertedRequest[0]}</a>!</p>`
                ),
            ]);

            return ResponseDto.response(ErrorMap.SUCCESSFUL, { requestId: insertedRequest[0] });
        } else {
            const requestProject = _.omit(ctx.params, ["codeIds", "categories"]);
            currentProject = _.assign(currentProject, requestProject);
            currentProject.categories = JSON.stringify(ctx.params.categories);
            await this.projectMixin.update({ id: currentProject.id }, currentProject);

            return ResponseDto.response(ErrorMap.SUCCESSFUL);
        }
    }

    public async listProjects(ctx?: Context<ListRequest>): Promise<ResponseDto> {
        const projects: Project[] = await this.projectMixin.getListProjects(
            ctx?.params.accountId, ctx?.params.limit, ctx?.params.offset
        );

        return ResponseDto.response(ErrorMap.SUCCESSFUL, projects);
    }

    public async projectDetails(ctx: Context<IdRequest>): Promise<ResponseDto> {
        const mappedCodeIds: any[] = [];
        const [project, codeIds]: [Project, CodeId[]] = await Promise.all([
            this.projectMixin.findOne({ id: ctx.params.id }),
            this.codeIdMixin.getCodeIdsByProjectId(ctx.params.id!),
        ]);
        if (!project) {
            return ResponseDto.response(ErrorMap.E014, { id: ctx.params.id });
        }

        const resultProject: any = { ...project };
        if (codeIds.length > 0) {
            codeIds.map((cid: CodeId) => {
                mappedCodeIds.push({
                    codeId: cid.codeId,
                    mainnetCodeId: cid.mainnetCodeId,
                });
            });
            resultProject.codeIds = mappedCodeIds;
        }

        return ResponseDto.response(ErrorMap.SUCCESSFUL, { project: resultProject });
    }

    public async checkProjectIsNew(offset: number) {
        const projects = await this.projectMixin.find(undefined, 100, offset);

        if (projects.length > 0) {
            const listUpdates: any[] = [];
            projects.map((project: Project) => {
                const today = dayjs(new Date());
                const projectCreatedDate = dayjs(project.createdAt);
                if (today.diff(projectCreatedDate, "day") >= 30) {
                    listUpdates.push(this.projectMixin.update({ id: project.id }, { is_new: false }));
                }
            });

            await Promise.all(listUpdates);

            this.createJob(
                "handle.check-project-is-new",
                {
                    offset: ++offset,
                },
                {
                    removeOnComplete: true,
                    removeOnFail: {
                        count: 10,
                    },
                },
            );
        }
    }

    public async _start(): Promise<void> {
        this.createJob(
            "handle.check-project-is-new",
            {
                offset: 0,
            },
            {
                removeOnComplete: true,
                removeOnFail: {
                    count: 10,
                },
                repeat: {
                    cron: "0 0 0 * * ?",
                },
            },
        );

        this.getQueue("handle.check-project-is-new").on("completed", (job: Job) => {
            this.logger.info(`Job #${job.id} completed!, result: ${job.returnvalue}`);
        });
        this.getQueue("handle.check-project-is-new").on("failed", (job: Job) => {
            this.logger.error(`Job #${job.id} failed!, error: ${job.failedReason}`);
        });
        this.getQueue("handle.check-project-is-new").on("progress", (job: Job) => {
            this.logger.info(`Job #${job.id} progress: ${job.progress()}%`);
        });
        // eslint-disable-next-line no-underscore-dangle
        return super._start();
    }
}
