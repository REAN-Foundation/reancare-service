
import { IUserRepo } from '../data/repository.interfaces/user.repo.interface';
import { IUserRoleRepo } from '../data/repository.interfaces/user.role.repo.interface';
import { IRoleRepo } from '../data/repository.interfaces/role.repo.interface';

export class UserService {

    _userRepo: IUserRepo = null;
    _userRoleRepo: IUserRoleRepo = null;


    constructor(){}

    public search = async(filters: any): Promise<any[]> => {

        var users = [];

        return users;
    }

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

    public generateOtp = async(obj: any): Promise<any> => {

        return true;
    }

    public loginWithOtp = async(loginObject:any): Promise<any> => {

        return true;
    }

    // public addUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

    //     return true;
    // }

    // public deleteUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

    //     return true;
    // }

    // public getUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

    //     return true;
    // }
}
