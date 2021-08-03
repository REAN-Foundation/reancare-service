import { IRolePrivilegeRepo } from '../../../repository.interfaces/role.privilege.repo.interface';
import RolePrivilege from '../models/role.privilege.model';
import { RolePrivilegeDto } from '../../../domain.types/role.domain.types';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class RolePrivilegeRepo implements IRolePrivilegeRepo {
    
    create = async (object: any): Promise<RolePrivilegeDto> => {
        try {
            const entity = {
                RoleId    : object.RoleId,
                Privilege : object.Privilege,
            };
            const rolePrivilege = await RolePrivilege.create(entity);
            const dto: RolePrivilegeDto = {
                id        : rolePrivilege.id,
                RoleId    : rolePrivilege.RoleId,
                Privilege : rolePrivilege.Privilege
            }
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<RolePrivilegeDto> => {
        try {
            const rolePrivilege = await RolePrivilege.findByPk(id);
            const dto: RolePrivilegeDto = {
                id        : rolePrivilege.id,
                RoleId    : rolePrivilege.RoleId,
                Privilege : rolePrivilege.Privilege
            }
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (): Promise<RolePrivilegeDto[]> => {
        try {
            const rolePrivileges = await RolePrivilege.findAll();
            const dtos: RolePrivilegeDto[] = [];
            for (let i = 0; i < rolePrivileges.length; i++)
            {
                const rp = rolePrivileges[i];
                const dto: RolePrivilegeDto = {
                    id        : rp.id,
                    RoleId    : rp.RoleId,
                    Privilege : rp.Privilege
                }
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPrivilegesForRole = async (roleId: number): Promise<RolePrivilegeDto[]> => {
        try {
            const rolePrivileges = await RolePrivilege.findAll({
                where : {
                    RoleId : roleId
                }
            });
            const dtos: RolePrivilegeDto[] = [];
            for (let i = 0; i < rolePrivileges.length; i++)
            {
                const rp = rolePrivileges[i];
                const dto: RolePrivilegeDto = {
                    id        : rp.id,
                    RoleId    : rp.RoleId,
                    Privilege : rp.Privilege
                }
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await RolePrivilege.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
