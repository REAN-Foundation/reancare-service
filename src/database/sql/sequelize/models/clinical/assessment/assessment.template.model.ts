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
import {
    AssessmentType,
    AssessmentTypeList,
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import FileResource from '../../general/file.resource/file.resource.model';
import AssessmentNode from './assessment.node.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'AssessmentTemplate',
    tableName       : 'assessment_templates',
    paranoid        : true,
    freezeTableName : true,
})
export default class AssessmentTemplate extends Model {

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

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : false,
        defaultValue : "1.0"
    })
    Version: string;

    @Column({
        type         : DataType.ENUM,
        values       : AssessmentTypeList,
        defaultValue : AssessmentType.Careplan,
        allowNull    : false,
    })
    Type: string;

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
    ProviderAssessmentCode: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Provider: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    ScoringApplicable: boolean;

    @IsUUID(4)
    @ForeignKey(() => AssessmentNode)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    RootNodeId: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    ServeListNodeChildrenAtOnce: boolean;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    FileResourceId: string;

    @BelongsTo(() => FileResource)
    FileResource: FileResource;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    TotalNumberOfQuestions: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
