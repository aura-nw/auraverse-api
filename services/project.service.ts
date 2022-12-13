/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import * as bcrypt from "bcryptjs";
import _ from "lodash";
import { DatabaseCodeIdMixin, DatabaseProjectCodeIdMixin, DatabaseProjectMixin, DatabaseRequestMixin } from "../mixins/database";
import {
    AccountStatus,
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
    ResponseDto,
    UpdateProjectRequest,
} from "../types";
import { Account, CodeId, Project, Request } from "../models";
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
                    },
                    params: {
                        accountId: "number",
                        codeIds: {
                            type: "array|optional",
                            items: "number",
                        },
                        name: "string",
                        email: "string",
                        description: "string",
                        otherDocumentation: "string",
                        activeStatus: {
                            type: "enum",
                            values: ProjectActiveStatus.COMING_SOON,
                        },
                        website: "string",
                        imageLink: "string",
                        categories: {
                            type: "array",
                            items: "enum",
                            values: [ProjectCategories.ART, ProjectCategories.ANALYTICS],
                        },
                        whitepaper: "string|optional",
                        github: "string|optional",
                        telegram: "string|optional",
                        wechat: "string|optional",
                        linkedin: "string|optional",
                        discord: "string|optional",
                        medium: "string|optional",
                        reddit: "string|optional",
                        slack: "string|optional",
                        facebook: "string|optional",
                        twitter: "string|optional",
                        bitcointalk: "string|optional",
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
                    },
                    params: {
                        projectId: "number",
                        codeIds: {
                            type: "array|optional",
                            items: "number",
                        },
                        name: "string|optional",
                        email: "string|optional",
                        description: "string|optional",
                        otherDocumentation: "string|optional",
                        activeStatus: {
                            type: "enum|optional",
                            values: ProjectActiveStatus.COMING_SOON,
                        },
                        website: "string|optional",
                        imageLink: "string|optional",
                        categories: {
                            type: "array|optional",
                            items: "enum",
                            values: [ProjectCategories.ART, ProjectCategories.ANALYTICS],
                        },
                        whitepaper: "string|optional",
                        github: "string|optional",
                        telegram: "string|optional",
                        wechat: "string|optional",
                        linkedin: "string|optional",
                        discord: "string|optional",
                        medium: "string|optional",
                        reddit: "string|optional",
                        slack: "string|optional",
                        facebook: "string|optional",
                        twitter: "string|optional",
                        bitcointalk: "string|optional",
                    },
                    async handler(ctx: Context<UpdateProjectRequest>): Promise<ResponseDto> {
                        return await this.updateProject(ctx);
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

        let project = {} as Project;
        // Const requestProject = _.omit(ctx.params, ["categories"]);
        project = _.assign(project, ctx.params);
        project.status = ProjectStatus.SUBMITTED;
        const insertedProject = await this.projectMixin.insert(project);

        let requestEntity = {} as Request;
        const requestReq = _.omit(ctx.params, ["accountId", "codeIds"]);
        requestEntity = _.assign(requestEntity, requestReq);
        requestEntity.projectId = insertedProject.id;
        requestEntity.status = ProjectStatus.SUBMITTED;
        requestEntity.type = RequestType.CREATE;
        await this.requestMixin.insert(requestEntity);

        if (ctx.params.codeIds) {
            if (ctx.params.codeIds!.length > 0) {
                const codeIds = await this.codeIdMixin.find({ code_id: [...ctx.params.codeIds!] });
                const missingCodeIds = _.difference(ctx.params.codeIds!, codeIds.map((c: CodeId) => c.codeId));
                if (missingCodeIds.length > 0) {
                    return ResponseDto.response(ErrorMap.E013, { codeIds: missingCodeIds });
                }

                const listProjectCodeIds: any = [];
                codeIds.map((c: CodeId) =>
                    listProjectCodeIds.push(this.projectCodeIdMixin.insert({
                        projectId: insertedProject.id,
                        codeId: c.id,
                    }))
                );
                await Promise.all(listProjectCodeIds);
            }
        }

        return ResponseDto.response(ErrorMap.SUCCESSFUL);
    }

    public async updateProject(ctx: Context<UpdateProjectRequest>): Promise<ResponseDto> {
        const currentProject = await this.projectMixin.findOne({ id: ctx.params.projectId });
        if (!currentProject) {
            return ResponseDto.response(ErrorMap.E014, { request: ctx.params });
        }
        currentProject.status = ProjectStatus.SUBMITTED;

        let requestEntity = {} as Request;
        const requestReq = _.omit(ctx.params, ["codeIds"]);
        requestEntity = _.assign(requestEntity, requestReq);
        requestEntity.status = ProjectStatus.SUBMITTED;
        requestEntity.type = RequestType.UPDATE;
        await Promise.all([
            this.requestMixin.insert(requestEntity),
            this.projectMixin.update({ id: currentProject.id }, { status: ProjectStatus.SUBMITTED }),
        ]);

        return ResponseDto.response(ErrorMap.SUCCESSFUL);
    }
}
