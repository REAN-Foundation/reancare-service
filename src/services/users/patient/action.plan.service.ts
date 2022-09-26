import { CareplanHandler } from "../../../modules/careplan/careplan.handler";
import { inject, injectable } from "tsyringe";
import { IGoalRepo } from "../../../database/repository.interfaces/users/patient/goal.repo.interface";
import { IHealthPriorityRepo } from "../../../database/repository.interfaces/users/patient/health.priority.repo.interface";
import { ActionPlanDto } from "../../../domain.types/users/patient/action.plan/action.plan.dto";
import { ActionPlanDomainModel } from "../../../domain.types/users/patient/action.plan/action.plan.domain.model";
import { IActionPlanRepo } from "../../../database/repository.interfaces/users/patient/action.plan.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { ApiError } from "../../../common/api.error";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { ActionPlanSearchFilters, ActionPlanSearchResults } from "../../../domain.types/users/patient/action.plan/action.plan.search.types";
import { ICareplanRepo } from "../../../database/repository.interfaces/clinical/careplan.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ActionPlanService {

    _careplanHandler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IGoalRepo') private _goalRepo: IGoalRepo,
        @inject('IHealthPriorityRepo') private _healthPriorityRepo: IHealthPriorityRepo,
        @inject('IActionPlanRepo') private _actionPlanRepo: IActionPlanRepo,
        @inject('ICareplanRepo') private _CareplanRepo: ICareplanRepo,

    ) {}

    create = async (model: ActionPlanDomainModel): Promise<ActionPlanDto> => {
        return await this._actionPlanRepo.create(model);
    };

    getSelectedActionPlans = async (patientUserId: string): Promise<ActionPlanDto[]> => {

        var patient = await this.getPatient(patientUserId);
        if (!patient) {
            throw new Error('Patient does not exist!');
        }

        var actionPlans = await this._actionPlanRepo.getAll(patientUserId);

        if (!actionPlans) {
            throw new ApiError(500, 'Error while fetching action plans for given patient');
        }

        return actionPlans;
    };

    getActionPlans = async (goalId: string): Promise<ActionPlanDto[]> => {
        var goal =  await this._goalRepo.getById(goalId);
        var priority = await this._healthPriorityRepo.getById(goal.HealthPriorityId);

        var actionPlans =  await this._careplanHandler.getActionPlans(priority.PatientUserId,
            priority.ProviderEnrollmentId,
            priority.Provider,priority.HealthPriorityType);

        const actionPlanModels = actionPlans.map(x => {
            var a: ActionPlanDomainModel = {
                PatientUserId        : priority.PatientUserId,
                ProviderEnrollmentId : priority.ProviderEnrollmentId,
                Provider             : priority.Provider,
                ProviderCareplanName : priority.ProviderCareplanName,
                ProviderCareplanCode : priority.ProviderCareplanCode,
                GoalId               : goal.id,
                Title                : x.Title,
            };
            return a;
        });

        return actionPlanModels;
    };

    getById = async (id: uuid): Promise<ActionPlanDto> => {
        return await this._actionPlanRepo.getById(id);
    };

    search = async (filters: ActionPlanSearchFilters): Promise<ActionPlanSearchResults> => {
        return await this._actionPlanRepo.search(filters);
    };

    update = async (id: uuid, actionPlanDomainModel: ActionPlanDomainModel): Promise<ActionPlanDto> => {
        var dto = await this._actionPlanRepo.update(id, actionPlanDomainModel);
        if (dto.Status === 'COMPLETED' && actionPlanDomainModel.Provider) {

            await this._careplanHandler.updateActionPlan(actionPlanDomainModel.PatientUserId,
                actionPlanDomainModel.Provider, actionPlanDomainModel.ProviderCareplanCode,
                actionPlanDomainModel.ProviderEnrollmentId, actionPlanDomainModel.Title);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._actionPlanRepo.delete(id);
    };

    private async getPatient(patientUserId: uuid) {

        var patientDto = await this._patientRepo.getByUserId(patientUserId);

        var user = await this._userRepo.getById(patientDto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        patientDto.User = user;
        return patientDto;
    }

}
