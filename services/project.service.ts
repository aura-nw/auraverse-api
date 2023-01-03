/* eslint-disable id-blacklist */
/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import _ from "lodash";
import { DatabaseCodeIdMixin, DatabaseProjectMixin, DatabaseRequestMixin } from "../mixins/database";
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
    ListRequest,
    PagingRequest,
    IdRequest,
    ResponseDto,
    UpdateProjectRequest,
} from "../types";
import { CodeId, Project, Request } from "../models";
import CallApiMixin from "../mixins/callapi/call-api.mixin";

export default class ProjectService extends Service {
    private callApiMixin = new CallApiMixin().start();
    private projectMixin = new DatabaseProjectMixin();
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

        let project = {} as Project;
        const requestProject = _.omit(ctx.params, ["codeIds", "categories"]);
        project = _.assign(project, requestProject);
        project.categories = JSON.stringify(ctx.params.categories);
        project.status = ProjectStatus.SUBMITTED;
        const insertedProject = await this.projectMixin.insert(project);

        let requestEntity = {} as Request;
        const requestReq = _.omit(ctx.params, ["codeIds", "categories", "activeStatus"]);
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
        const listQueries = [];

        let currentProject: Project = await this.projectMixin.findOne({ id: ctx.params.projectId });
        if (!currentProject) {
            return ResponseDto.response(ErrorMap.E014, { request: ctx.params });
        } else if (currentProject.status === ProjectStatus.SUBMITTED) {
            return ResponseDto.response(ErrorMap.E017, { request: ctx.params });
        }

        if (ctx.params.codeIds && ctx.params.codeIds!.length > 0) {
            const codeIds: CodeId[] = await this.codeIdMixin.find({ code_id: [...ctx.params.codeIds!] });
            const missingCodeIds = _.difference(ctx.params.codeIds!, codeIds.map((c: CodeId) => c.codeId));
            if (missingCodeIds.length > 0) {
                return ResponseDto.response(ErrorMap.E013, { codeIds: missingCodeIds });
            }

            listQueries.push(this.projectMixin.update({ id: currentProject.id }, { status: ProjectStatus.SUBMITTED }));

            let requestEntity = {} as Request;
            const requestReq = _.omit(ctx.params, ["codeIds", "categories"]);
            requestEntity = _.assign(requestEntity, requestReq);
            if (ctx.params.codeIds) { requestEntity.codeIds = JSON.stringify(ctx.params.codeIds); }
            if (ctx.params.categories) { requestEntity.categories = JSON.stringify(ctx.params.categories); }
            requestEntity.status = ProjectStatus.SUBMITTED;
            requestEntity.type = RequestType.UPDATE;
            listQueries.push(this.requestMixin.insert(requestEntity));
        } else {
            const requestProject = _.omit(ctx.params, ["codeIds", "categories"]);
            currentProject = _.assign(currentProject, requestProject);
            currentProject.categories = JSON.stringify(ctx.params.categories);
            listQueries.push(this.projectMixin.update({ id: currentProject.id }, currentProject));
        }
        await Promise.all(listQueries);

        return ResponseDto.response(ErrorMap.SUCCESSFUL);
    }

    public async listProjects(ctx?: Context<ListRequest>): Promise<ResponseDto> {
        const projects: Project[] = ctx?.params.accountId
            ? await this.projectMixin.find(
                { accountId: ctx.params.accountId },
                ctx.params.limit ? ctx.params.limit : 10,
                ctx.params.offset ? ctx.params.offset : 0
            )
            : await this.projectMixin.find(
                null,
                ctx?.params.limit ? ctx.params.limit : 10,
                ctx?.params.offset ? ctx.params.offset : 0
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
            codeIds.map((cid: any) => {
                mappedCodeIds.push({
                    codeId: cid.code_id,
                    mainnetCodeId: cid.mainnetCodeId,
                });
            });
            resultProject.codeIds = mappedCodeIds;
        }

        return ResponseDto.response(ErrorMap.SUCCESSFUL, { project: resultProject });
    }
}
