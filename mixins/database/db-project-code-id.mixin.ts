import { DbTable } from '../../common';
import { DatabaseMixin } from './db-base.mixin';

export class DatabaseProjectCodeIdMixin extends DatabaseMixin {
	private model: string = DbTable.PROJECT_CODE_ID;

	public constructor() {
		super(DbTable.PROJECT_CODE_ID);
	}
}
