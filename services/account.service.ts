/* eslint-disable camelcase */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import * as bcrypt from "bcryptjs";
import { DatabaseAccountMixin, DatabaseCodeIdMixin } from "../mixins/database";
import { AccountStatus, ApiConstants, CallApiMethod, ContractVerification, ErrorMap, ApiQuery, ModulePath } from "../common";
import {
    ChangeEmailRequest,
    ChangePasswordRequest,
    ResponseDto,
    VerifyCodeIdOwnershipRequest,
} from "../types";
import { Account, CodeId } from "../models";
import CallApiMixin from "../mixins/callapi/call-api.mixin";

export default class AccountService extends Service {
    private callApiMixin = new CallApiMixin().start();
    private accountMixin = new DatabaseAccountMixin();
    private codeIdMixin = new DatabaseCodeIdMixin();

    public constructor(public broker: ServiceBroker) {
        super(broker);
        this.parseServiceSchema({
            name: ModulePath.ACCOUNT,
            mixins: [this.callApiMixin],
            actions: {
                /**
                 * Change account's password
                 *
                 */
                changePassword: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.CHANGE_PASSWORD,
                    },
                    openapi: {
                        summary: "Change account's password",
                        description: "Change account's password",
                    },
                    params: {
                        username: "string",
                        oldPassword: "string",
                        newPassword: "string",
                    },
                    async handler(ctx: Context<ChangePasswordRequest>): Promise<ResponseDto> {
                        return await this.changePassword(ctx);
                    },
                },

                /**
                 * Change account's email
                 */
                changeEmail: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.CHANGE_EMAIL,
                    },
                    openapi: {
                        summary: "Change account's email",
                        description: "Change account's email",
                    },
                    params: {
                        username: "string",
                        newEmail: "string",
                        password: "string",
                    },
                    async handler(ctx: Context<ChangeEmailRequest>): Promise<ResponseDto> {
                        return await this.changeEmail(ctx);
                    },
                },

                /**
                 * Claim ownership of a code id for an account
                 */
                verifyCodeIdOwnership: {
                    rest: {
                        method: CallApiMethod.POST,
                        path: ApiConstants.VERIFY_CODE_ID_OWNERSHIP,
                    },
                    openapi: {
                        summary: "Claim ownership of a code id for an account",
                        description: "Claim ownership of a code id for an account",
                    },
                    params: {
                        codeId: "number",
                        accountId: "number",
                    },
                    async handler(ctx: Context<VerifyCodeIdOwnershipRequest>): Promise<ResponseDto> {
                        return await this.verifyCodeIdOwnership(ctx);
                    },
                },
            },
        });
    }

    // Action
    public async changePassword(ctx: Context<ChangePasswordRequest>): Promise<ResponseDto> {
        const account: Account = await this.accountMixin.findOne({ username: ctx.params.username });
        if (!account) { return ResponseDto.response(ErrorMap.E004, { request: ctx.params }); }
        if (account.accountStatus === AccountStatus.WAITING) {
            return ResponseDto.response(ErrorMap.E005, { request: ctx.params });
        }
        if (!bcrypt.compareSync(ctx.params.oldPassword!, account.password!)) {
            return ResponseDto.response(ErrorMap.E005, { request: ctx.params });
        }
        await this.accountMixin.update({ id: account.id }, { password: bcrypt.hashSync(ctx.params.newPassword!, 8) });

        return ResponseDto.response(ErrorMap.SUCCESSFUL, { account });
    }

    public async changeEmail(ctx: Context<ChangeEmailRequest>): Promise<ResponseDto> {
        const [account, existEmails] = await Promise.all([
            this.accountMixin.findOne({ username: ctx.params.username }),
            this.accountMixin.find({ email: ctx.params.newEmail }),
        ]);
        if (!account) { return ResponseDto.response(ErrorMap.E004, { request: ctx.params }); }
        if (account.accountStatus === AccountStatus.WAITING) {
            return ResponseDto.response(ErrorMap.E005, { request: ctx.params });
        }
        if (existEmails.length > 0) { return ResponseDto.response(ErrorMap.E002, { request: ctx.params }); }
        else if (!ctx.params.password) { return ResponseDto.response(ErrorMap.EMAIL_VALID); }
        if (!bcrypt.compareSync(ctx.params.password, account.password)) {
            return ResponseDto.response(ErrorMap.E006, { request: ctx.params });
        }
        await this.accountMixin.update({ id: account.id }, { email: ctx.params.newEmail });

        return ResponseDto.response(ErrorMap.SUCCESSFUL, { account });
    }

    public async verifyCodeIdOwnership(ctx: Context<VerifyCodeIdOwnershipRequest>): Promise<ResponseDto> {
        const [codeIdOnChain, codeIdAurascan, codeIdDb] = await Promise.all([
            this.callApiFromDomain([process.env.LCD], `${ApiQuery.GET_DATA_CODE_ID}${ctx.params.codeId}`),
            this.callApiFromDomain([process.env.AURASCAN_API], `${ApiQuery.GET_CODE_ID_VERIFICATION}${ctx.params.codeId}`),
            this.codeIdMixin.findOne({ code_id: ctx.params.codeId }),
        ]);
        if (!codeIdOnChain.code_info) { return ResponseDto.response(ErrorMap.E007, { request: ctx.params }); }
        if (codeIdAurascan.contract_verification === ContractVerification.UNVERIFIED) {
            return ResponseDto.response(ErrorMap.E008, { request: ctx.params });
        }
        if (codeIdDb.length > 0) { return ResponseDto.response(ErrorMap.E009, { request: ctx.params }); }

        if (!ctx.params.accountId || ctx.params.accountId === 0) { return ResponseDto.response(ErrorMap.CHECK_CODE_ID, { data: codeIdOnChain }); }

        const codeIdEntity = {
            codeId: ctx.params.codeId,
            accountId: ctx.params.accountId,
            creator: codeIdOnChain.code_info.creator,
            dataHash: codeIdOnChain.code_info.data_hash,
            data: codeIdOnChain.data,
        } as CodeId;
        this.codeIdMixin.insert(codeIdEntity);

        return ResponseDto.response(ErrorMap.VERIFY_CODE_ID_OWNERSHIP, { codeId: ctx.params.codeId });
    }
}
