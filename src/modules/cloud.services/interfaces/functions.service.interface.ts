export interface IFunctionService {

    invokeFunction<T = any>(functionName: string, payload: object, action: string): Promise<T>;
}

