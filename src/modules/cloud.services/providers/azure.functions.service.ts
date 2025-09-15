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
        // this.functionKey = process.env.AZURE_FUNCTION_KEY || undefined;
        this.client = axios.create({
            timeout : 10000,
        });
    }

    public async invokeFunction<T = any>(functionName: string, payload: object, action: string): Promise<T> {
        try {
            const headers: Record<string, string> = {
                'Content-Type' : 'application/json',
            };

            let response: any = null;

            if (action === 'create-secret') {
                this.functionKey = process.env.AZURE_CREATE_SECRET_FUNCTION_KEY || undefined;

                const functionUrl = `https://${functionName}.azurewebsites.net/api/create_secrets?code=${this.functionKey}`;

                response = await this.client.post(functionUrl, payload, { headers });
            }
            else if (action === 'get-secret') {
                this.functionKey = process.env.AZURE_GET_SECRET_FUNCTION_KEY || undefined;

                const functionUrl = `https://${functionName}.azurewebsites.net/api/get_secrets?code=${this.functionKey}`;

                response = await this.client.post(functionUrl, payload, { headers });
            }
            else if (action === 'update-secret') {
                this.functionKey = process.env.AZURE_UPDATE_SECRET_FUNCTION_KEY || undefined;

                const functionUrl = `https://${functionName}.azurewebsites.net/api/update_secrets?code=${this.functionKey}`;

                response = await this.client.post(functionUrl, payload, { headers });
            }
            else if (action === 'create-bot-schema') {
                this.functionKey = process.env.AZURE_CREATE_BOT_SCHEMA_FUNCTION_KEY || undefined;

                const functionUrl = `https://${functionName}.azurewebsites.net/api/create_schema?code=${this.functionKey}`;

                response = await this.client.post(functionUrl, payload, { headers });
            }
            else {
                throw new ApiError(400, 'Invalid action specified for Azure function invocation');
            }

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
