import { IFileStorageService } from '../interfaces/file.storage.service.interface';

//import { Twilio } from 'twilio';

///////////////////////////////////////////////////////////////////////////////////

// const account_sid = process.env.TWILIO_ACCOUNT_SID;
// const auth_token = process.env.TWILIO_AUTH_TOKEN;
// const serviceFromPhone = process.env.SYSTEM_PHONE_NUMBER;
// const client = new Twilio(account_sid, auth_token);

///////////////////////////////////////////////////////////////////////////////////

export class AWSS3FileStorageService implements IFileStorageService {

    upload = async (storageKey: string, localFilePath?: string): Promise<string> => {
        throw new Error('Method not implemented.');
    }

    download = async (storageKey: string, localFolder?: string): Promise<string> => {
        throw new Error('Method not implemented.');
    }

    rename = async (existingStorageKey: string, newStorageKey: string): Promise<boolean> => {
        throw new Error('Method not implemented.');
    }

    delete = async (storageKey: string): Promise<boolean> => {
        throw new Error('Method not implemented.');
    }

}
