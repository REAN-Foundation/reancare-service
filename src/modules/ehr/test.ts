import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { container } from 'tsyringe';
import * as path from 'path';
import * as fs from 'fs';
import { Helper } from '../../common/helper';

/// <reference path = "./ehr.types.ts" />

import { GcpStorageService } from './specifications/fhir/providers/gcp/storage.service';
import { StorageService } from './services/storage.service';

////////////////////////////////////////////////////////////////////////////////////

export class Test_EHR {

    public static test = async () => {
        try {

            container.register('IStorageService', GcpStorageService);
            const storeService = container.resolve(StorageService);
            const initialized = await storeService.init();

        } catch (error) {
            console.log(error);
        }
    };
}
