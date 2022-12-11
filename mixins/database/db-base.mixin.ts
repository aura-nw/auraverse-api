import { knex } from "config/database";

export class DatabaseMixin {
	private tableName: string;

	public constructor(tableName: string) {
		this.tableName = tableName;
	}

	public insert(data: any): any {
		return knex(this.tableName).insert(data).toSQL().toNative();
	}

	public upsert(data: any): any {
		return knex(this.tableName).upsert(data).toSQL().toNative();
	}

	public findOne(where: any): any {
		return knex(this.tableName).select("*").where(where).first().toSQL().toNative();
	}

	public find(where: any): any {
		return knex(this.tableName).select("*").where(where).toSQL().toNative();
	}

	public delete(where: any): any {
		return knex(this.tableName).where(where).del().toSQL().toNative();
	}
}
