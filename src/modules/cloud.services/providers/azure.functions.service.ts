import { injectable } from 'tsyringe';
import axios, { AxiosInstance } from 'axios';
import { ApiError } from '../../../common/api.error';
import { IFunctionService } from '../interfaces/functions.service.interface';

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AzureFunctionService implements IFunctionService{

    private client: AxiosInstance;

    private functionKey?: string;

    constructor() {
        this.functionKey = process.env.AZURE_FUNCTION_KEY || undefined;
        this.client = axios.create({
            timeout : 10000,
        });
    }

    public async invokeFunction<T = any>(functionUrl: string, payload: object): Promise<T> {
        try {
            const headers: Record<string, string> = {
                'Content-Type' : 'application/json',
            };

            if (this.functionKey) {
                headers['x-functions-key'] = this.functionKey;
            }

            const response = await this.client.post(functionUrl, payload, { headers });

            const responseData = response.data;

            if (responseData?.Status === 'success') {
                const data = responseData?.Data
                    ? typeof responseData.Data === 'string'
                        ? JSON.parse(responseData.Data)
                        : responseData.Data
                    : null;

                return data as T;
            } else {
                throw new ApiError(
                    responseData?.HttpCode || 500,
                    responseData?.Message || 'Azure function invocation failed'
                );
            }
        } catch (error: any) {
            throw new ApiError(500, error.message || 'Azure function invocation error');
        }
    }

}
