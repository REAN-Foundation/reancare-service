import { ApiError } from '../../common/api.error';
import { Helper } from '../../common/helper';
import { Roles } from '../../domain.types/role/role.types';
import { HealthProfileService } from '../../services/patient/health.profile.service';
import { PatientService } from '../../services/patient/patient.service';
import { AddressService } from '../../services/address.service';
import { PersonService } from '../../services/person.service';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user/user.service';
import { Loader } from '../../startup/loader';
import { PatientDomainModel } from '../../domain.types/patient/patient/patient.domain.model';
import { PatientDetailsDto } from '../../domain.types/patient/patient/patient.dto';
import { UserDetailsDto } from '../../domain.types/user/user/user.dto';
import { PersonDetailsDto } from '../../domain.types/person/person.dto';
import { RoleDto } from '../../domain.types/role/role.dto';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';
import { PatientSearchFilters } from '../../domain.types/patient/patient/patient.search.types';
import { AssessmentDomainModel } from '../../domain.types/clinical/assessment/assessment.domain.model';
import { UserTaskDomainModel } from '../../domain.types/user/user.task/user.task.domain.model';
import { CustomTaskDomainModel } from '../../domain.types/user/custom.task/custom.task.domain.model';
import { UserActionType, UserTaskCategory } from '../../domain.types/user/user.task/user.task.types';
import { ConfigurationManager } from '../../config/configuration.manager';
import { Logger } from '../../common/logger';
import { CustomTaskHelper } from '../helpers/custom.task.helper';
import { AssessmentTemplateService } from '../../services/clinical/assessment/assessment.template.service';
import { AssessmentService } from '../../services/clinical/assessment/assessment.service';
import { UserTaskService } from '../../services/user/user.task.service';

///////////////////////////////////////////////////////////////////////////////////////

export class UserHelper {

    _personService: PersonService = null;

    _addressService: AddressService = null;

    _userService: UserService = null;

    _roleService: RoleService = null;

    _patientService: PatientService = null;

    _patientHealthProfileService: HealthProfileService = null;

    _customTaskHelper: CustomTaskHelper = new CustomTaskHelper();

    _assessmentService: AssessmentService = null;

    _userTaskService: UserTaskService = null;
    
    _assessmentTemplateService: AssessmentTemplateService = null;

    constructor() {
        this._userService = Loader.container.resolve(UserService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._addressService = Loader.container.resolve(AddressService);
        this._patientService = Loader.container.resolve(PatientService);
        this._patientHealthProfileService = Loader.container.resolve(HealthProfileService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
    }

    createPatient = async(createModel: PatientDomainModel): Promise<[PatientDetailsDto, boolean]> => {

        var person: PersonDetailsDto = null;
        var user: UserDetailsDto = null;
        var patient: PatientDetailsDto = null;

        const role: RoleDto = await this._roleService.getByName(Roles.Patient);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Patient + ' does not exist!');
        }

        person = await this._patientService.checkforExistingPersonWithRole(createModel, role.id);
        
        //NOTE: Currently we are not allowing multiple patients to share same phone number,
        // but in future, we will be. For example, family members sharing the same phone number.
        
        if (person) {
            //Person with a patient role exists
            patient = await this._patientService.getByPersonId(person.id);
            if (patient != null) {
                return [ patient, false ];
            }
            //Person exists but patient does not exist, check if the user exists or not!
            user = await this._userService.getByPhoneAndRole(createModel.User.Person.Phone, role.id);
            if (!user) {
                //User with patient role does not exist for this person, create one
                user = await this.createUser(person, createModel, role.id);
                createModel.User.id = user.id;
                createModel.UserId = user.id;
            }
        }
        else {
            person = await this._personService.create(createModel.User.Person);
            if (person == null) {
                throw new ApiError(400, 'Cannot create person!');
            }
            user = await this.createUser(person, createModel, role.id);
            createModel.User.id = user.id;
            createModel.UserId = user.id;
        }
        patient = await this.createPatientWithHealthProfile(createModel, user, person, role.id);
        if (!patient) {
            throw new ApiError(500, `An error has occurred while creating patient!`);
        }
        return [ patient, true ];
    }

    private createPatientWithHealthProfile = async (
        createModel: PatientDomainModel,
        user: UserDetailsDto,
        person: PersonDetailsDto,
        roleId: number) => {

        var patient = await this._patientService.create(createModel);
        if (patient == null) {
            throw new ApiError(400, 'Cannot create patient!');
        }

        const healthProfile = await this._patientHealthProfileService.createDefault(user.id);
        patient.HealthProfile = healthProfile;

        if (person.Phone !== null) {
            var otpDetails = {
                Phone   : person.Phone,
                Email   : null,
                UserId  : null,
                Purpose : 'Login',
                RoleId  : roleId
            };
            await this._userService.generateOtp(otpDetails);
        }
        return patient;
    }

