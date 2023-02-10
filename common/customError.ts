import { ErrorMap } from './error.map';
export class CustomError extends Error {
	private constructor(public errorMap: typeof ErrorMap.SUCCESSFUL, public msg?: string) {
		super(errorMap.Code);
	}
}
