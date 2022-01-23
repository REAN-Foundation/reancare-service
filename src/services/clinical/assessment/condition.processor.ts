import { SAssessmentPathCondition } from "../../../domain.types/clinical/assessment/assessment.types";

export class ConditionProcessor {

    public static async processCondition(condition: SAssessmentPathCondition, argument: any): Promise<boolean> {

        if (!condition || !argument) {
            throw new Error(`Invalid condition to process!`);
        }

        return false;

    }

}
