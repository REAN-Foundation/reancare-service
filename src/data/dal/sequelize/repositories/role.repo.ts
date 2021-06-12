import { IRoleRepo } from '../../../repository.interfaces/role.repo.interface';
import { Role } from '../models/role.model';
import { Op, Sequelize } from 'sequelize/types';
import { RoleDTO } from '../../../../data/dtos/role.dto';
import { RoleMapper } from '../mappers/role.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class RoleRepo implements IRoleRepo {
    
    create = async (roleEntity: any): Promise<RoleDTO> => {
        try {
            var entity = {
                RoleName: roleEntity.RoleName,
                Description: roleEntity.Description,
            };
            var role = await Role.create(entity);
            var dto = await RoleMapper.toDTO(role);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: number): Promise<RoleDTO> => {
        try {
            var user = await Role.findByPk(id);
            var dto = await RoleMapper.toDTO(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: number): Promise<boolean> => {
        try {
            await Role.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (name?: string): Promise<RoleDTO[]> => {
        try {
            var filter = { where: {} };
            if (name != null && name != 'undefined') {
                filter = {
                    where: {
                        RoleName: { [Op.like]: '%' + name + '%' },
                    },
                };
            }
            var roles = await Role.findAll(filter);
            var dtos = roles.map((x) => {
                return RoleMapper.toDTO(x);
            });
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
}
