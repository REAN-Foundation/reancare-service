import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany,
    IsDate, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import {
    ProgressStatus, ProgressStatusList
} from '../../../../../../domain.types/miscellaneous/system.types';
import User from '../../users/user/user.model';
import SymptomAssessmentTemplate from './symptom.assessment.template.model';
import Symptom from './symptom.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'SymptomAssessment',
    tableName       : 'symptom_assessments',
    paranoid        : true,
    freezeTableName : true,
})
export default class SymptomAssessment extends Model {

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
        allowNull : true,
    })
    EhrId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Title: string;

    @IsUUID(4)
    @ForeignKey(() => SymptomAssessmentTemplate)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AssessmentTemplateId: string;

    @BelongsTo(() => SymptomAssessmentTemplate)
    AssessmentTemplate: SymptomAssessmentTemplate;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    AssessmentDate: Date;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : ProgressStatusList,
        defaultValue : ProgressStatus.Pending
    })
    OverallStatus: string;

    @HasMany(() => Symptom, 'AssessmentId')
    Symptoms: Symptom[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
