/* eslint-disable id-blacklist */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import _ from "lodash";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Job } from "bull";
import { GasPrice } from "@cosmjs/stargate";
import { ApiConstants, AppConstants, CallApiMethod, ErrorMap, ModulePath, ProjectStatus, RequestType } from "../common";
import {
    ListRequest,
    PagingRequest,
    IdRequest,
    ResponseDto,
    RejectRequest,
    StoreCodeIdRequest,
} from "../types";
import CallApiMixin from "../mixins/callapi/call-api.mixin";
import { DatabaseAccountMixin, DatabaseCodeIdMixin, DatabaseProjectCodeIdMixin, DatabaseProjectMixin, DatabaseRequestMixin } from "../mixins/database";
import { Common, KMSSigner, Network } from "../utils";
import { Account, CodeId, Project, ProjectCodeId, Request } from "../models";
import { queueConfig } from "../config/queue";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const queueService = require("moleculer-bull");

export default class RequestService extends Service {
    private callApiMixin = new CallApiMixin().start();
    private accountMixin = new DatabaseAccountMixin();
    private requestMixin = new DatabaseRequestMixin();
    private projectMixin = new DatabaseProjectMixin();
    private codeIdMixin = new DatabaseCodeIdMixin();
    private projectCodeIdMixin = new DatabaseProjectCodeIdMixin();
    private commonService = new Common();
    private defaultGasPrice = GasPrice.fromString(process.env.DEFAULT_GAS_PRICE!);

    public constructor(public broker: ServiceBroker) {
        super(broker);
        this.parseServiceSchema({
            name: ModulePath.REQUEST,
            mixins: [
                queueService(queueConfig.redis, queueConfig.opts),
                this.callApiMixin,
            ],
            actions: {
                /**
                 * View your requests
                 *
                 */
                listYourRequests: {
                    rest: {
                        method: CallApiMethod.GET,
                        path: ApiConstants.LIST_YOUR,
                    },
                    openapi: {
                        summary: "View your requests",
                        description: "View your requests",
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
                        return await this.listRequests(ctx);
                    },
                },

                /**
                 * View all requests
                 */
                listRequests: {
                    rest: {
                        method: CallApiMethod.GET,
                        path: ApiConstants.LIST,
                    },
                    openapi: {
                        summary: "View all requests",
                        description: "View all requests",
                        security: [{ bearerAuth: [] }],
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
                        return await this.listRequests(ctx);
                    },
                },

                /**
                 * View details of a request
                 */
                requestDetails: {
                    rest: {
                        method: CallApiMethod.GET,
                        path: ApiConstants.DETAILS,
                    },
                    openapi: {
                        summary: "View details of a request",
                        description: "View details of a request",
                        security: [{ bearerAuth: [] }],
                    },
                    params: {
                        id: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                    },
                    async handler(ctx: Context<IdRequest>): Promise<ResponseDto> {
                        return await this.requestDetails(ctx);
                    },
                },

                /**
                 * Request store code id on Mainnet
                 */
                requestStoreCodeId: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.REQUEST_STORE_CODE_ID,
                    },
                    openapi: {
                        summary: "Request store code id on Mainnet",
                        description: "Request store code id on Mainnet",
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
                        email: "string",
                    },
                    async handler(ctx: Context<StoreCodeIdRequest>): Promise<ResponseDto> {
                        return await this.requestStoreCodeId(ctx);
                    },
                },

                /**
                 * Review and confirm a request
                 */
                confirmRequest: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.CONFIRM,
                    },
                    openapi: {
                        summary: "Review and confirm a request",
                        description: "Review and confirm a request",
                        security: [{ bearerAuth: [] }],
                    },
                    params: {
                        id: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                    },
                    async handler(ctx: Context<IdRequest>): Promise<ResponseDto> {
                        return await this.confirmRequest(ctx);
                    },
                },

