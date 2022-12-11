import { DbTable } from "common";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseAccountMixin extends DatabaseMixin {
    public constructor() {
        super(DbTable.ACCOUNT);
    }
}
