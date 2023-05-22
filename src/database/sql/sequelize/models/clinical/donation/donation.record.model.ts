import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import PatientDonors from './patient.donors.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'DonationRecord',
    tableName       : 'blood_donations',
    paranoid        : true,
    freezeTableName : true,
})
export default class DonationRecord extends Model {

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

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PatientUserId: string;

    @IsUUID(4)
    @ForeignKey(() => PatientDonors)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    NetworkId: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    EmergencyDonor: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    VolunteerOfEmergencyDonor: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    RequestedQuantity: number;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    RequestedDate?   : Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    DonorAcceptedDate?  : Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    DonorRejectedDate?  : Date;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    DonatedQuantity: number;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    DonationDate?  : Date;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    DonationType: string;

    @BelongsTo(() => User)
    User: User;

    @BelongsTo(() => PatientDonors)
    PatientDonors: PatientDonors;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
