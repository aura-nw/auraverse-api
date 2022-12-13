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

	public async findOne(where: any): Promise<any> {
		return await knex(this.tableName).select("*").where(where).first();
	}

	public async find(where: any): Promise<any> {
		return await knex(this.tableName).select("*").where(where);
	}

	public async delete(where: any): Promise<any> {
		return await knex(this.tableName).where(where).del();
	}
}
