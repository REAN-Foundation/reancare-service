import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsDate, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import {
    ClinicalInterpretation,
    ClinicalInterpretationList, ClinicalValidationStatus, ClinicalValidationStatusList
} from '../../../../../../domain.types/miscellaneous/clinical.types';
import { Severity, SeverityList } from '../../../../../../domain.types/miscellaneous/system.types';
import User from '../../users/user/user.model';
import Visit from '../visit.model';
import SymptomAssessment from './symptom.assessment.model';
import SymptomAssessmentTemplate from './symptom.assessment.template.model';
import SymptomType from './symptom.type.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Symptom',
    tableName       : 'symptoms',
    paranoid        : true,
    freezeTableName : true,
})
export default class Symptom extends Model {

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

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    MedicalPractitionerUserId: string;

    @IsUUID(4)
    @ForeignKey(() => Visit)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    VisitId: string;

    @IsUUID(4)
    @ForeignKey(() => SymptomAssessment)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AssessmentId: string;

    @BelongsTo(() => SymptomAssessment)
    Assessment: SymptomAssessment;

    @IsUUID(4)
    @ForeignKey(() => SymptomAssessmentTemplate)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AssessmentTemplateId: string;

    @IsUUID(4)
    @ForeignKey(() => SymptomType)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    SymptomTypeId: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Symptom: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : true
    })
    IsPresent: boolean;

    @Length({ max: 16 })
    @Column({
        type         : DataType.STRING(16),
        allowNull    : false,
        values       : SeverityList,
        defaultValue : Severity.Low
    })
    Severity: string;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : ClinicalValidationStatusList,
        defaultValue : ClinicalValidationStatus.Preliminary
    })
    ValidationStatus: string;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : true,
        values       : ClinicalInterpretationList,
        defaultValue : ClinicalInterpretation.Normal
    })
    Interpretation: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Comments: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
