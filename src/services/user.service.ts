
import { User } from '../database/sequelize/models/user.model';


export class UserService {

    constructor(){}

    public search = async(filters: any): Promise<any[]> => {

        var users = [];

        return users;
    }

    public getById = async(id:string): Promise<any> => {

        return true;
    }

    public loginWithPassword = async(loginObject: any): Promise<any> => {

        return true;
    }

    public resetPassword = async (object: any): Promise<any> => {

        return true;
    }

    public generateOtp = async(obj: any): Promise<boolean> => {

        return true;
    }

    public loginWithOtp = async(phone:string, email:string, userId:string): Promise<boolean> => {

        return true;
    }

    public addUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

        return true;
    }

    public deleteUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

        return true;
    }

    public getUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

        return true;
    }
}
