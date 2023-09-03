import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import User from '../../models/users/user/user.model';
import Person from '../../models/person/person.model';
import Cohort from '../../models/community/cohorts/cohort.model';
import CohortUser from '../../models/community/cohorts/cohort.user.model';
import { ICohortRepo } from '../../../../repository.interfaces/community/cohort.repo.interface';
import {
    CohortCreateDomainModel,
    CohortSearchResults,
    CohortUpdateDomainModel,
    CohortDto,
} from '../../../../../domain.types/community/cohorts/cohort.domain.model';
import { CohortMapper } from '../../mappers/community/cohort.mapper';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////

export class CohortRepo implements ICohortRepo {

    public create = async (model: CohortCreateDomainModel): Promise<CohortDto> => {
        try {
            const entity = {
                TenantId    : model.TenantId,
                Name        : model.Name,
                Description : model.Description,
                ImageUrl    : model.ImageUrl,
                OwnerId     : model.OwnerUserId,
            };
            const cohort = await Cohort.create(entity);
            return CohortMapper.toDto(cohort);
        } catch (error) {
            throw new Error(`Failed to create user cohort: ${error.message}`);
        }
    };

    public search = async (filters: any): Promise<CohortSearchResults> => {
        try {
            const search = { where: {} };
            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.UserId != null) {
                search.where['UserId'] = filters.UserId;
            }
            if (filters.TenantId != null) {
                search.where['TenantId'] = filters.TenantId;
            }

            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await Cohort.findAndCountAll(search);
            const dtos = foundResults.rows.map((cohort) => CohortMapper.toDto(cohort));
            const searchResults: CohortSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };
            return searchResults;
        } catch (error) {
            throw new Error(`Failed to retrieve user cohorts: ${error.message}`);
        }
    };

    public getById = async (id: uuid): Promise<CohortDto> => {
        try {
            const cohort = await Cohort.findByPk(id);
            if (cohort == null) {
                return null;
            }
            return CohortMapper.toDto(cohort);
        } catch (error) {
            throw new Error(`Failed to retrieve user cohort by Id: ${error.message}`);
        }
    };

    public update = async (id: uuid, model: CohortUpdateDomainModel): Promise<CohortDto> => {
        try {
            const cohort = await Cohort.findByPk(id);
            if (cohort == null) {
                return null;
            }
            const entity = {
                TenantId    : model.TenantId ?? cohort.TenantId,
                Name        : model.Name ?? cohort.Name,
                Description : model.Description ?? cohort.Description,
                ImageUrl    : model.ImageUrl ?? cohort.ImageUrl,
            };
            await cohort.update(entity);
            return CohortMapper.toDto(cohort);
        } catch (error) {
            throw new Error(`Failed to update user cohort: ${error.message}`);
        }
    };

    public delete = async (id: uuid): Promise<boolean> => {
        try {
            const cohort = await Cohort.findByPk(id);
            if (cohort == null) {
                return false;
            }
            const result = await Cohort.destroy( {
                where : {
                    id : cohort.id,
                }
            });
            return result === 1;
        } catch (error) {
            throw new Error(`Failed to delete user cohort: ${error.message}`);
        }
    };

    public addUserToCohort = async (cohortId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const cohort = await Cohort.findByPk(cohortId);
            if (cohort == null) {
                throw new Error('Cohort not found');
            }
            const user = await User.findByPk(userId);
            if (user == null) {
                throw new Error('User not found');
            }
            const exists = await CohortUser.findOne({
                where : {
                    UserId   : userId,
                    CohortId : cohort.id,
                }
            });
            if (exists != null) {
                throw new Error('User already exists in cohort');
            }
            const cohortMember = await CohortUser.create({
                UserId   : userId,
                CohortId : cohort.id,
                IsAdmin  : false,
            });
            return cohortMember != null;
        } catch (error) {
            throw new Error(`Failed to add user to cohort: ${error.message}`);
        }
    };

    public removeUserFromCohort = async (cohortId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const cohort = await Cohort.findByPk(cohortId);
            if (cohort == null) {
                throw new Error('Cohort not found');
            }
            const user = await CohortUser.findOne({
                where : {
                    UserId   : userId,
                    CohortId : cohort.id,
                }
            });
            if (user == null) {
                throw new Error('User not found in cohort');
            }
            const result = await CohortUser.destroy({
                where : {
                    UserId   : userId,
                    CohortId : cohort.id,
                }
            });
            return result === 1;
        }
        catch (error) {
            throw new Error(`Failed to remove user from cohort: ${error.message}`);
        }
    };

    public getCohortUsers = async (cohortId: uuid): Promise<any[]> => {
        try {
            const cohort = await Cohort.findByPk(cohortId);
            if (cohort == null) {
                throw new Error('Cohort not found');
            }
            const users = await CohortUser.findAll({
                where : {
                    CohortId : cohort.id,
                },
                include : [
                    {
                        model   : User,
                        as      : 'User',
                        include : [
                            {
                                model : Person,
                                as    : 'Person',
                            }
                        ]
                    }
                ]
            });

            const dtos = users.map((member) => {
                return {
                    UserId   : member.UserId,
                    CohortId : member.CohortId,
                    User     : {
                        id       : member.User.id,
                        UserName : member.User.UserName,
                        Person   : {
                            id                : member.User.Person.id,
                            FirstName         : member.User.Person.FirstName,
                            LastName          : member.User.Person.LastName,
                            Phone             : member.User.Person.Phone,
                            Email             : member.User.Person.Email,
                            ProfilePictureUrl : member.User.Person.ImageResourceId,
                        }
                    },
                    CreatedAt : member.createdAt,
                    UpdatedAt : member.updatedAt,
                };
            });
            return dtos;
        } catch (error) {
            throw new Error(`Failed to get cohort users: ${error.message}`);
        }
    };

    public getCohortStats = async (cohortId: uuid): Promise<any> => {
        try {
            const cohort = await Cohort.findByPk(cohortId);
            if (cohort == null) {
                throw new Error('Cohort not found');
            }
            const users = await CohortUser.findAndCountAll({
                where : {
                    CohortId : cohort.id,
                }
            });
            const stats = {
                CohortId : cohort.id,
                Total    : users.count,
            };
            return stats;
        } catch (error) {
            throw new Error(`Failed to get cohort admins: ${error.message}`);
        }
    };

    public getCohortsForTenant = async (tenantId: string): Promise<CohortDto[]> => {
        try {
            const cohorts = await Cohort.findAll({
                where : {
                    TenantId : tenantId,
                }
            });
            const dtos = cohorts.map((cohort) => CohortMapper.toDto(cohort));
            return dtos;
        } catch (error) {
            throw new Error(`Failed to get cohorts for tenant: ${error.message}`);
        }
    };

    public removeUserFromAllCohorts = async (userId: string): Promise<boolean> => {
        try {
            const result = await CohortUser.destroy({
                where : {
                    UserId : userId,
                }
            });
            return result > 0;
        }
        catch (error) {
            throw new Error(`Failed to remove user from all cohorts: ${error.message}`);
        }
    };

}
