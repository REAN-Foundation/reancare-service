/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../../common/logger';
import { IFeatureFlagsService } from '../interfaces/feature.flags.service.interface';

///////////////////////////////////////////////////////////////////////////////////

export class FirebaseRemoteConfigService implements IFeatureFlagsService {

    //#region Publics

    init(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    providerName(): string {
        throw new Error('Method not implemented.');
    }

    flagExists(key: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    isEnabled(key: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    //#endregion

}
