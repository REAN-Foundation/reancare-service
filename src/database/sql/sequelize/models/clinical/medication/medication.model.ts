import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsDecimal, IsInt,
    IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import {
    MedicationAdministrationRoutes,
    MedicationAdministrationRoutesList,
    MedicationDosageUnits,
    MedicationDosageUnitsList,
    MedicationDurationUnits,
    MedicationDurationUnitsList,
    MedicationFrequencyUnits,
    MedicationFrequencyUnitsList,
    MedicationTimeSchedules,
    MedicationTimeSchedulesList
} from '../../../../../../domain.types/clinical/medication/medication/medication.types';
import FileResource from '../../general/file.resource/file.resource.model';
import User from '../../users/user/user.model';
import Order from '../order.model';
import Visit from '../visit.model';
import Drug from './drug.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Medication',
    tableName       : 'medications',
    paranoid        : true,
    freezeTableName : true,
})
export default class Medication extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
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
    @ForeignKey(() => Order)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    OrderId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    DrugName: string; //This is brand-name

    @IsUUID(4)
    @ForeignKey(() => Drug)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    DrugId: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Dose: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : false,
        values       : MedicationDosageUnitsList,
        defaultValue : MedicationDosageUnits.Tablet
    })
    DosageUnit: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : MedicationTimeSchedulesList,
        defaultValue : MedicationTimeSchedules.Afternoon
    })
    TimeSchedules: string;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Frequency: number;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : MedicationFrequencyUnitsList,
        defaultValue : MedicationFrequencyUnits.Daily
    })
    FrequencyUnit: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : MedicationAdministrationRoutesList,
        defaultValue : MedicationAdministrationRoutes.Oral
    })
    Route: string;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Duration: number;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : MedicationDurationUnitsList,
        defaultValue : MedicationDurationUnits.Days
    })
    DurationUnit: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartDate: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndDate: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    RefillNeeded: boolean;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    RefillCount: number;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Instructions: string;

    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ImageResourceId: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsExistingMedication: boolean;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    TakenForLastNDays: number;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    ToBeTakenForNextNDays: number;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsCancelled: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
