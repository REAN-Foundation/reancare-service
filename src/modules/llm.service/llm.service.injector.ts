import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { LlmService } from './llm.service';

////////////////////////////////////////////////////////////////////////////////

export class LlmServiceInjector {

    static registerInjections(container: DependencyContainer) {
        container.register('ILlmService', LlmService);
    }

}
