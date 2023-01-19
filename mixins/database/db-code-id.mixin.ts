import { knex } from "../../config/database";
import { DbTable } from "../../common";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseCodeIdMixin extends DatabaseMixin {
    private model: string = DbTable.CODE_ID;

    public constructor() {
        super(DbTable.CODE_ID);
    }

    public async getCodeIdsByProjectId(projectId: number): Promise<any> {
        return await knex(this.model)
            .join(DbTable.PROJECT_CODE_ID, `${this.model}.id`, `${DbTable.PROJECT_CODE_ID}.internal_code_id`)
            .select("*").where({ projectId });
    }

    public async getCodeIdsByCodeId(codeIds: number[]): Promise<any> {
        return await knex(this.model).select("*").whereIn("code_id", codeIds);
    }
}
