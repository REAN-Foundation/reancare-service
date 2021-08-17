import { IStorageService } from '../../interfaces/storage.service.interface';
import { Logger } from '../../../../common/logger';

////////////////////////////////////////////////////////////////////////////////

export class MockStorageService implements IStorageService {

    //#region public methods

    public init = async (): Promise<boolean> => {
        try {
            Logger.instance().log('Connecting to EHR store...');
            return true;
        } catch (error) {
            Logger.instance().log('Error initializing GCP dataset/fhir-store. Error: ' + error.message);
        }
    };

    //#endregion

}
