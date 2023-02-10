import { JSONSchema } from 'objection';
import { BaseModel } from './base/base.model';

export class ProjectCodeId extends BaseModel {
	public static jsonSchema: JSONSchema = {
		type: 'object',
		required: ['projectId', 'internalCodeId'],
		properties: {
			id: { type: 'integer' },
			createdAt: { type: 'timestamp', default: 'now()' },
			updatedAt: { type: 'timestamp', default: 'now()' },
			projectId: { type: 'integer' },
			internalCodeId: { type: 'integer' },
		},
	};

	public projectId: number | undefined;
	public internalCodeId: number | undefined;
}

module.exports = ProjectCodeId;
