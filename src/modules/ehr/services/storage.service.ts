import { IStorageService } from "../interfaces/storage.service.interface";
import { injectable, inject } from "tsyringe";

////////////////////////////////////////////////////////////////////////

@injectable()
export class StorageService {

    constructor(@inject('IStorageService') private _service: IStorageService) {}

    init = async (): Promise<boolean> => {
        return await this._service.init();
    };

}