    private async createUser(
        person: PersonDetailsDto,
        createModel: PatientDomainModel,
        roleId: number) {

        createModel.User.Person.id = person.id;
        createModel.PersonId = person.id;
        createModel.User.RoleId = roleId;
        createModel = await this.updateUserDomainModel(createModel);

        var user = await this._userService.create(createModel.User);
        if (!user) {
            throw new ApiError(500, 'Error creating missing user definition!');
        }
        return user;
    }

    private async updateUserDomainModel(createModel: PatientDomainModel): Promise<PatientDomainModel> {

        const userName = await this._userService.generateUserName(
            createModel.User.Person.FirstName,
            createModel.User.Person.LastName
        );

        const displayId = await this._userService.generateUserDisplayId(
            Roles.Patient,
            createModel.User.Person.Phone,
            0 //For now, just allow only one patient with same phone number
        );

        const displayName = Helper.constructPersonDisplayName(
            createModel.User.Person.Prefix,
            createModel.User.Person.FirstName,
            createModel.User.Person.LastName
        );

        createModel.User.Person.DisplayName = displayName;
        createModel.User.UserName = userName;
        createModel.DisplayId = displayId;

        return createModel;
    }

    //#region Custom tasks

    ///////////////////////////////////////////////////////////////
    //TODO: Move this method to separate customization module later
    ///////////////////////////////////////////////////////////////

    public performCustomActions = async (patient: PatientDetailsDto) => {
        await this.createHealthSurveyTask(patient);
        const assessmentTemplateName = 'Quality of Life Questionnaire';
        await this.createAssessmentTask(patient.UserId, assessmentTemplateName);
    };

    public scheduleMonthlyCustomTasks = async (): Promise<void> => {
        const filters: PatientSearchFilters = {};
        const patients = await this._patientService.search(filters);
        const assessmentTemplateName = 'Quality of Life Questionnaire';
        for await (var p of patients.Items) {
            await this.createAssessmentTask(p.UserId, assessmentTemplateName);
        }
    };

    private createAssessmentTask = async (
        patientUserId: string,
        templateName: string): Promise<any> => {

        const systemIdentifier = ConfigurationManager.SystemIdentifier();
        const shouldAddAssessmentTask =
            systemIdentifier.includes('AHA') ||
            systemIdentifier.includes('AHA Helper') ||
            systemIdentifier.includes('HF Helper') ||
            systemIdentifier.includes('Lipid Helper') ||
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'uat';

        if (shouldAddAssessmentTask) {

            const templates = await this._assessmentTemplateService.search({ Title: templateName });
            if (templates.Items.length === 0) {
                return null;
            }
            const templateId: string = templates.Items[0].id;
            const assessmentBody : AssessmentDomainModel = {
                PatientUserId        : patientUserId,
                Title                : templates.Items[0].Title,
                Type                 : templates.Items[0].Type,
                AssessmentTemplateId : templateId,
                ScheduledDateString  : new Date().toISOString()
                    .split('T')[0]
            };

            const assessment = await this._assessmentService.create(assessmentBody);
            const assessmentId = assessment.id;

            const userTaskBody : UserTaskDomainModel = {
                UserId             : patientUserId,
                Task               : templateName,
                Category           : UserTaskCategory.Assessment,
                ActionType         : UserActionType.Careplan,
                ActionId           : assessmentId,
                ScheduledStartTime : new Date(),
                ScheduledEndTime   : TimeHelper.addDuration(new Date(), 9, DurationType.Day),
                IsRecurrent        : false
            };

            const userTask = await this._userTaskService.create(userTaskBody);
            Logger.instance().log(`Action id for Quality of Life Questionnaire is ${userTask.ActionId}`);

            return userTask.ActionId;
        }
    };

    private createHealthSurveyTask = async (patient: PatientDetailsDto) => {

        const systemIdentifier = ConfigurationManager.SystemIdentifier();

        const shouldAddSurveyTask =
            systemIdentifier.includes('AHA') ||
            systemIdentifier.includes('AHA Helper') ||
            systemIdentifier.includes('HF Helper') ||
            systemIdentifier.includes('Lipid Helper') ||
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'uat';

        if (shouldAddSurveyTask) {

            //Add AHA specific tasks, events and handlers here...
            const userId = patient.User.id;

            //Adding survey task for AHA patients
            const domainModel: CustomTaskDomainModel = {
                UserId      : userId,
                Task        : "Survey",
                Description : "Take a survey to help us understand you better!",
                Category    : UserTaskCategory.Custom,
                Details     : {
                    Link : "https://americanheart.co1.qualtrics.com/jfe/form/SV_b1anZr9DUmEOsce",
                },
                ScheduledStartTime : new Date(),
                ScheduledEndTime   : TimeHelper.addDuration(new Date(), 75, DurationType.Day)
            };

            const task = await this._customTaskHelper.createCustomTask(domainModel);
            if (task == null) {
                Logger.instance().log('Unable to create AHA survey task!');
            }
        }
    };

    //#endregion
    
}
