import { injectable } from 'tsyringe';
import AWS from 'aws-sdk';
import { ApiError } from '../../common/api.error';

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AwsLambdaService {

    private lambda: AWS.Lambda;

    constructor() {
        AWS.config.update({
            region          : process.env.AWS_REGION,
            accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
        });
        this.lambda = new AWS.Lambda();
    }

    public async invokeLambdaFunction<T = any>(functionName: string, payload: object): Promise<T> {
        const params: AWS.Lambda.InvocationRequest = {
            FunctionName   : functionName,
            InvocationType : 'RequestResponse',
            LogType        : 'Tail',
            Payload        : JSON.stringify(payload),
        };
        const response = await this.lambda.invoke(params).promise();
        const responsePayload = response.Payload ? JSON.parse(response.Payload.toString()) : null;
        const data = responsePayload?.Data ? JSON.parse(responsePayload.Data.toString()) : null;
        if (responsePayload?.Status === 'success') {
            return data as T;
        } else {
            throw new ApiError(responsePayload?.HttpCode || 500, responsePayload?.Message || 'Lambda invocation failed');
        }
    }

}
