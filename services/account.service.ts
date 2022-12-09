/* eslint-disable capitalized-comments */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import * as bcrypt from "bcryptjs";
import { AccountStatus, ApiConstants, CallApiMethod, ContractVerification, ErrorMap, ApiQuery, ModulePath } from "../common";
import {
    ChangeEmailRequest,
    ChangePasswordRequest,
    ResponseDto,
    VerifyCodeIdOwnershipRequest,
} from "../types";
import { Account, CodeId } from "../models";
import { DatabaseAccountMixin } from "../mixins/database";
import CallApiMixin from "../mixins/callapi/call-api.mixin";

export default class AccountService extends Service {
    private callApiMixin = new CallApiMixin().start();

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
                    body: {
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
                    body: {
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
                    body: {
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
    // public async changePassword(username: string, oldPassword: string, newPassword: string): Promise<ResponseDto> {
    //     const account: Account = (await dbAccountMixin.findOne({
    //         where: { username },
    //     }))[0];
    //     if (!account) {return ResponseDto.response(ErrorMap.E004, { username, oldPassword, newPassword });}
    //     if (account.accountStatus === AccountStatus.WAITING) {return ResponseDto.response(ErrorMap.E005, { username, oldPassword, newPassword });}
    //     if (!bcrypt.compareSync(oldPassword, account.password!))
    //         {return ResponseDto.response(ErrorMap.E005, { username, oldPassword, newPassword });}

    //     account.password = bcrypt.hashSync(newPassword, 8);
    //     await dbAccountMixin.update(account);
    //     return ResponseDto.response(ErrorMap.SUCCESSFUL, { account });
    // }

    // public async changeEmail(username: string, newEmail: string, password: string): Promise<ResponseDto> {
    //     const [accounts, existEmails] = await Promise.all([
    //         dbAccountMixin.findOne({ where: { username } }),
    //         dbAccountMixin.findOne({ where: { email: newEmail } }),
    //     ]);
    //     const account = accounts[0];
    //     if (!account) {return ResponseDto.response(ErrorMap.E004, { username, newEmail, password });}
    //     if (account.accountStatus === AccountStatus.WAITING) {return ResponseDto.response(ErrorMap.E005, { username, newEmail, password });}
    //     if (existEmails.length > 0) {return ResponseDto.response(ErrorMap.E002, { username, newEmail, password });}
    //     else if (!password) {return ResponseDto.response(ErrorMap.EMAIL_VALID);}
    //     if (!bcrypt.compareSync(password, account.password))
    //         {return ResponseDto.response(ErrorMap.E006, { username, newEmail, password });}

    //     account.email = newEmail;
    //     await dbAccountMixin.update(account);
    //     return ResponseDto.response(ErrorMap.SUCCESSFUL, { account });
    // }

    // public async verifyCodeIdOwnership(codeId: number, accountId: number): Promise<ResponseDto> {
    //     const [codeIdOnChain, codeIdAurascan, codeIdDb] = await Promise.all([
    //         this.callApiFromDomain([process.env.LCD], `${ApiQuery.GET_DATA_CODE_ID}${codeId}`),
    //         this.callApiFromDomain([process.env.AURASCAN_API], `${ApiQuery.GET_CODE_ID_VERIFICATION}${codeId}`),
    //         dbCodeIdMixin.findOne({ where: { code_id: codeId } }),
    //     ]);
    //     if (!codeIdOnChain.code_info) {return ResponseDto.response(ErrorMap.E007, { codeId, accountId });}
    //     if (codeIdAurascan.contract_verification === ContractVerification.UNVERIFIED)
    //         {return ResponseDto.response(ErrorMap.E008, { codeId, accountId });}
    //     if (codeIdDb.length > 0) {return ResponseDto.response(ErrorMap.E009, { codeId, accountId });}

    //     if (!accountId || accountId === 0)
    //         {return ResponseDto.response(ErrorMap.CHECK_CODE_ID, { data: codeIdOnChain });}

    //     const codeIdEntity = new CodeId();
    //     codeIdEntity.codeId = codeId;
    //     codeIdEntity.accountId = accountId;
    //     codeIdEntity.creator = codeIdOnChain.code_info.creator;
    //     codeIdEntity.dataHash = codeIdOnChain.code_info.data_hash;
    //     codeIdEntity.data = codeIdOnChain.data;
    //     await dbCodeIdMixin.update(codeIdEntity);

    //     return ResponseDto.response(ErrorMap.VERIFY_CODE_ID_OWNERSHIP, { codeId });
    // }
}
