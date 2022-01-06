export enum AssessmentNodeType {
    Message             = 'Message',
    Question            = 'Question',
    ContinueToNext      = 'Continue to next', //Terminate current questioning path and return
    TerminateAssessment = 'Terminate assessment',
}

export const AssessmentNodeTypeList: AssessmentNodeType[] = [
    AssessmentNodeType.Message,
    AssessmentNodeType.Question,
    AssessmentNodeType.ContinueToNext,
    AssessmentNodeType.TerminateAssessment,
];

export enum QueryResponseType {
    Text                  = 'Text',
    FloatValue            = 'Float value',
    IntegerValue          = 'Integer value',
    SingleChoiceSelection = 'Single Choice Selection',
    MultiChoiceSelection  = 'Multi Choice Selection',
    Boolean               = 'Boolean',
    Ok                    = 'Ok',
}

export const QueryResponseTypeList: QueryResponseType[] = [
    QueryResponseType.Text,
    QueryResponseType.FloatValue,
    QueryResponseType.IntegerValue,
    QueryResponseType.SingleChoiceSelection,
    QueryResponseType.MultiChoiceSelection,
];

export enum AssessmentType {
    DailyUpdate = 'Daily update',
    Careplan    = 'Careplan',
    Symptom     = 'Symptoms',
    Survey      = 'Survey',
    Protocol    = 'Protocol',
    Custom      = 'Custom',
}

export const AssessmentTypeList: AssessmentType[] = [
    AssessmentType.Careplan,
    AssessmentType.Symptom,
    AssessmentType.Survey,
    AssessmentType.Protocol,
    AssessmentType.Custom
];

export enum ConditionOperatorType {
    EqualTo            = 'Equal to',
    NotEqualTo         = 'Not equal to',
    GreaterThan        = 'Greater than',
    GreaterThanEqualTo = 'Greater than or equal to',
    LessThan           = 'Less than',
    LessThanEqualTo    = 'Less than or equal to',
    In                 = 'In',
    Between            = 'Between',
    IsTrue             = 'Is true',
    IsFalse            = 'Is false',
    Exists             = 'Exists',
}

export const ConditionOperatorTypeList: ConditionOperatorType[] = [
    ConditionOperatorType.EqualTo,
    ConditionOperatorType.NotEqualTo,
    ConditionOperatorType.GreaterThan,
    ConditionOperatorType.GreaterThanEqualTo,
    ConditionOperatorType.LessThan,
    ConditionOperatorType.LessThanEqualTo,
    ConditionOperatorType.In,
    ConditionOperatorType.Between,
    ConditionOperatorType.IsTrue,
    ConditionOperatorType.IsFalse
];

export enum ConditionCompositionType {
    And = 'And',
    Or  = 'Or',
}

export const ConditionCompositionTypeList: ConditionCompositionType[] = [
    ConditionCompositionType.And,
    ConditionCompositionType.Or,
];

export enum ConditionOperandDataType {
    Float   = 'Float',
    Integer = 'Integer',
    Boolean = 'Boolean',
    Text    = 'Text',
    Array   = 'Array',
}

export const ConditionOperandDataTypeList: ConditionOperandDataType[] = [
    ConditionOperandDataType.Float,
    ConditionOperandDataType.Integer,
    ConditionOperandDataType.Boolean,
    ConditionOperandDataType.Text,
    ConditionOperandDataType.Array,
];
