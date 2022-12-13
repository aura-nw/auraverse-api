import { DbTable } from "../../common";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseRequestMixin extends DatabaseMixin {
    private model: string = DbTable.REQUEST;

    public constructor() {
        super(DbTable.REQUEST);
    }
}
