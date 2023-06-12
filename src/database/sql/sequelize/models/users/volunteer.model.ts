import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import Person from '../person/person.model';
import User from './user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Volunteer',
    tableName       : 'blood_donation_volunteers',
    paranoid        : true,
    freezeTableName : true,
})
export default class Volunteer extends Model {

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
        type      : DataType.DATE,
        allowNull : true,
    })
    LastDonationDate?  : Date;

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
        type      : DataType.STRING(16),
        allowNull : true,
    })
    SelectedBloodGroup: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    SelectedBridgeId: string;

    @Column({
        type      : DataType.STRING(16),
        allowNull : true,
    })
    SelectedPhoneNumber: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    LastDonationRecordId: string;

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
