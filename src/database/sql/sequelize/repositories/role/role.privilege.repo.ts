import { IRolePrivilegeRepo } from '../../../../repository.interfaces/role/role.privilege.repo.interface';
import RolePermission from '../../models/role/role.permissions.model';
import { RolePrivilegeDto } from '../../../../../domain.types/role/role.privilege.dto';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class RolePrivilegeRepo implements IRolePrivilegeRepo {

    create = async (object: any): Promise<RolePrivilegeDto> => {
        try {
            const entity = {
                RoleId    : object.RoleId,
                RoleName  : object.RoleName,
                Privilege : object.Privilege,
                Scope     : object.Scope,
                Enabled   : object.Enabled,
            };
            const rp = await RolePermission.create(entity);
            const dto: RolePrivilegeDto = {
                id        : rp.id,
                RoleId    : rp.RoleId,
                RoleName  : rp.RoleName,
                Privilege : rp.Privilege,
                Scope     : rp.Scope,
                Enabled   : rp.Enabled,
            };
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<RolePrivilegeDto> => {
        try {
            const rp = await RolePermission.findByPk(id);
            const dto: RolePrivilegeDto = {
                id        : rp.id,
                RoleId    : rp.RoleId,
                RoleName  : rp.RoleName,
                Privilege : rp.Privilege,
                Scope     : rp.Scope,
                Enabled   : rp.Enabled,
            };
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    enable = async (id: string, enable: boolean): Promise<RolePrivilegeDto> => {
        try {
            const rp = await RolePermission.findByPk(id);
            rp.Enabled = enable;
            await rp.save();
            const dto: RolePrivilegeDto = {
                id        : rp.id,
                RoleId    : rp.RoleId,
                RoleName  : rp.RoleName,
                Privilege : rp.Privilege,
                Scope     : rp.Scope,
                Enabled   : rp.Enabled,
            };
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (): Promise<RolePrivilegeDto[]> => {
        try {
            const rolePrivileges = await RolePermission.findAll();
            const dtos: RolePrivilegeDto[] = [];
            for (const rp of rolePrivileges) {
                const dto: RolePrivilegeDto = {
                    id        : rp.id,
                    RoleId    : rp.RoleId,
                    RoleName  : rp.RoleName,
                    Privilege : rp.Privilege,
                    Scope     : rp.Scope,
                    Enabled   : rp.Enabled,
                };
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
            const rolePrivileges = await RolePermission.findAll({
                where : {
                    RoleId : roleId,
                },
            });
            const dtos: RolePrivilegeDto[] = [];
            for (const rp of rolePrivileges) {
                const dto: RolePrivilegeDto = {
                    id        : rp.id,
                    RoleId    : rp.RoleId,
                    RoleName  : rp.RoleName,
                    Privilege : rp.Privilege,
                    Scope     : rp.Scope,
                    Enabled   : rp.Enabled,
                };
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    hasPrivilegeForRole = async (roleId: number, privilege: string): Promise<boolean> => {
        try {
            const rolePrivileges = await RolePermission.findAll({
                where : {
                    RoleId    : roleId,
                    Privilege : { [Op.like]: '%' + privilege + '%' },
                },
            });
            if (rolePrivileges.length > 0) {
                const rp = rolePrivileges[0];
                return rp.Enabled;
            }
            return false;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getRolePrivilege = async (roleId: number, privilege: string): Promise<RolePrivilegeDto> => {
        try {
            const rp = await RolePermission.findOne({
                where : {
                    RoleId    : roleId,
                    Privilege : { [Op.like]: '%' + privilege + '%' },
                },
            });
            if (rp == null) {
                return null;
            }
            const dto: RolePrivilegeDto = {
                id        : rp.id,
                RoleId    : rp.RoleId,
                RoleName  : rp.RoleName,
                Privilege : rp.Privilege,
                Scope     : rp.Scope,
                Enabled   : rp.Enabled,
            };
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await RolePermission.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
