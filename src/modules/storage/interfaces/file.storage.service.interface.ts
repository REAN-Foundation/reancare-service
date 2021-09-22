
export interface IFileStorageService {

    upload(storageKey: string, sourceFilePath: string): Promise<string>;
    
    download(storageKey: string, localFolder: string): Promise<string>;

    rename(existingStorageKey: string, newFileName: string): Promise<boolean>;

    getShareableLink(storageKey: string, durationInMinutes: number): string;

    delete(storageKey: string): Promise<boolean>;
}
