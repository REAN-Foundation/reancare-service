
import { IPersonRoleRepo } from "../../../../repository.interfaces/person/person.role.repo.interface";
import PersonRole from '../../models/person/person.role.model';
import Role from "../../models/role/role.model";
import { PersonRoleDto } from "../../../../../domain.types/role/person.role.dto";
import { PersonRoleMapper } from '../../mappers/person/person.role.mapper';
import { Logger } from "../../../../../common/logger";
import { ApiError } from "../../../../../common/api.error";

///////////////////////////////////////////////////////////////////////

export class PersonRoleRepo implements IPersonRoleRepo {

    getPersonRoles = async (personId: string): Promise<PersonRoleDto[]> => {
        try {
            const personRoles = await PersonRole.findAll({ where: { PersonId: personId } });
            const dtos: PersonRoleDto[] = [];
            for await (const r of personRoles) {
                const dto = await PersonRoleMapper.toDto(r);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addPersonRole = async (personId: string, roleId: number): Promise<PersonRoleDto> => {
        try {
            const role = await Role.findByPk(roleId);
            if (!role){
                throw new Error('Role does not exist.');
            }
            const entity = {
                PersonId : personId,
                RoleId   : roleId,
                RoleName : role.RoleName
            };

            const personRole = await PersonRole.create(entity);
            const dto = await PersonRoleMapper.toDto(personRole);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    removePersonRole = async (personId: string): Promise<boolean> => {
        try {
            await PersonRole.destroy({ where: { PersonId: personId } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPersonCountByRoles = async (): Promise<any> => {
        try {
            const personCountForRoles = {};
            const allRoles = await Role.findAll();
            for await (const r of allRoles) {
                const roleCount = await PersonRole.count({
                    where : {
                        RoleId : r.id,
                    },
                });
                personCountForRoles[r.RoleName] = roleCount;
            }
            return personCountForRoles;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
