
import { IRoleRepo } from "../../../repository.interfaces/role.repo.interface";
import { Role } from '../models/role.model';
import { Sequelize } from "sequelize/types";
import { RoleDTO } from "../../../../data/dtos/role.dto";


export class RoleRepo implements IRoleRepo {

    create(entity: any): Promise<RoleDTO> {
        throw new Error("Method not implemented.");
    }
    getById(id: number): Promise<RoleDTO> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    search(name?: string): Promise<RoleDTO[]> {
        throw new Error("Method not implemented.");
    }
}
