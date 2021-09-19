
export interface IFileStorageService {

    upload(storageKey: string, localFilePath?: string): Promise<string>;
    
    download(storageKey: string, localFolder?: string): Promise<string>;

    rename(existingStorageKey: string, newStorageKey: string): Promise<boolean>;

    delete(storageKey: string): Promise<boolean>;
}
