import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    PrimaryKey,
    Length,
    IsUUID,
    ForeignKey,
    IsDate,
} from 'sequelize-typescript';

import {
    ProgressStatusList,
    ProgressStatus
} from '../../../../../domain.types/miscellaneous/system.types';
import User from '../user.model';
import SymptomAssessmentTemplate from './symptom.assessment.template.model';
import { v4 } from 'uuid';

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
    
    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    AssessmentDate: Date
    
    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : ProgressStatusList,
        defaultValue : ProgressStatus.Pending
    })
    OverallStatus: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
