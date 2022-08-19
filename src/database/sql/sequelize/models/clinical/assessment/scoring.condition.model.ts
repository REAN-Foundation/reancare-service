import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    IsUUID,
    Length,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import {
    ConditionCompositionType,
    ConditionCompositionTypeList,
    ConditionOperandDataType,
    ConditionOperandDataTypeList,
    ConditionOperatorType,
    ConditionOperatorTypeList,
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import { v4 } from 'uuid';
import AssessmentNode from './assessment.model';
import AssessmentTemplate from './assessment.template.model';

///////////////////////////////////////////////////////////////////////

//Note that - this rule will be complex set of conditions which will be
//represented through hierarchical pre-conditions and compositions.

@Table({
    timestamps      : true,
    modelName       : 'ScoringCondition',
    tableName       : 'scoring_conditions',
    paranoid        : true,
    freezeTableName : true,
})
export default class ScoringCondition extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false,
    })
    id: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    DisplayCode: string;

    @IsUUID(4)
    @ForeignKey(() => AssessmentTemplate)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TemplateId: string;

    @BelongsTo(() => AssessmentTemplate)
    Template: AssessmentTemplate;

    @IsUUID(4)
    @ForeignKey(() => AssessmentNode)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    NodeId: string; //Node to which this condition belongs

    @Column({
        type         : DataType.BOOLEAN,
        defaultValue : false,
        allowNull    : false,
    })
    IsCompositeCondition: boolean;

    @Column({
        type         : DataType.ENUM,
        values       : ConditionCompositionTypeList,
        defaultValue : ConditionCompositionType.And,
        allowNull    : false,
    })
    CompositionType: string;

    @IsUUID(4)
    @ForeignKey(() => ScoringCondition)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ParentConditionId: string; //In case of composite condition

    @BelongsTo(() => ScoringCondition)
    ParentCondition: ScoringCondition;

    @Column({
        type         : DataType.ENUM,
        values       : ConditionOperatorTypeList,
        defaultValue : ConditionOperatorType.EqualTo,
        allowNull    : false,
    })
    OperatorType: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    FirstOperandName: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    SecondOperandName: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    ThirdOperandName: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    FirstOperandValue: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    SecondOperandValue: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    ThirdOperandValue: string;

    @Column({
        type         : DataType.ENUM,
        values       : ConditionOperandDataTypeList,
        defaultValue : ConditionOperandDataType.Integer,
        allowNull    : true,
    })
    FirstOperandDataType: string;

    @Column({
        type         : DataType.ENUM,
        values       : ConditionOperandDataTypeList,
        defaultValue : ConditionOperandDataType.Integer,
        allowNull    : true,
    })
    SecondOperandDataType: string;

    @Column({
        type         : DataType.ENUM,
        values       : ConditionOperandDataTypeList,
        defaultValue : ConditionOperandDataType.Integer,
        allowNull    : true,
    })
    ThirdOperandDataType: string;

    @Column({
        type         : DataType.FLOAT,
        defaultValue : 0.0,
        allowNull    : true,
    })
    ResolutionScore: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