                /**
                 * Review and reject a request
                 */
                rejectRequest: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.CONFIRM,
                    },
                    openapi: {
                        summary: "Review and reject a request",
                        description: "Review and reject a request",
                        security: [{ bearerAuth: [] }],
                    },
                    params: {
                        id: {
                            type: "number",
                            integer: true,
                            convert: true,
                        },
                        reason: "string",
                    },
                    async handler(ctx: Context<RejectRequest>): Promise<ResponseDto> {
                        return await this.rejectRequest(ctx);
                    },
                },
            },
            queues: {
                "request.store-code-id": {
                    concurrency: parseInt(process.env.CONCURRENCY_STORE_CODE_ID!, 10),
                    async process(job: Job) {
                        job.progress(10);
                        // @ts-ignore
                        await this.uploadCodeIdMainnet(job.data.ids, job.data.email, job.data.requestId);
                        job.progress(100);
                    },
                },
            },
        });
    }

    // Action
    public async listRequests(ctx?: Context<ListRequest>): Promise<ResponseDto> {
        const requests: Request[] = await this.requestMixin.getListRequests(
            ctx?.params.accountId, ctx?.params.limit, ctx?.params.offset
        );

        return ResponseDto.response(ErrorMap.SUCCESSFUL, requests);
    }

    public async requestDetails(ctx: Context<IdRequest>): Promise<ResponseDto> {
        const request: Request = await this.requestMixin.findOne({ id: ctx.params.id });
        if (!request) {
            return ResponseDto.response(ErrorMap.E018, { id: ctx.params.id });
        }

        return ResponseDto.response(ErrorMap.SUCCESSFUL, request);
    }

    public async requestStoreCodeId(ctx: Context<StoreCodeIdRequest>): Promise<ResponseDto> {
        if (ctx.params.codeIds?.length === 0) {
            return ResponseDto.response(ErrorMap.E020);
        }

        const codeIds: CodeId[] = await this.codeIdMixin.getCodeIdsByCodeId(ctx.params.codeIds!);
        const missingCodeIds = _.difference(ctx.params.codeIds!, codeIds.map((c: CodeId) => c.codeId));
        if (missingCodeIds.length > 0) {
            return ResponseDto.response(ErrorMap.E013, { codeIds: missingCodeIds });
        }

        const request = {} as Request;
        request.codeIds = JSON.stringify(ctx.params.codeIds);
        request.accountId = ctx.params.accountId;
        request.email = ctx.params.email;
        request.status = ProjectStatus.SUBMITTED;
        request.type = RequestType.STORE_CODE_ID;
        await this.requestMixin.insert(request);

        return ResponseDto.response(ErrorMap.SUCCESSFUL);
    }

    public async confirmRequest(ctx: Context<IdRequest>): Promise<ResponseDto> {
        const request: Request = await this.requestMixin.findOne({ id: ctx.params.id });
        if (!request) {
            return ResponseDto.response(ErrorMap.E018, { id: ctx.params.id });
        }

        const [account, __]: [Account, any] = await Promise.all([
            this.accountMixin.findOne({ id: request.accountId }),
            this.requestMixin.update({ id: ctx.params.id }, { status: ProjectStatus.PROCESSING }),
        ]);
        let project = {} as Project;
        if (request.type !== RequestType.STORE_CODE_ID) {
            project = await this.projectMixin.findOne({ id: request.projectId });
            if (!project) {
                return ResponseDto.response(ErrorMap.E014, { id: request.projectId });
            }
        }

        const listQueries: any[] = [];
        switch (request.type) {
            case RequestType.CREATE:
                if (request.codeIds) {
                    const idsCreate: number[] = JSON.parse(request.codeIds);
                    const codeIdsCreate: CodeId[] = await this.codeIdMixin.find({ code_id: idsCreate });
                    codeIdsCreate.map((codeId: CodeId) => {
                        const projectCodeId = {} as ProjectCodeId;
                        projectCodeId.projectId = project.id;
                        projectCodeId.internalCodeId = codeId.id;
                        listQueries.push(this.projectCodeIdMixin.insert(projectCodeId));
                    });
                }
                listQueries.push([
                    this.projectMixin.update({ id: project.id }, { status: ProjectStatus.APPROVED }),
                    this.requestMixin.update({ id: request.id }, { status: ProjectStatus.APPROVED }),
                    this.commonService.sendEmail(
                        account.email!,
                        "Project listing request approved!",
                        `<p>Your request ${ctx.params.id} has been approved!</p>`
                    ),
                ]);
                break;
            case RequestType.UPDATE:
                if (request.name) { project.name = request.name; }
                if (request.email) { project.email = request.email; }
                if (request.description) { project.description = request.description; }
                if (request.otherDocumentation) { project.otherDocumentation = request.otherDocumentation; }
                if (request.activeStatus) { project.activeStatus = request.activeStatus; }
                if (request.website) { project.website = request.website; }
                if (request.imageLink) { project.imageLink = request.imageLink; }
                if (request.categories) { project.categories = request.categories; }
                if (request.whitepaper) { project.whitepaper = request.whitepaper; }
                if (request.github) { project.github = request.github; }
                if (request.telegram) { project.telegram = request.telegram; }
                if (request.wechat) { project.wechat = request.wechat; }
                if (request.linkedin) { project.linkedin = request.linkedin; }
                if (request.discord) { project.discord = request.discord; }
                if (request.medium) { project.medium = request.medium; }
                if (request.reddit) { project.reddit = request.reddit; }
                if (request.slack) { project.slack = request.slack; }
                if (request.facebook) { project.facebook = request.facebook; }
                if (request.twitter) { project.twitter = request.twitter; }
                if (request.bitcointalk) { project.bitcointalk = request.bitcointalk; }
                if (request.codeIds) {
                    const idsUpdate: number[] = JSON.parse(request.codeIds);
                    const [codeIdsUpdate, ___]: [CodeId[], any] = await Promise.all([
                        this.codeIdMixin.find({ code_id: idsUpdate }),
                        this.projectCodeIdMixin.delete({ projectId: project.id }),
                    ]);
                    codeIdsUpdate.map((codeId: CodeId) => {
                        const projectCodeId = {} as ProjectCodeId;
                        projectCodeId.projectId = project.id;
                        projectCodeId.internalCodeId = codeId.id;
                        listQueries.push(this.projectCodeIdMixin.insert(projectCodeId));
                    });
                }
                project.status = ProjectStatus.APPROVED;
                listQueries.push([
                    this.projectMixin.update({ id: project.id }, project),
                    this.requestMixin.update({ id: request.id }, { status: ProjectStatus.APPROVED }),
                    this.commonService.sendEmail(
                        account.email!,
                        "Project update request approved!",
                        `<p>Your request ${ctx.params.id} has been approved!</p>`
                    ),
                ]);
                break;
            case RequestType.DELETE:
                listQueries.push([
                    this.projectMixin.delete({ id: project.id }),
                    this.projectCodeIdMixin.delete({ projectId: project.id }),
                    this.requestMixin.update({ id: request.id }, { status: ProjectStatus.APPROVED }),
                    this.commonService.sendEmail(
                        account.email!,
                        "Project delete request approved!",
                        `<p>Your request ${ctx.params.id} has been approved!</p>`
                    ),
                ]);
                break;
            case RequestType.STORE_CODE_ID:
                const ids: number[] = JSON.parse(request.codeIds!);
                this.createJob(
                    "request.store-code-id",
                    {
                        ids,
                        email: request.email,
                        requestId: request.id,
                    },
                    {
                        removeOnComplete: true,
                        removeOnFail: {
                            count: 10,
                        },
                    },
                );
                return ResponseDto.response(ErrorMap.REQUEST_CONFIRMED, { id: ctx.params.id });
        }
        await Promise.all(listQueries);

        return ResponseDto.response(ErrorMap.REQUEST_CONFIRMED, { id: ctx.params.id });
    }

    public async rejectRequest(ctx: Context<RejectRequest>): Promise<ResponseDto> {
        const request: Request = await this.requestMixin.findOne({ id: ctx.params.id });
        if (!request) {
            return ResponseDto.response(ErrorMap.E018, { id: ctx.params.id });
        }

        const [account, __]: [Account, any] = await Promise.all([
            this.accountMixin.findOne({ id: request.accountId }),
            this.requestMixin.update({ id: ctx.params.id }, { status: ProjectStatus.PROCESSING }),
        ]);
        if (request.type !== RequestType.STORE_CODE_ID) {
            const project = await this.projectMixin.findOne({ id: request.projectId });
            if (!project) {
                return ResponseDto.response(ErrorMap.E014, { id: request.projectId });
            }
        }
        await Promise.all([
            this.requestMixin.update({ id: ctx.params.id }, { status: ProjectStatus.REJECTED }),
            // TODO: Edit email content
            this.commonService.sendEmail(
                account.email!,
                "Request rejected!",
                `<p>Your request ${ctx.params.id} has been rejected!</p>
                <p>Reason: ${ctx.params.reason}</p>`
            ),
        ]);

        return ResponseDto.response(ErrorMap.REQUEST_REJECTED);
    }

    // Queues
    public async uploadCodeIdMainnet(ids: number[], email: string, requestId: number) {
        const codeIds: CodeId[] = await this.codeIdMixin.find({ code_id: ids });
        const missingCodeIds = _.difference(ids, codeIds.map((c: CodeId) => c.codeId));
        if (missingCodeIds.length > 0) {
            return ResponseDto.response(ErrorMap.E013, { codeIds: missingCodeIds });
        }

        try {
            for (const codeId of codeIds) {
                if (codeId.mainnetCodeId !== null && codeId.mainnetCodeId !== 0) { continue; }
                const client = await CosmWasmClient.connect(process.env.BASE_RPC!);
                const codeDetails = await client.getCodeDetails(codeId.codeId!);
                this.logger.info("Code details:", codeDetails);

                // Get signer
                const signer = new KMSSigner(process.env.SIGNER_WALLET_ADDRESS!);

                // Get system address info
                const account = await signer.getAccount();
                this.logger.info("System account:", account);

                // Connect network
                const network = await Network.connectWithSigner(
                    process.env.TARGET_RPC!,
                    account,
                    signer,
                    { gasPrice: this.defaultGasPrice }
                );

                const targetCodeId = await this.commonService.storeCode(
                    account.address,
                    codeDetails.data,
                    AppConstants.AUTO,
                    network
                );
                this.logger.info("Target code id:", targetCodeId);

                await Promise.all([
                    this.codeIdMixin.update({ id: codeId.id }, { mainnetCodeId: targetCodeId }),
                    this.commonService.sendEmail(
                        email,
                        "Code ID stored successful!",
                        `<p>Your code id ${codeId.codeId} has been stored on Mainnet successful!</p>
                        <p>Code ID on Mainnet: ${targetCodeId}</p>`
                    ),
                ]);
            }
        } catch (error) {
            this.logger.error(error);
            await this.requestMixin.update({ id: requestId }, { status: ProjectStatus.ERROR });
        }
    }

    public async _start(): Promise<void> {
        this.getQueue("request.store-code-id").on("completed", (job: Job) => {
            this.logger.info(`Job #${job.id} completed!, result: ${job.returnvalue}`);
        });
        this.getQueue("request.store-code-id").on("failed", (job: Job) => {
            this.logger.error(`Job #${job.id} failed!, error: ${job.failedReason}`);
        });
        this.getQueue("request.store-code-id").on("progress", (job: Job) => {
            this.logger.info(`Job #${job.id} progress: ${job.progress()}%`);
        });
        return super._start();
    }
}
