import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
    IsEmail,
    IsDate,
    Index,
    ForeignKey,
} from 'sequelize-typescript';
import { PersonIdentificationType } from '../../../domain.types/person.domain.types';

import { uuid } from 'uuidv4';
import User from './user.model';
import Organization from './organization.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Person',
    tableName: 'persons',
    paranoid: true,
    freezeTableName: true,
})
export default class Person extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => {
            return uuid();
        },
        allowNull: false,
    })
    id: string;

    @Length({ max: 16 })
    @Column({
        type: DataType.STRING(16),
        allowNull: true,
    })
    Prefix: string;

    @Length({ max: 70 })
    @Column({
        type: DataType.STRING(70),
        allowNull: true,
    })
    FirstName: string;

    @Length({ max: 70 })
    @Column({
        type: DataType.STRING(70),
        allowNull: true,
    })
    MiddleName: string;

    @Length({ max: 70 })
    @Column({
        type: DataType.STRING(70),
        allowNull: true,
    })
    LastName: string;

    @Index
    @Length({ max: 24 })
    @Column({
        type: DataType.STRING(24),
        allowNull: false,
    })
    Phone: string;

    @Length({ max: 128 })
    @IsEmail
    @Column({
        type: DataType.STRING(128),
        allowNull: true,
    })
    Email: string;

    @Column({
        type: DataType.ENUM,
        values: ['Male', 'Female', 'Other', 'Unknown'],
        defaultValue: 'Male',
        allowNull: false,
    })
    Gender: string;

    @IsDate
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    BirthDate: Date;

    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    ImageResourceId: string;

    @Length({ max: 64 })
    @Column({
        type: DataType.STRING(64),
        allowNull: true,
    })
    NationalId: string;

    @Length({ max: 32 })
    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: PersonIdentificationType.Aadhar
    })
    NationalIdType: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    IsActive: boolean;

    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    OrganizationId: string;

    @HasMany(() => User)
    Users: User[];

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
