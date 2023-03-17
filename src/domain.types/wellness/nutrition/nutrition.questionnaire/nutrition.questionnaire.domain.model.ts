import { uuid } from "../../../miscellaneous/system.types";

export interface NutritionQuestionnaireDomainModel {
    id?                  : uuid,
    Question?            : string;
    QuestionType?        : string;
    AssociatedFoodTypes? : string[];
    Tags                 : string[];
    ServingUnit?         : string;
    ImageResourceId?     : uuid;
    QuestionInfo?        : string
}
