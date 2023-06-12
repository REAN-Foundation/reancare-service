import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { DonorType, DonorTypeList } from '../../../../../domain.types/miscellaneous/clinical.types';
import { v4 } from 'uuid';
import Person from '../person/person.model';
import User from './user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Donor',
    tableName       : 'blood_donors',
    paranoid        : true,
    freezeTableName : true,
})
export default class Donor extends Model {

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
        allowNull : false,
    })
    UserId: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PersonId: string;

    @Length({ min: 4, max: 24 })
    @Column({
        type      : DataType.STRING(24),
        allowNull : false,
    })
    DisplayId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    EhrId: string;

    @Column({
        type      : DataType.STRING(16),
        allowNull : true,
    })
    BloodGroup: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AcceptorUserId?   : string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    LastDonationDate?  : Date;

    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : DonorTypeList,
        defaultValue : DonorType.BloodBridge
    })
    DonorType: DonorType;

    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    MedIssues: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsAvailable: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    HasDonatedEarlier: boolean;

    @BelongsTo(() => User)
    User: User;

    @BelongsTo(() => Person)
    Person: Person;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
