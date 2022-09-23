import 'reflect-metadata';
import { ConfigurationManager } from '../../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { FirebaseRemoteConfigService } from './providers/firebase.remote.config.service';
import { CustomFeatureFlagsService } from './providers/custom.feature.flags.service';

////////////////////////////////////////////////////////////////////////////////

export class FeatureFlagsInjector {

    static registerInjections(container: DependencyContainer) {

        const provider = ConfigurationManager.FeatureFlagsProvider();
        if (provider === 'Firebase-Remote-Config') {
            container.register('IFeatureFlagsService', FirebaseRemoteConfigService);
        }
        else if (provider === 'Custom') {
            container.register('IFeatureFlagsService', CustomFeatureFlagsService);
        }
    }

}
