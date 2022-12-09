/* eslint-disable @typescript-eslint/no-var-requires */
import { Column, Entity } from "typeorm";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

@Entity({ name: "code_id" })
export class CodeId extends BaseModel {
    @Column({
        name: "code_id",
        unique: true,
    })
    public codeId: number | undefined;

    @Column({ name: "account_id" })
    public accountId: number | undefined;

    @Column({ name: "creator" })
    public creator: string | undefined;

    @Column({ name: "data_hash" })
    public dataHash: string | undefined;

    @Column({
        name: "data",
        type: "text",
    })
    public data: string | undefined;

    @Column({
        name: "mainnet_code_id",
        unique: true,
        nullable: true,
    })
    public mainnetCodeId: number | undefined;
}

CodeId.knex(knex);

module.exports = CodeId;
