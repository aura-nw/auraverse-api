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
                        return await this.changePassword(
                            ctx.params.username,
                            ctx.params.oldPassword,
                            ctx.params.newPassword
                        );
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
                        return await this.changeEmail(
                            ctx.params.username,
                            ctx.params.newEmail,
                            ctx.params.password
                        );
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
                        return await this.verifyCodeIdOwnership(
                            ctx.params.codeId,
                            ctx.params.accountId
                        );
                    },
                },
            },
        });
    }

    // Action
    public async changePassword(username: string, oldPassword: string, newPassword: string): Promise<ResponseDto> {
        const account: Account = await this.accountMixin.findOne({ username });
        if (!account) { return ResponseDto.response(ErrorMap.E004, { username, oldPassword, newPassword }); }
        if (account.accountStatus === AccountStatus.WAITING) { return ResponseDto.response(ErrorMap.E005, { username, oldPassword, newPassword }); }
        if (!bcrypt.compareSync(oldPassword, account.password!)) { return ResponseDto.response(ErrorMap.E005, { username, oldPassword, newPassword }); }
        await this.accountMixin.update({ id: account.id }, { password: bcrypt.hashSync(newPassword, 8) });

        return ResponseDto.response(ErrorMap.SUCCESSFUL, { account });
    }

    public async changeEmail(username: string, newEmail: string, password: string): Promise<ResponseDto> {
        const [account, existEmails] = await Promise.all([
            this.accountMixin.findOne({ username }),
            this.accountMixin.find({ email: newEmail }),
        ]);
        if (!account) { return ResponseDto.response(ErrorMap.E004, { username, newEmail, password }); }
        if (account.accountStatus === AccountStatus.WAITING) {
            return ResponseDto.response(ErrorMap.E005, { username, newEmail, password });
        }
        if (existEmails.length > 0) { return ResponseDto.response(ErrorMap.E002, { username, newEmail, password }); }
        else if (!password) { return ResponseDto.response(ErrorMap.EMAIL_VALID); }
        if (!bcrypt.compareSync(password, account.password)) {
            return ResponseDto.response(ErrorMap.E006, { username, newEmail, password });
        }
        await this.accountMixin.update({ id: account.id }, { email: newEmail });

        return ResponseDto.response(ErrorMap.SUCCESSFUL, { account });
    }

    public async verifyCodeIdOwnership(codeId: number, accountId: number): Promise<ResponseDto> {
        const [codeIdOnChain, codeIdAurascan, codeIdDb] = await Promise.all([
            this.callApiFromDomain([process.env.LCD], `${ApiQuery.GET_DATA_CODE_ID}${codeId}`),
            this.callApiFromDomain([process.env.AURASCAN_API], `${ApiQuery.GET_CODE_ID_VERIFICATION}${codeId}`),
            this.codeIdMixin.findOne({ code_id: codeId }),
        ]);
        if (!codeIdOnChain.code_info) { return ResponseDto.response(ErrorMap.E007, { codeId, accountId }); }
        if (codeIdAurascan.contract_verification === ContractVerification.UNVERIFIED) { return ResponseDto.response(ErrorMap.E008, { codeId, accountId }); }
        if (codeIdDb.length > 0) { return ResponseDto.response(ErrorMap.E009, { codeId, accountId }); }

        if (!accountId || accountId === 0) { return ResponseDto.response(ErrorMap.CHECK_CODE_ID, { data: codeIdOnChain }); }

        const codeIdEntity = {
            codeId,
            accountId,
            creator: codeIdOnChain.code_info.creator,
            dataHash: codeIdOnChain.code_info.data_hash,
            data: codeIdOnChain.data,
        } as CodeId;
        this.codeIdMixin.insert(codeIdEntity);

        return ResponseDto.response(ErrorMap.VERIFY_CODE_ID_OWNERSHIP, { codeId });
    }
}
