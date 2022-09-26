import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import {
    ClinicalInterpretation, ClinicalInterpretationList, ClinicalValidationStatus, ClinicalValidationStatusList
} from '../../../../../domain.types/miscellaneous/clinical.types';
import User from '../users/user/user.model';
import MedicalCondition from './medical.condition.model';
import Visit from './visit.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Diagnosis',
    tableName       : 'diagnoses',
    paranoid        : true,
    freezeTableName : true,
})
export default class Diagnosis extends Model {

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
    @ForeignKey(() => MedicalCondition)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    MedicalConditionId: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Comments: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : true
    })
    IsClinicallyActive: boolean;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : true,
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

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    OnsetDate: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
