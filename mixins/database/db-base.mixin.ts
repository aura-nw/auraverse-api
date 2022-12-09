import { knex } from "config/database";

export class DatabaseMixin {
	public insert(tableName: string, data: any): any {
		return knex(tableName).insert(data).toSQL().toNative();
	}

	public upsert(tableName: string, data: any): any {
		return knex(tableName).upsert(data).toSQL().toNative();
	}

	public findOne(tableName: string, where: any): any {
		return knex(tableName).select("*").where(where).first().toSQL().toNative();
	}

	public find(tableName: string, where: any): any {
		return knex(tableName).select("*").where(where).toSQL().toNative();
	}

	public delete(tableName: string, where: any): any {
		return knex(tableName).where(where).del().toSQL().toNative();
	}
}
