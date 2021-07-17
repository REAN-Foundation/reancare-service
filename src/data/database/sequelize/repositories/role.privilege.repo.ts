import { IRolePrivilegeRepo } from '../../../repository.interfaces/role.privilege.repo.interface';
import Role from '../models/role.model';
import RolePrivilege from '../models/role.privilege.model';
import { Op, Sequelize } from 'sequelize';
import { RoleDto, RolePrivilegeDto } from '../../../domain.types/role.domain.types';
import { RoleMapper } from '../mappers/role.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class RolePrivilegeRepo implements IRolePrivilegeRepo {
    
    create = async (object: any): Promise<RolePrivilegeDto> => {
        try {
            var entity = {
                RoleId: object.RoleId,
                Privilege: object.Privilege,
            };
            var rolePrivilege = await RolePrivilege.create(entity);
            var dto: RolePrivilegeDto = {
                id: rolePrivilege.id,
                RoleId: rolePrivilege.RoleId,
                Privilege: rolePrivilege.Privilege
            }
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<RolePrivilegeDto> => {
        try {
            var rolePrivilege = await RolePrivilege.findByPk(id);
            var dto: RolePrivilegeDto = {
                id: rolePrivilege.id,
                RoleId: rolePrivilege.RoleId,
                Privilege: rolePrivilege.Privilege
            }
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (): Promise<RolePrivilegeDto[]> => {
        try {
            var rolePrivileges = await RolePrivilege.findAll();
            var dtos: RolePrivilegeDto[] = [];
            for(var i = 0; i < rolePrivileges.length; i++)
            {
                var rp = rolePrivileges[i];
                var dto: RolePrivilegeDto = {
                    id: rp.id,
                    RoleId: rp.RoleId,
                    Privilege: rp.Privilege
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
            var rolePrivileges = await RolePrivilege.findAll({
                where: {
                    RoleId: roleId
                }
            });
            var dtos: RolePrivilegeDto[] = [];
            for(var i = 0; i < rolePrivileges.length; i++)
            {
                var rp = rolePrivileges[i];
                var dto: RolePrivilegeDto = {
                    id: rp.id,
                    RoleId: rp.RoleId,
                    Privilege: rp.Privilege
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
