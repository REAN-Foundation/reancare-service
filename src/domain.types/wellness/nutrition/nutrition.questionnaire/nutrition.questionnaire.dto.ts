import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface NutritionQuestionnaireDto {
    id?                  : uuid,
    Question?            : string;
    QuestionType?        : string;
    AssociatedFoodTypes? : string[];
    Tags                 : string[];
    ServingUnit?         : string;
    ImageResourceId?     : uuid;
    QuestionInfo?        : string
}
