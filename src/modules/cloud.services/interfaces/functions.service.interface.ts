export interface IFunctionService {

    invokeFunction<T = any>(functionName: string, payload: object): Promise<T>;
}

