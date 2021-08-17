
import { IPersonRoleRepo } from "../../repository.interfaces/person.role.repo.interface";
import PersonRole from '../models/person.role.model';
import { PersonRoleDto } from "../../../domain.types/role.domain.types";
import { PersonRoleMapper } from '../mappers/person.role.mapper';
import { Logger } from "../../../common/logger";
import { ApiError } from "../../../common/api.error";
import { RoleRepo } from "./role.repo";

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
    }

    addPersonRole = async (personId: string, roleId: number): Promise<PersonRoleDto> => {
        try {
            const entity = {
                PersonId : personId,
                RoleId   : roleId,
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
    }

    getPersonCountByRoles = async (): Promise<any> => {
        try {
            const personCountForRoles = {};
            const roleRepo = new RoleRepo();
            const allRoles = await roleRepo.search();
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
    }

}
