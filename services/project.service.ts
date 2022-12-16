/* eslint-disable id-blacklist */
/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import _ from "lodash";
import { DatabaseCodeIdMixin, DatabaseProjectCodeIdMixin, DatabaseProjectMixin, DatabaseRequestMixin } from "../mixins/database";
import {
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
    ListProjectsRequest,
    ResponseDto,
    UpdateProjectRequest,
} from "../types";
import { CodeId, Project, Request } from "../models";
import CallApiMixin from "../mixins/callapi/call-api.mixin";

export default class ProjectService extends Service {
    private callApiMixin = new CallApiMixin().start();
    private projectMixin = new DatabaseProjectMixin();
    private projectCodeIdMixin = new DatabaseProjectCodeIdMixin();
    private requestMixin = new DatabaseRequestMixin();
    private codeIdMixin = new DatabaseCodeIdMixin();

    public constructor(public broker: ServiceBroker) {
        super(broker);
        this.parseServiceSchema({
            name: ModulePath.PROJECT,
            mixins: [this.callApiMixin],
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
                        accountId: "number",
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
                        projectId: "number",
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
                        accountId: "number",
                    },
                    async handler(ctx: Context<ListProjectsRequest>): Promise<ResponseDto> {
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
                    params: {},
                    async handler(): Promise<ResponseDto> {
                        return await this.listProjects();
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
        if (ctx.params.codeIds!.length > 0) {
            const codeIds = await this.codeIdMixin.find({ code_id: [...ctx.params.codeIds!] });
            const missingCodeIds = _.difference(ctx.params.codeIds!, codeIds.map((c: CodeId) => c.codeId));
            if (missingCodeIds.length > 0) {
                return ResponseDto.response(ErrorMap.E013, { codeIds: missingCodeIds });
            }
        }

        let project = {} as Project;
        const requestProject = _.omit(ctx.params, ["codeIds", "categories"]);
        project = _.assign(project, requestProject);
        project.categories = JSON.stringify(ctx.params.categories);
        project.status = ProjectStatus.SUBMITTED;
        const insertedProject = await this.projectMixin.insert(project);

        let requestEntity = {} as Request;
        const requestReq = _.omit(ctx.params, ["accountId", "codeIds", "categories", "activeStatus"]);
        requestEntity = _.assign(requestEntity, requestReq);
        requestEntity.projectId = insertedProject[0];
        if (ctx.params.codeIds) { requestEntity.codeIds = JSON.stringify(ctx.params.codeIds); }
        requestEntity.categories = JSON.stringify(ctx.params.categories);
        requestEntity.status = ProjectStatus.SUBMITTED;
        requestEntity.type = RequestType.CREATE;
        await this.requestMixin.insert(requestEntity);

        return ResponseDto.response(ErrorMap.SUCCESSFUL);
    }

    public async updateProject(ctx: Context<UpdateProjectRequest>): Promise<ResponseDto> {
        const currentProject = await this.projectMixin.findOne({ id: ctx.params.projectId });
        if (!currentProject) {
            return ResponseDto.response(ErrorMap.E014, { request: ctx.params });
        }
        currentProject.status = ProjectStatus.SUBMITTED;

        let requestEntity = {} as Request;
        const requestReq = _.omit(ctx.params, ["codeIds", "categories"]);
        requestEntity = _.assign(requestEntity, requestReq);
        if (ctx.params.codeIds) { requestEntity.codeIds = JSON.stringify(ctx.params.codeIds); }
        requestEntity.categories = JSON.stringify(ctx.params.categories);
        requestEntity.status = ProjectStatus.SUBMITTED;
        requestEntity.type = RequestType.UPDATE;
        await Promise.all([
            this.requestMixin.insert(requestEntity),
            this.projectMixin.update({ id: currentProject.id }, { status: ProjectStatus.SUBMITTED }),
        ]);

        return ResponseDto.response(ErrorMap.SUCCESSFUL);
    }

    public async listProjects(ctx?: Context<ListProjectsRequest>): Promise<ResponseDto> {
        return typeof ctx?.params.accountId !== undefined
            ? await this.projectMixin.find()
            : await this.projectMixin.find({ accountId: ctx?.params.accountId });
    }
}
