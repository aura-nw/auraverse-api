/* eslint-disable @typescript-eslint/no-var-requires */
import { Column, Entity } from "typeorm";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

@Entity({ name: "project_code_id" })
export class ProjectCodeId extends BaseModel {
    @Column({ name: "project_id" })
    public projectId: number | undefined;

    @Column({ name: "internal_code_id" })
    public internalCodeId: number | undefined;
}

ProjectCodeId.knex(knex);

module.exports = ProjectCodeId;
