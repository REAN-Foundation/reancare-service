import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { BridgeStatus, BridgeStatusList, DonorType, DonorTypeList } from '../../../../../../domain.types/miscellaneous/clinical.types';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PatientDonors',
    tableName       : 'donation_patient_donors',
    paranoid        : true,
    freezeTableName : true,
})
export default class PatientDonors extends Model {

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

    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    Name: string;

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
        allowNull : false,
    })
    DonorUserId: string;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : DonorTypeList,
        defaultValue : DonorType.BloodBridge
    })
    DonorType: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    VolunteerUserId: string;

    @Column({
        type      : DataType.STRING(16),
        allowNull : true,
    })
    BloodGroup: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    NextDonationDate?   : Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    LastDonationDate?  : Date;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    QuantityRequired: number;

    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : BridgeStatusList,
        defaultValue : BridgeStatus.Inactive
    })
    Status: string;

    @BelongsTo(() => User)
    User: User;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
