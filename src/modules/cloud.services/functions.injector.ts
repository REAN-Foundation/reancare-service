import 'reflect-metadata';
import { ConfigurationManager } from '../../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { AwsLambdaService } from './providers/aws.lambda.service';
import { AzureFunctionService } from './providers/azure.functions.service';

////////////////////////////////////////////////////////////////////////////////

export class FunctionsInjector {

    static registerInjections(container: DependencyContainer) {

        const provider = ConfigurationManager.FunctionsProvider();
        if (provider === 'AWS-Lambda') {
            container.register('IFunctionService', AwsLambdaService);
        }
        else if (provider === 'Azure-Functions') {
            container.register('IFunctionService', AzureFunctionService);
        }
    }

}
