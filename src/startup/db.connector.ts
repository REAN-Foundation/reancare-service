
/// <reference path = "../interfaces/patient.store.interface.ts" />  
import { IStorageService } from "../interfaces/storage.service.interface";
import { injectable, inject } from "tsyringe";

////////////////////////////////////////////////////////////////////////

@injectable()
export class DbConnector {

    private static _instance: DbConnector = null;

    private constructor() {
    }

    public static instance() {
        return this._instance || (this._instance = new this());
    }
    
    public init = async () => {
        return new Promise((resolve, reject) => {
            try {


                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}
