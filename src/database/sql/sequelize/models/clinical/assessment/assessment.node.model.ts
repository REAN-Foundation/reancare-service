import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    IsFloat,
    IsInt,
    IsUUID,
    Length,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import {
    AssessmentNodeType,
    AssessmentNodeTypeList,
    QueryResponseType,
    QueryResponseTypeList,
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import AssessmentNodePath from './assessment.node.path.model';
import AssessmentTemplate from './assessment.template.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'AssessmentNode',
    tableName       : 'assessment_nodes',
    paranoid        : true,
    freezeTableName : true,
})
export default class AssessmentNode extends Model {

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

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : true,
    })
    Required: boolean;

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
    ParentNodeId: string;

    @BelongsTo(() => AssessmentNode)
    Parent: AssessmentNode;

    @Column({
        type         : DataType.ENUM,
        values       : AssessmentNodeTypeList,
        defaultValue : AssessmentNodeType.Question,
        allowNull    : false,
    })
    NodeType: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    ServeListNodeChildrenAtOnce: boolean;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ProviderGivenCode: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ProviderGivenId: string;

    @IsInt
    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 0
    })
    Sequence: number;

    //In case assessment is supposed to generate a score/numerical evaluation
    @IsFloat
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Score: number;

    @Column({
        type         : DataType.ENUM,
        values       : QueryResponseTypeList,
        defaultValue : QueryResponseType.None,
        allowNull    : false,
    })
    QueryResponseType: string;

    @IsUUID(4)
    @ForeignKey(() => AssessmentNodePath)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    DefaultPathId: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Message: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    Acknowledged: boolean;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    CorrectAnswer: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    RawData: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
