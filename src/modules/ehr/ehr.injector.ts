import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { FhirInjector } from './specifications/fhir/providers/injector';

////////////////////////////////////////////////////////////////////////////////

export class EhrInjector {

    static registerInjections(container: DependencyContainer) {

        FhirInjector.registerInjections(container);
    }

}
