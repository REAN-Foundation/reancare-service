import 'reflect-metadata';
import { container } from 'tsyringe';

/// <reference path = "./ehr.types.ts" />

import { GcpStorageService } from './specifications/fhir/providers/gcp/storage.service';
import { StorageService } from './services/storage.service';
import { Logger } from '../../common/logger';

////////////////////////////////////////////////////////////////////////////////////

export class Test_EHR {

    public static test = async (): Promise<void> => {
        try {
            container.register('IStorageService', GcpStorageService);
            const storeService = container.resolve(StorageService);
            const initialized = await storeService.init();
            if (initialized) {
                Logger.instance().log('FHIR storage service initialized.');
            }
        } catch (error) {
            Logger.instance().log(error);
        }
    };

}
