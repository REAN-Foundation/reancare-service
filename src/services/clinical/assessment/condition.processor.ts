import { inject, injectable } from "tsyringe";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { ConditionOperand,
    ConditionOperandDataType,
    ConditionOperatorType,
    CAssessmentPathCondition } from "../../../domain.types/clinical/assessment/assessment.types";

/////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ConditionProcessor {

    constructor(
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo
    ) {
    }

    public processCondition = async (condition: CAssessmentPathCondition, argument: any): Promise<boolean> => {

        if (!condition || !argument) {
            throw new Error(`Invalid condition to process!`);
        }

        if (!condition.IsCompositeCondition) {
            var first = condition.FirstOperand;
            first.Value = argument;
            return this.operate(condition.OperatorType, first, condition.SecondOperand, condition.ThirdOperand);
        }
        // else {
        //     const childrenConditions: SAssessmentPathCondition[] =
        //         await this._assessmentHelperRepo.getChildrenConditions(condition.id);
        // }

        return false;
    };

    //#region Privates

    private operate(
        operator: ConditionOperatorType,
        first: ConditionOperand,
        second: ConditionOperand,
        third?: ConditionOperand): boolean {

        var resolved = false;

        switch (operator) {
            case ConditionOperatorType.EqualTo: {
                resolved = this.isEqualTo(first, second);
                break;
            }
            case ConditionOperatorType.NotEqualTo: {
                resolved = this.isNotEqualTo(first, second);
                break;
            }
            case ConditionOperatorType.In: {
                resolved = this.in(first, second);
                break;
            }
            case ConditionOperatorType.IsFalse: {
                resolved = this.isFalse(first);
                break;
            }
            case ConditionOperatorType.IsTrue: {
                resolved = this.isTrue(first);
                break;
            }
            case ConditionOperatorType.GreaterThan: {
                resolved = this.greaterThan(first, second);
                break;
            }
            case ConditionOperatorType.LessThan: {
                resolved = this.lessThan(first, second);
                break;
            }
            case ConditionOperatorType.GreaterThanEqualTo: {
                resolved = this.greaterThanEqualTo(first, second);
                break;
            }
            case ConditionOperatorType.LessThanEqualTo: {
                resolved = this.lessThanEqualTo(first, second);
                break;
            }
            case ConditionOperatorType.Between: {
                resolved = this.between(first, second, third);
                break;
            }
            default: {
                break;
            }
        }

        return resolved;
    }

    private compareArray(first: ConditionOperand, second: ConditionOperand): boolean {
        const firstArray: any[] = first.Value as any[];
        const secondArray: any[] = second.Value as any[];
        if (firstArray.length === 0 || secondArray.length === 0) {
            return false;
        }
        if (firstArray.length !== secondArray.length) {
            return false;
        }
        for (var i = 0; i < firstArray.length; i++) {
            if (secondArray[i] !== firstArray[i]) {
                return false;
            }
        }
        return true;
    }

    private isEqualTo(first: ConditionOperand, second: ConditionOperand): boolean {
        if (first.DataType !== second.DataType) {
            return false;
        }
        if (first.DataType === ConditionOperandDataType.Float ||
            first.DataType === ConditionOperandDataType.Integer ||
            first.DataType === ConditionOperandDataType.Boolean) {
            return first.Value === second.Value;
        }
        if (first.DataType === ConditionOperandDataType.Array) {
            return this.compareArray(first, second);
        }
        if (first.DataType === ConditionOperandDataType.Text) {
            const firstValue = first.Value.toString().toLowerCase();
            const secondValue = second.Value.toString().toLowerCase();
            if (firstValue === secondValue) {
                return true;
            }
        }
        return false;
    }

    private isNotEqualTo(first: ConditionOperand, second: ConditionOperand): boolean {
        return first.Value !== second.Value;
    }

    private in(first: ConditionOperand, second: ConditionOperand): boolean {
        const secondArray: any[] = second.Value as any[];
        return secondArray.includes(first);
    }

    private isFalse(first: ConditionOperand): boolean {
        return first.Value === false;
    }

    private isTrue(first: ConditionOperand): boolean {
        return first.Value === true;
    }

    private greaterThan(first: ConditionOperand, second: ConditionOperand): boolean {
        return first.Value > second.Value;
    }

    private lessThan(first: ConditionOperand, second: ConditionOperand): boolean {
        return first.Value < second.Value;
    }

    private greaterThanEqualTo(first: ConditionOperand, second: ConditionOperand): boolean {
        return first.Value >= second.Value;
    }

    private lessThanEqualTo(first: ConditionOperand, second: ConditionOperand): boolean {
        return first.Value <= second.Value;
    }

    private between(first: ConditionOperand, second: ConditionOperand, third: ConditionOperand): boolean {
        return first.Value >= second.Value && first.Value <= third.Value;
    }

    //#endregion

}
