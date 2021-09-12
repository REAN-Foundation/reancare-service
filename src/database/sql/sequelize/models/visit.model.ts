import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
    IsDate,
    ForeignKey,
} from 'sequelize-typescript';

import { VisitStates, VisitTypes } from '../../../../domain.types/miscellaneous/system.types';
import { v4 } from 'uuid';
import Organization from './organization.model';
import User from './user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Visit',
    tableName       : 'visits',
    paranoid        : true,
    freezeTableName : true,
})
export default class Visit extends Model {

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
    
    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
        values    : [
            VisitTypes.DoctorVisit,
            VisitTypes.LabVisit,
            VisitTypes.TeleVisit,
            VisitTypes.Unknown
        ]
    })
    VisitType: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    DisplayId: string;

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
    ReferenceVisitId: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : false,
        values    : [
            VisitStates.Started,
            VisitStates.InProgress,
            VisitStates.Cancelled,
            VisitStates.Completed,
            VisitStates.Unknown
        ],
        defaultValue : VisitStates.Unknown
    })
    CurrentState: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartDate: Date

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndDate: Date

    // @IsUUID(4)
    // @ForeignKey(() => Appointment)
    // @Column({
    //     type      : DataType.UUID,
    //     allowNull : true,
    // })
    // AppointmentId: string;

    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    FulfilledAtOrganizationId: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AdditionalInformation: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
