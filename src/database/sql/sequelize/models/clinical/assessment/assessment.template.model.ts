import {
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
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
        type      : DataType.STRING(128),
        allowNull : true,
    })
    ProviderAssessmentCode: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Title: string;

    @Column({
        type         : DataType.ENUM,
        values       : AssessmentTypeList,
        defaultValue : AssessmentType.Careplan,
        allowNull    : false,
    })
    Type: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Provider: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
