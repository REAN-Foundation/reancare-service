import { inject, injectable } from 'tsyringe';
import { Logger } from '../../../common/logger';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { IHealthProfileRepo } from '../../../database/repository.interfaces/users/patient/health.profile.repo.interface';
import {
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    CAssessmentQuestionNode,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    BooleanQueryAnswer,
    SkipQueryAnswer
} from '../../../domain.types/clinical/assessment/assessment.types';
import { FoodConsumptionDomainModel } from '../../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model';
import { IFoodConsumptionRepo } from '../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface';
import { WaterConsumptionDomainModel } from '../../../domain.types/wellness/nutrition/water.consumption/water.consumption.domain.model';
import { IWaterConsumptionRepo } from '../../../database/repository.interfaces/wellness/nutrition/water.consumption.repo.interface';

@injectable()
export class AssessmentNutritionHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('IWaterConsumptionRepo') private _waterConsumptionRepo: IWaterConsumptionRepo
    ) {
    }

    public persist = async (
        assessment: AssessmentDto, node: CAssessmentQuestionNode,
        fieldName: string, FieldIdentifierUnit: string, answer: SingleChoiceQueryAnswer |
    MultipleChoiceQueryAnswer |
    MessageAnswer |
    TextQueryAnswer |
    DateQueryAnswer |
    IntegerQueryAnswer |
    BooleanQueryAnswer |
    FloatQueryAnswer |
    FileQueryAnswer |
    BiometricQueryAnswer |
    SkipQueryAnswer) => {
        try {
            const userId = assessment.PatientUserId;
            const user = await this._userRepo.getById(userId);
            const personId = user.PersonId;
            if (!personId) {
                Logger.instance().log(`No person found for user ${userId}`);
                return;
            }

            if (fieldName === 'Vegetables') {
                const a = answer as IntegerQueryAnswer;
                const vegetables = a.Value;
                const nutritionRecord : FoodConsumptionDomainModel = {
                    PatientUserId : userId,
                    FoodTypes     : ["Vegetables"],
                    Servings      : vegetables,
                    Provider      : assessment.Provider,
                };
                
                await this._foodConsumptionRepo.create(nutritionRecord);
            }

            else if (fieldName === 'Fruits') {
                const a = answer as IntegerQueryAnswer;
                const fruits = a.Value;
                const nutritionFruitsRecord : FoodConsumptionDomainModel = {
                    PatientUserId : userId,
                    FoodTypes     : ["Fruits"],
                    Servings      : fruits,
                    Provider      : assessment.Provider,
                };
                await this._foodConsumptionRepo.create(nutritionFruitsRecord);
            }

            else if (fieldName === 'WholeGrain') {
                const a = answer as IntegerQueryAnswer;
                const wholeGrain = a.Value;
                const nutritionWholeGrainRecord : FoodConsumptionDomainModel = {
                    PatientUserId : userId,
                    FoodTypes     : ["Whole Grains"],
                    Servings      : wholeGrain,
                    Provider      : assessment.Provider,
                };
                await this._foodConsumptionRepo.create(nutritionWholeGrainRecord);
            }

            else if (fieldName === 'SeaFood') {
                const a = answer as IntegerQueryAnswer;
                const seafood = a.Value;
                const nutritionSeafoodRecord : FoodConsumptionDomainModel = {
                    PatientUserId : userId,
                    FoodTypes     : ["Sea Food"],
                    Servings      : seafood,
                    Provider      : assessment.Provider,
                };
                await this._foodConsumptionRepo.create(nutritionSeafoodRecord);
                
            }

            else if (fieldName === 'SugaryDrinks') {
                const a = answer as IntegerQueryAnswer;
                const sugaryDrinks = a.Value;
                const nutritionDrinksRecord : FoodConsumptionDomainModel = {
                    PatientUserId : userId,
                    FoodTypes     : ["Sugary Drinks"],
                    Servings      : sugaryDrinks,
                    Provider      : assessment.Provider,
                };
                await this._foodConsumptionRepo.create(nutritionDrinksRecord);
            }
            else if (fieldName === 'Water') {
                const a = answer as IntegerQueryAnswer;
                const water = a.Value;
                const waterRecord : WaterConsumptionDomainModel = {
                    PatientUserId : userId,
                    Provider      : assessment.Provider,
                    Volume        : water,
                    Time          : new Date()
                };
                await this._waterConsumptionRepo.create(waterRecord);
            }
            else if (fieldName === 'Alcohol') {
                const a = answer as IntegerQueryAnswer;
                const alcohol = a.Value;
                const nutritionAlcRecord : FoodConsumptionDomainModel = {
                    PatientUserId : userId,
                    FoodTypes     : ["Alcohol"],
                    Servings      : alcohol,
                    ServingUnit   : "Drinks",
                    Provider      : assessment.Provider,
                };
                await this._foodConsumptionRepo.create(nutritionAlcRecord);
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
