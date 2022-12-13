import { Model } from "objection";

export class BaseModel extends Model {
    public id = 0;
    public createdAt: Date | undefined;
    public updatedAt: Date | undefined;
}
