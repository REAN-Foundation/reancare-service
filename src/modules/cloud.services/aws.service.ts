import { injectable } from 'tsyringe';
import AWS from 'aws-sdk';
import { Logger } from '../../common/logger';

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

        try {
            const response = await this.lambda.invoke(params).promise();
            const responsePayload = response.Payload ? JSON.parse(response.Payload.toString()) : null;
            return responsePayload as T;
        } catch (error) {
            Logger.instance().log(`Error while invoking Lambda function! : ${error.message}`, );
            return null;
        }
    }

}
