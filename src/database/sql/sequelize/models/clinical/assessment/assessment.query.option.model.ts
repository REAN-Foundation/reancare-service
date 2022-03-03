import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    IsInt,
    IsUUID,
    Length,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import AssessmentNode from './assessment.node.model';

///////////////////////////////////////////////////////////////////////

//This is query option associated with Query node.
// i.e. Node is query with choice options - multiple or single selection

@Table({
    timestamps      : true,
    modelName       : 'AssessmentQueryOption',
    tableName       : 'assessment_query_options',
    paranoid        : true,
    freezeTableName : true,
})
export default class AssessmentQueryOption extends Model {

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
        type      : DataType.TEXT,
        allowNull : true,
    })
    ProviderGivenCode: string;

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
        type         : DataType.TEXT,
        allowNull    : false,
        defaultValue : ''
    })
    Text: string;
      
    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ImageUrl: string;

    @IsInt
    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 0
    })
    Sequence: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
