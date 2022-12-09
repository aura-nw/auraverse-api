import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Model } from "objection";

export class BaseModel extends Model {
  @PrimaryGeneratedColumn("increment")
  public id = 0;

    @CreateDateColumn({
        type: "timestamp",
        name: "created_at",
    })
    public createdAt: Date | undefined;

    @UpdateDateColumn({
        type: "timestamp",
        name: "updated_at",
    })
    public updatedAt: Date | undefined;
}
