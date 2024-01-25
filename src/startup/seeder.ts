/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { UserHelper } from "../api/users/user.helper";
import { inject, injectable } from "tsyringe";
import * as SeededDrugs from '../../seed.data/drugs.seed.json';
import * as SeededKnowledgeNuggets from '../../seed.data/knowledge.nuggets.seed.json';
import * as SeededAssessmentTemplates from '../../seed.data/symptom.assessment.templates.json';
import * as SeededSymptomTypes from '../../seed.data/symptom.types.json';
import * as SeededNutritionQuestionnaire from '../../seed.data/nutrition.questionnaire.json';
import * as SeededLabRecordTypes from '../../seed.data/lab.record.types.seed.json';
import { Helper } from "../common/helper";
import { Logger } from "../common/logger";
import { IDrugRepo } from "../database/repository.interfaces/clinical/medication/drug.repo.interface";
import { IMedicationStockImageRepo } from "../database/repository.interfaces/clinical/medication/medication.stock.image.repo.interface";
import { ISymptomAssessmentTemplateRepo } from "../database/repository.interfaces/clinical/symptom/symptom.assessment.template.repo.interface";
import { ISymptomTypeRepo } from "../database/repository.interfaces/clinical/symptom/symptom.type.repo.interface";
import { IKnowledgeNuggetRepo } from "../database/repository.interfaces/educational/knowledge.nugget.repo.interface";
import { IHealthPriorityRepo } from "../database/repository.interfaces/users/patient/health.priority.repo.interface";
import { DrugDomainModel } from "../domain.types/clinical/medication/drug/drug.domain.model";
import { MedicationStockImageDomainModel } from "../domain.types/clinical/medication/medication.stock.image/medication.stock.image.domain.model";
import { SymptomAssessmentTemplateDomainModel } from "../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model";
import { SymptomTypeDomainModel } from "../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model";
import { SymptomTypeSearchFilters } from "../domain.types/clinical/symptom/symptom.type/symptom.type.search.types";
import { KnowledgeNuggetDomainModel } from "../domain.types/educational/knowledge.nugget/knowledge.nugget.domain.model";
import { HealthPriorityTypeDomainModel } from "../domain.types/users/patient/health.priority.type/health.priority.type.domain.model";
import { HealthPriorityTypeList } from "../domain.types/users/patient/health.priority.type/health.priority.types";
import { ClientAppService } from "../services/client.apps/client.app.service";
import { DrugService } from "../services/clinical/medication/drug.service";
import { SymptomAssessmentTemplateService } from "../services/clinical/symptom/symptom.assessment.template.service";
import { SymptomTypeService } from "../services/clinical/symptom/symptom.type.service";
import { KnowledgeNuggetService } from "../services/educational/knowledge.nugget.service";
import { FileResourceService } from "../services/general/file.resource.service";
import { HealthPriorityService } from "../services/users/patient/health.priority.service";
import { HealthProfileService } from "../services/users/patient/health.profile.service";
import { PatientService } from "../services/users/patient/patient.service";
import { PersonService } from "../services/person/person.service";
import { RoleService } from "../services/role/role.service";
import { UserService } from "../services/users/user/user.service";
import { FoodConsumptionService } from "../services/wellness/nutrition/food.consumption.service";
import { LabRecordService } from "../services/clinical/lab.record/lab.record.service";
import { LabRecordTypeDomainModel } from "../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.domain.model";
import { IFoodConsumptionRepo }
    from "../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { NutritionQuestionnaireDomainModel }
    from "../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.domain.model";
import { HealthSystemService } from "../services/hospitals/health.system.service";
import { HospitalService } from "../services/hospitals/hospital.service";
import { Injector } from "./injector";
import { TenantService } from "../services/tenant/tenant.service";
import { RolePrivilegeService } from "../services/role/role.privilege.service";

//////////////////////////////////////////////////////////////////////////////

@injectable()
export class Seeder {

