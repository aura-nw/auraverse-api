import { DbTable } from "../../common";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseCodeIdMixin extends DatabaseMixin {
    private model: string = DbTable.CODE_ID;

    public constructor() {
        super(DbTable.CODE_ID);
    }
}
