import { Model, snakeCaseMappers } from "objection";
import { knex } from "../../config/database";

export class BaseModel extends Model {
    public id = 0;
    public createdAt: Date | undefined;
    public updatedAt: Date | undefined;

    public static get columnNameMappers() {
        return snakeCaseMappers();
    }
}

BaseModel.knex(knex);