    _tenantService = Injector.Container.resolve(TenantService);

    _clientAppService: ClientAppService = Injector.Container.resolve(ClientAppService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _rolePrivilegeService: RolePrivilegeService = Injector.Container.resolve(RolePrivilegeService);

    _healthSystemService: HealthSystemService = Injector.Container.resolve(HealthSystemService);

    _hospitalService: HospitalService = Injector.Container.resolve(HospitalService);

    _patientHealthProfileService: HealthProfileService = Injector.Container.resolve(HealthProfileService);

    _symptomTypeService: SymptomTypeService = Injector.Container.resolve(SymptomTypeService);

    _symptomAssessmentTemplateService: SymptomAssessmentTemplateService = Injector.Container.resolve(SymptomAssessmentTemplateService);

    _fileResourceService: FileResourceService = Injector.Container.resolve(FileResourceService);

    _knowledgeNuggetsService: KnowledgeNuggetService = Injector.Container.resolve(KnowledgeNuggetService);

    _drugService: DrugService = Injector.Container.resolve(DrugService);

    _healthPriorityService: HealthPriorityService = Injector.Container.resolve(HealthPriorityService);

    _labRecordService: LabRecordService = Injector.Container.resolve(LabRecordService);

    _foodConsumptionService: FoodConsumptionService = Injector.Container.resolve(FoodConsumptionService);

    _userHelper = new UserHelper();

    constructor(
        @inject('IMedicationStockImageRepo') private _medicationStockImageRepo: IMedicationStockImageRepo,
        @inject('ISymptomTypeRepo') private _symptomTypeRepo: ISymptomTypeRepo,
        @inject('ISymptomAssessmentTemplateRepo') private _symptomAssessmentTemplateRepo: ISymptomAssessmentTemplateRepo,
        @inject('IKnowledgeNuggetRepo') private _knowledgeNuggetRepo: IKnowledgeNuggetRepo,
        @inject('IDrugRepo') private _drugRepo: IDrugRepo,
        @inject('IHealthPriorityRepo') private _healthPriorityRepo: IHealthPriorityRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
    ) {
    }

    public init = async (): Promise<void> => {
        try {
            await this.createTempFolders();
            await this._tenantService.seedDefaultTenant();
            await this._userService.checkUsersWithoutTenants();
            await this._roleService.seedDefaultRoles();
            await this._rolePrivilegeService.seedRolePrivileges();
            await this._clientAppService.seedDefaultClients();
            await this._userService.seedSystemAdmin();
            await this.seedMedicationStockImages();
            await this.seedSymptomTypes();
            await this.seedSymptomAsseessmentTemplates();
            await this.seedKnowledgeNuggets();
            await this.seedDrugs();
            await this.seedHealthPriorityTypes();
            await this.seedLabReportTypes();
            await this.seedNutritionQuestionnaire();
            await this._healthSystemService.seedHealthSystemsAndHospitals();

        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private createTempFolders = async () => {
        await Helper.createTempDownloadFolder();
        await Helper.createTempUploadFolder();
    };

    private seedMedicationStockImages = async () => {

        var images = await this._medicationStockImageRepo.getAll();
        if (images.length > 0) {
            return;
        }

        var cloudStoragePath = 'assets/images/stock.medication.images/';
        var sourceFilePath = path.join(process.cwd(), "./assets/images/stock.medication.images/");
        var files = fs.readdirSync(sourceFilePath);
        var imageFiles = files.filter((f) => {
            return path.extname(f).toLowerCase() === '.png';
        });

        for await (const fileName of imageFiles) {

            var sourceFileLocation = path.join(sourceFilePath, fileName);
            var storageFileLocation = cloudStoragePath + fileName;

            var uploaded = await this._fileResourceService.uploadLocal(
                sourceFileLocation,
                storageFileLocation,
                true);

            var domainModel: MedicationStockImageDomainModel = {
                Code       : fileName.replace('.png', ''),
                FileName   : fileName,
                ResourceId : uploaded.DefaultVersion.ResourceId,
                PublicUrl  : uploaded.DefaultVersion.Url
            };

            var medStockImage = await this._medicationStockImageRepo.create(domainModel);
            if (!medStockImage) {
                Logger.instance().log('Error occurred while seeding medication stock images!');
            }
        }
    };

    public seedSymptomTypes = async () => {

        const count = await this._symptomTypeRepo.totalCount();
        if (count > 0) {
            Logger.instance().log("Symptom types have already been seeded!");
            return;
        }

        Logger.instance().log('Seeding symptom types...');

        const arr = SeededSymptomTypes['default'];

        for (let i = 0; i < arr.length; i++) {
            var symptomType = arr[i];
            var tokens = symptomType['Tags'] ? symptomType['Tags'].split(',') : [];
            var imageName = symptomType['Image'] ? symptomType['Image'] : null;
            var resourceId = await this.getImageResourceIdForSymptomType(imageName);

            const model: SymptomTypeDomainModel = {
                Symptom         : symptomType['Symptom'],
                Description     : symptomType['Description'],
                Tags            : tokens,
                ImageResourceId : resourceId
            };
            await this._symptomTypeService.create(model);
        }
    };

    getImageResourceIdForSymptomType = async (fileName) => {
        if (fileName === null) {
            return null;
        }
        var storagePath = 'assets/images/symptom.images/' + fileName;
        var sourceFileLocation = path.join(process.cwd(), "./assets/images/symptom.images/", fileName);

        var uploaded = await this._fileResourceService.uploadLocal(
            sourceFileLocation,
            storagePath,
            true);

        return uploaded.id;
    };

    getImageResourceIdForNutritionQuestion = async (fileName) => {
        if (fileName === null) {
            return null;
        }
        var storagePath = 'assets/images/nutrition.images/' + fileName;
        var sourceFileLocation = path.join(process.cwd(), "./assets/images/nutrition.images/", fileName);

        var uploaded = await this._fileResourceService.uploadLocal(
            sourceFileLocation,
            storagePath,
            true);

        return uploaded.id;
    };

    public seedSymptomAsseessmentTemplates = async () => {

        const count = await this._symptomAssessmentTemplateRepo.totalCount();
        if (count > 0) {
            Logger.instance().log("Symptom based assessment templates have already been seeded!");
            return;
        }
        Logger.instance().log('Seeding symptom assessment templates...');

        const arr = SeededAssessmentTemplates['default'];

        for (let i = 0; i < arr.length; i++) {
            var t = arr[i];
            var tokens = t['Tags'] ? t['Tags'].split(',').map(x => x.trim()) : [];
            const model: SymptomAssessmentTemplateDomainModel = {
                Title       : t['Title'],
                Description : t['Description'],
                Tags        : tokens,
            };
            var template = await this._symptomAssessmentTemplateService.create(model);

            if (template.Title === 'Heart Failure Symptoms Assessment') {
                var filters: SymptomTypeSearchFilters = {
                    Tag : 'Heart failure'
                };
                var searchResults = await this._symptomTypeService.search(filters);
                var symptomTypeIds = searchResults.Items.map(x => x.id);
                if (symptomTypeIds.length > 0) {
                    await this._symptomAssessmentTemplateService.addSymptomTypes(template.id, symptomTypeIds);
                }
            }
        }
    };

    public seedKnowledgeNuggets = async () => {
        Logger.instance().log('Seeding knowledge nuggets...');

        const arr = SeededKnowledgeNuggets['default'];

        for (let i = 0; i < arr.length; i++) {

            var t = arr[i];
            const filters = {
                TopicName : t['TopicName']
            };
            const existingRecord = await this._knowledgeNuggetRepo.search(filters);
            if (existingRecord.Items.length > 0) {
                Logger.instance().log(`Knowledge nugget has already been exist ${t['TopicName']}!`);
                continue;
            }

            var tokens = t['Tags'] ? t['Tags'].split(',') : [];
            const temp = t['AdditionalResources'];

            var additionalResources: string[] = temp.map(x => x);

            const model: KnowledgeNuggetDomainModel = {
                TopicName           : t['TopicName'],
                BriefInformation    : t['BriefInformation'],
                DetailedInformation : t['DetailedInformation'],
                Tags                : tokens,
                AdditionalResources : additionalResources
            };
            await this._knowledgeNuggetsService.create(model);
        }
    };

    public seedDrugs = async () => {

        const count = await this._drugRepo.totalCount();
        if (count > 0) {
            Logger.instance().log("Drugs have already been seeded!");
            return;
        }

        Logger.instance().log('Seeding drugs...');

        const arr = SeededDrugs['default'];

        for (let i = 0; i < arr.length; i++) {
            var drugName = arr[i];
            const model: DrugDomainModel = {
                DrugName : drugName
            };
            await this._drugService.create(model);
        }
    };

    public seedHealthPriorityTypes = async () => {

        const count = await this._healthPriorityRepo.totalTypesCount();
        if (count > 0) {
            Logger.instance().log("Health priority types have already been seeded!");
            return;
        }

        Logger.instance().log('Seeding health priority types...');

        for (const priorityType of HealthPriorityTypeList) {
            const model: HealthPriorityTypeDomainModel = {
                Type : priorityType,
                Tags : ["HeartFailure"]
            };
            await this._healthPriorityService.createType(model);
        }
    };

    public seedLabReportTypes = async () => {

        Logger.instance().log('Seeding lab record types...');

        const arr = SeededLabRecordTypes['default'];
        //console.log(JSON.stringify(arr, null, 2));

        for (let i = 0; i < arr.length; i++) {
            var c = arr[i];

            const filters = {
                DisplayName : c['DisplayName']
            };

            const existingRecord = await this._labRecordService.searchType(filters);
            //console.log(JSON.stringify(existingRecord, null, 2));
            if (existingRecord.Items.length > 0) {
                Logger.instance().log(`Lab record type has already been exist ${c['DisplayName']}!`);
                continue;
            }

            const model: LabRecordTypeDomainModel = {
                TypeName       : c['TypeName'],
                DisplayName    : c['DisplayName'],
                SnowmedCode    : c['SnowmedCode'],
                LoincCode      : c['LoincCode'],
                NormalRangeMin : c['NormalRangeMin'],
                NormalRangeMax : c['NormalRangeMax'],
                Unit           : c['Unit'],
            };

            var recordType = await this._labRecordService.createType(model);
            var str = JSON.stringify(recordType, null, '  ');
            Logger.instance().log(str);

        }
    };

    public seedNutritionQuestionnaire = async () => {

        const count = await this._foodConsumptionRepo.totalCount();
        if (count > 0) {
            Logger.instance().log("Nutrition questionnaire have already been seeded!");
            return;
        }

        Logger.instance().log('Seeding nutrition questionnaire...');

        const arr = SeededNutritionQuestionnaire['default'];

        for (let i = 0; i < arr.length; i++) {

            var t = arr[i];
            const tokens = t['Tags'];
            const temp = t['AssociatedFoodTypes'];
            var imageName = t['Image'] ? t['Image'] : null;
            var resourceId = await this.getImageResourceIdForNutritionQuestion(imageName);

            var tags: string[] = tokens.map(x => x);
            var associatedFoodTypes: string[] = temp.map(x => x);

            const model: NutritionQuestionnaireDomainModel = {
                Question            : t['Question'],
                QuestionType        : t['QuestionType'],
                ServingUnit         : t['ServingUnit'],
                Tags                : tags,
                AssociatedFoodTypes : associatedFoodTypes,
                ImageResourceId     : resourceId,
                QuestionInfo        : t['QuestionInfo']
            };
            await this._foodConsumptionService.createNutritionQuestionnaire(model);
        }
    };

}
