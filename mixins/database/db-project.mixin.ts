import { DbTable } from "../../common";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseProjectMixin extends DatabaseMixin {
    private model: string = DbTable.PROJECT;

    public constructor() {
        super(DbTable.PROJECT);
    }
}
