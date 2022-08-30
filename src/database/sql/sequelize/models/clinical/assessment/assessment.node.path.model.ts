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
import { v4 } from 'uuid';
import AssessmentNode from './assessment.node.model';
import AssessmentPathCondition from './assessment.path.condition.model';

///////////////////////////////////////////////////////////////////////

//These are possible paths available at a given node.
//They could be presented as options t

@Table({
    timestamps      : true,
    modelName       : 'AssessmentNodePath',
    tableName       : 'assessment_node_paths',
    paranoid        : true,
    freezeTableName : true,
})
export default class AssessmentNodePath extends Model {

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
    @ForeignKey(() => AssessmentNode)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ParentNodeId: string;

    @BelongsTo(() => AssessmentNode)
    ParentNode: AssessmentNode;

    //Next assessment node - could be null in case path terminates
    @IsUUID(4)
    @ForeignKey(() => AssessmentNode)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    NextNodeId: string;

    @BelongsTo(() => AssessmentNode)
    NextNode: AssessmentNode;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    NextNodeDisplayCode: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsExitPath: boolean;

    //The condition based on which this path will be chosen
    @IsUUID(4)
    @ForeignKey(() => AssessmentPathCondition)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ConditionId: string;

    @BelongsTo(() => AssessmentPathCondition)
    Condition: AssessmentPathCondition;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
