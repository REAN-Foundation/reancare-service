import 'reflect-metadata';
import { ConfigurationManager } from '../../../../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { GcpFhirInjector } from './providers/gcp/gcp.fhir.injector';

////////////////////////////////////////////////////////////////////////////////

export class FhirInjector {

    static registerInjections(container: DependencyContainer) {

        const provider = ConfigurationManager.EhrProvider();
        if (provider === 'GCP-FHIR') {
            GcpFhirInjector.registerInjections(container);
        }

    }

}
