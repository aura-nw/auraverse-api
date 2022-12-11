import { DbTable } from "common";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseCodeIdMixin extends DatabaseMixin {
    public constructor() {
        super(DbTable.CODE_ID);
    }
}
