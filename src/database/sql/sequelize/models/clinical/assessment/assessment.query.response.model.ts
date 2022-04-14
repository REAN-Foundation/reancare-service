import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    IsDate,
    IsFloat,
    IsInt,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import {
    QueryResponseType,
    QueryResponseTypeList,
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import Assessment from './assessment.model';
import AssessmentNode from './assessment.node.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'AssessmentQueryResponse',
    tableName       : 'assessment_query_responses',
    paranoid        : true,
    freezeTableName : true,
})
export default class AssessmentQueryResponse extends Model {

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

    @IsUUID(4)
    @ForeignKey(() => Assessment)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    AssessmentId: string;

    @IsUUID(4)
    @ForeignKey(() => AssessmentNode)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    NodeId: string;

    @BelongsTo(() => AssessmentNode)
    Node: AssessmentNode;

    @Column({
        type         : DataType.ENUM,
        values       : QueryResponseTypeList,
        defaultValue : QueryResponseType.SingleChoiceSelection,
        allowNull    : false,
    })
    Type: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Sequence: number;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    IntegerValue: number;

    @IsFloat
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    FloatValue: number;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    BooleanValue: boolean;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    DateValue: Date;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Url: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ResourceId: string;

    //Should also handle multiple choice selections in stringified array format
    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    TextValue: string;
    
    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Additional: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
