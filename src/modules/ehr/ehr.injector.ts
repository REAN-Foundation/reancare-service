import 'reflect-metadata';
import { ConfigurationManager } from '../../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { FhirInjector } from './specifications/fhir/fhir.injector';
import { MockEhrInjector } from './specifications/mock.ehr/mockehr.injector';

//import { OpenEhrInjector } from './specifications/openehr/openehr.injector';

////////////////////////////////////////////////////////////////////////////////

export class EhrInjector {

    static registerInjections(container: DependencyContainer) {

        var ehrEnabled = ConfigurationManager.EhrEnabled();

        if (ehrEnabled) {
            
            const ehrSpec = ConfigurationManager.EhrSpecification();

            if (ehrSpec === 'FHIR') {
                FhirInjector.registerInjections(container);
            }
            // else if (ehrSpec === 'OpenEHR') {
            //     OpenEhrInjector.registerInjections(container);
            // }
            else {
                MockEhrInjector.registerInjections(container);
            }
        }

    }

}
