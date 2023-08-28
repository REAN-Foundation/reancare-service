import {
    Column, CreatedAt, DataType, DeletedAt, HasMany, Index, IsEmail, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { Gender, Genders } from '../../../../../domain.types/miscellaneous/system.types';
import { PersonIdentificationType } from '../../../../../domain.types/person/person.types';
import User from '../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Person',
    tableName       : 'persons',
    paranoid        : true,
    freezeTableName : true,
})
export default class Person extends Model {

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

    @Length({ max: 16 })
    @Column({
        type      : DataType.STRING(16),
        allowNull : true,
    })
    Prefix: string;

    @Length({ max: 70 })
    @Column({
        type      : DataType.STRING(70),
        allowNull : true,
    })
    FirstName: string;

    @Length({ max: 70 })
    @Column({
        type      : DataType.STRING(70),
        allowNull : true,
    })
    MiddleName: string;

    @Length({ max: 70 })
    @Column({
        type      : DataType.STRING(70),
        allowNull : true,
    })
    LastName: string;

    @Index
    @Length({ max: 24 })
    @Column({
        type      : DataType.STRING(24),
        allowNull : false,
    })
    Phone: string;

    @Length({ max: 128 })
    @IsEmail
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Email: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    TelegramChatId: string;

    @Column({
        type         : DataType.ENUM,
        values       : Genders,
        defaultValue : Gender.Unknown,
        allowNull    : true,
    })
    Gender: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    SelfIdentifiedGender: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    BirthDate: Date;

    @Column({
        type      : DataType.STRING(28),
        allowNull : true,
    })
    Age: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ImageResourceId: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
        unique    : true
    })
    NationalId: string;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        defaultValue : PersonIdentificationType.Aadhar
    })
    NationalIdType: string;

    @HasMany(() => User)
    Users: User[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
