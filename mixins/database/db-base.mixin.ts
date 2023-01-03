/* eslint-disable id-blacklist */
import { knex } from "../../config/database";

export class DatabaseMixin {
	private tableName: string;

	public constructor(tableName: string) {
		this.tableName = tableName;
	}

	public async insert(data: any): Promise<any> {
		return await knex(this.tableName).insert(data);
	}

	public async update(where: any, data: any): Promise<any> {
		return await knex(this.tableName).where(where).update(data);
	}

	public async findOne(where?: any): Promise<any> {
		return where
			? await knex(this.tableName).select("*").where(where).first()
			: await knex(this.tableName).select("*").first();
	}

	public async find(where?: any, limit?: number, offset?: number): Promise<any> {
		return where
			? await knex(this.tableName).select("*").where(where)
				.limit(limit ? limit : 10).offset(offset ? offset : 0)
			: await knex(this.tableName).select("*")
				.limit(limit ? limit : 10).offset(offset ? offset : 0);
	}

	public async delete(where: any): Promise<any> {
		return await knex(this.tableName).where(where).del();
	}
}
