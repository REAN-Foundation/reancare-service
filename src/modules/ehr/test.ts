import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { container } from 'tsyringe';
import * as path from 'path';
import * as fs from 'fs';
import { Helper } from '../../common/helper';

/// <reference path = "./ehr.types.ts" />

import { IStorageService } from './interfaces/storage.service.interface';
import { GcpFhirStoreService } from './standards/fhir/providers/gcp/fhir.service.gcp';
import { StorageService } from './services/storage.service';

////////////////////////////////////////////////////////////////////////////////////

export class Test_EHR {

    public static test = async () => {
        try {

            container.register('IStorageService', GcpFhirStoreService);
            const storeService = container.resolve(StorageService);
            const initialized = await storeService.initialize();

        } catch (error) {
            console.log(error);
        }
    };
}
