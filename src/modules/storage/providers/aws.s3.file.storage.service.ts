import { IFileStorageService } from '../interfaces/file.storage.service.interface';

import * as aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////

const TEMP_DOWNLOAD_FOLDER = path.join(process.cwd(), './tmp/resources/downloads/');

///////////////////////////////////////////////////////////////////////////////////

export class AWSS3FileStorageService implements IFileStorageService {

    //#region Publics

    upload = async (storageKey: string, localFilePath?: string): Promise<string> => {

        const fileContent = fs.readFileSync(localFilePath);

        const s3 = this.getS3Client();
        const params = {
            Bucket : process.env.RESOURCES_S3_BUCKET_NAME,
            Key    : storageKey,
            Body   : fileContent
        };
        var stored = await s3.upload(params).promise();

        Logger.instance().log(JSON.stringify(stored, null, 2));

        return storageKey;
    };

    download = async (storageKey: string, localFolder?: string): Promise<string> => {
        
        const s3 = this.getS3Client();
        const params = {
            Bucket : process.env.RESOURCES_S3_BUCKET_NAME,
            Key    : storageKey,
        };

        var s3Path = storageKey;
        var tokens = s3Path.split('/');
        var localFile = tokens[tokens.length - 1];
        var folderPath = path.join(TEMP_DOWNLOAD_FOLDER, localFolder);
        await fs.promises.mkdir(folderPath, { recursive: true });

        var localDestination = path.join(folderPath, localFile);
        var file = fs.createWriteStream(localDestination);

        return new Promise((resolve, reject) => {
            s3.getObject(params).createReadStream()
                .on('end', () => {

                    //var st = fs.existsSync(localDestination);

                    var stats = fs.statSync(localDestination);
                    var count = 0;
                    while (stats.size === 0 && count < 5) {
                        setTimeout(() => {
                            stats = fs.statSync(localDestination);
                        }, 3000);
                        count++;
                    }
                    return resolve(localDestination);
                })
                .on('error', (error) => {
                    return reject(error);
                })
                .pipe(file);
        });
    }

    rename = async (storageKey: string, newFileName: string): Promise<boolean> => {

        const s3 = this.getS3Client();

        var s3Path = storageKey;
        var tokens = s3Path.split('/');
        var existingFileName = tokens[tokens.length - 1];
        var newPath = s3Path.replace(existingFileName, newFileName);
        if (newPath === s3Path){
            throw new Error('Old and new file identifiers are same!');
        }

        var BUCKET_NAME = process.env.RESOURCES_S3_BUCKET_NAME;
        var OLD_KEY = s3Path;
        var NEW_KEY = newPath;

        const params = {
            Bucket     : BUCKET_NAME,
            CopySource : `${BUCKET_NAME}/${OLD_KEY}`,
            Key        : NEW_KEY
        };
    
        await s3.copyObject(params).promise();
        await s3.deleteObject({
            Bucket : BUCKET_NAME,
            Key    : OLD_KEY
        }).promise();

        return true;
    }

    delete = async (storageKey: string): Promise<boolean> => {

        const s3 = this.getS3Client();
        const params = {
            Bucket : process.env.RESOURCES_S3_BUCKET_NAME,
            Key    : storageKey
        };

        var result = await s3.deleteObject(params).promise();
        if (result.$response.error) {
            return false;
        }
        return true;
    }
    
    getShareableLink(storageKey: string, durationInMinutes: number): string {

        const s3 = new aws.S3({
            accessKeyId      : process.env.RESOURCES_S3_BUCKET_ACCESS_KEY_ID,
            secretAccessKey  : process.env.RESOURCES_S3_BUCKET_ACCESS_KEY_SECRET,
            signatureVersion : 'v4',
            region           : process.env.RESOURCES_S3_REGION
        });

        const url = s3.getSignedUrl('getObject', {
            Bucket  : process.env.RESOURCES_S3_BUCKET_NAME,
            Key     : storageKey,
            Expires : 60 * durationInMinutes
        });

        return url;
    }

    //#endregion

    //#region Privates

    getS3Client = (): aws.S3 => {
        return new aws.S3({
            accessKeyId     : process.env.RESOURCES_S3_BUCKET_ACCESS_KEY_ID,
            secretAccessKey : process.env.RESOURCES_S3_BUCKET_ACCESS_KEY_SECRET
        });
    }

    //#endregion

}
