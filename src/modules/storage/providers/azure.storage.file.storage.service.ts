import { BlobServiceClient, ContainerClient, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import fs from 'fs';
import { Readable } from 'stream';
import { Logger } from '../../../common/logger';
import { IFileStorageService } from '../interfaces/file.storage.service.interface';

///////////////////////////////////////////////////////////////////////////////////

export class AzureStorageFileStorageService implements IFileStorageService {

    private blobServiceClient: BlobServiceClient;

    private containerClient: ContainerClient;

    // constructor() {
    //     this.initializeAzureClient();
    // }

    //#region Publics

    exists = async (storageKey: string): Promise<string> => {
        try {
            this.initializeAzureClient();
            const blobClient = this.containerClient.getBlobClient(storageKey);
            const exists = await blobClient.exists();

            if (exists) {
                Logger.instance().log(`Blob ${storageKey} exists in Azure Storage`);
                return storageKey;
            }

            Logger.instance().log(`Blob ${storageKey} does not exist in Azure Storage`);
            return null;
        }
        catch (error) {
            Logger.instance().log(JSON.stringify(error, null, 2));
            return null;
        }
    };

    upload = async (storageKey: string, sourceFilePath: string): Promise<string> => {
        try {
            this.initializeAzureClient();
            const fileContent = fs.readFileSync(sourceFilePath);
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, ''); // Remove container name from storage key
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const blockBlobClient = blobClient.getBlockBlobClient();

            await blockBlobClient.upload(fileContent, fileContent.length);

            Logger.instance().log(`Successfully uploaded ${sourceFilePath} as ${storageKey} to Azure Storage`);
            return storageKey;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    uploadStream = async (storageKey: string, stream: Readable): Promise<string> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, ''); // Remove container name from storage key
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const blockBlobClient = blobClient.getBlockBlobClient();

            await blockBlobClient.uploadStream(stream);

            Logger.instance().log(`Successfully uploaded stream as ${storageKey} to Azure Storage`);
            return storageKey;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    download = async (storageKey: string, localFilePath: string): Promise<string> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            const updatedStorageKey = storageKey.replace(`${containerName}/`, ''); // Remove container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const downloadResponse = await blobClient.download();

            const file = fs.createWriteStream(localFilePath);

            return new Promise((resolve, reject) => {
                downloadResponse.readableStreamBody
                    .on('end', () => {
                        const stats = fs.statSync(localFilePath);
                        let count = 0;
                        while (stats.size === 0 && count < 5) {
                            setTimeout(() => {
                                const newStats = fs.statSync(localFilePath);
                                if (newStats.size > 0) {
                                    resolve(localFilePath);
                                }
                            }, 3000);
                            count++;
                        }
                        resolve(localFilePath);
                    })
                    .on('error', (error) => {
                        reject(error);
                    })
                    .pipe(file);
            });
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    rename = async (existingStorageKey: string, newFileName: string): Promise<boolean> => {
        try {
            this.initializeAzureClient();
            const s3Path = existingStorageKey;
            const tokens = s3Path.split('/');
            const existingFileName = tokens[tokens.length - 1];
            const newPath = s3Path.replace(existingFileName, newFileName);

            if (newPath === s3Path) {
                throw new Error('Old and new file identifiers are same!');
            }

            const sourceBlobClient = this.containerClient.getBlobClient(existingStorageKey);
            const destinationBlobClient = this.containerClient.getBlobClient(newPath);

            // Copy the blob to new location
            await destinationBlobClient.beginCopyFromURL(sourceBlobClient.url);

            // Delete the original blob
            await sourceBlobClient.delete();

            Logger.instance().log(`Successfully renamed ${existingStorageKey} to ${newPath}`);
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    delete = async (storageKey: string): Promise<boolean> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            const updatedStorageKey = storageKey.replace(`${containerName}/`, ''); // Remove container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            await blobClient.delete();

            Logger.instance().log(`Successfully deleted ${storageKey} from Azure Storage`);
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    getShareableLink = async (storageKey: string, durationInMinutes: number): Promise<string> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            const updatedStorageKey = storageKey.replace(`${containerName}/`, ''); // Remove container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const sasToken = this.generateSasToken(storageKey, durationInMinutes);

            return `${blobClient.url}?${sasToken}`;
        }
        catch (error) {
            Logger.instance().log(error.message);
            return null;
        }
    };

    //#endregion

    //#region Privates

    private initializeAzureClient = (): void => {
        try {
            // Use connection string if available, otherwise use managed identity
            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

            if (connectionString) {
                this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            } else {
                // Use managed identity or service principal
                const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
                if (!accountName) {
                    throw new Error('AZURE_STORAGE_ACCOUNT_NAME environment variable is required when not using connection string');
                }

                const credential = new DefaultAzureCredential();
                this.blobServiceClient = new BlobServiceClient(
                    `https://${accountName}.blob.core.windows.net`,
                    credential
                );
            }

            Logger.instance().log('Azure Storage client initialized successfully');
        }
        catch (error) {
            Logger.instance().log(`Failed to initialize Azure Storage client: ${error.message}`);
            throw error;
        }
    };

    private generateSasToken = (storageKey: string, durationInMinutes: number): string => {
        try {
            const blobClient = this.containerClient.getBlobClient(storageKey);
            const blockBlobClient = blobClient.getBlockBlobClient();

            const startTime = new Date();
            const expiryTime = new Date(startTime.getTime() + (durationInMinutes * 60 * 1000));

            const permissions = BlobSASPermissions.parse("r"); // Read permission

            const sasToken = generateBlobSASQueryParameters(
                {
                    containerName : this.containerClient.containerName,
                    blobName      : storageKey,
                    permissions   : permissions,
                    startsOn      : startTime,
                    expiresOn     : expiryTime,
                },
                this.blobServiceClient.credential as any // Type assertion for credential
            );

            return sasToken.toString();
        }
        catch (error) {
            Logger.instance().log(`Failed to generate SAS token: ${error.message}`);
            // Fallback to a simple token format
            const startTime = new Date();
            const expiryTime = new Date(startTime.getTime() + (durationInMinutes * 60 * 1000));
            return `sv=2020-08-04&st=${startTime.toISOString()}&se=${expiryTime.toISOString()}&sr=b&sp=r`;
        }
    };

    //#endregion

}
