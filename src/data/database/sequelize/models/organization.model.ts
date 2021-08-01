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
import { OrganizationTypes } from '../../../domain.types/organization.domain.types';

import { v4 } from 'uuid';
import Address from './address.model';
import Person from './person.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Organization',
    tableName: 'organizations',
    paranoid: true,
    freezeTableName: true,
})
export default class Organization extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => {
            return v4();
        },
        allowNull: false,
    })
    id: string;

    @Length({ min: 1, max: 64 })
    @Column({
        type: DataType.STRING(64),
        allowNull: true,
        defaultValue: '',
    })
    Name: string;

    @Column({
        type: DataType.ENUM,
        values: [ 
            OrganizationTypes.Clinic, 
            OrganizationTypes.Hospital, 
            OrganizationTypes.DiagnosticLab, 
            OrganizationTypes.Pharmacy, 
            OrganizationTypes.AmbulanceService, 
            OrganizationTypes.Unknown, 
        ],
        defaultValue: 'Unknown',
        allowNull: false,
    })
    Type: string;

    @Index
    @Length({ min: 10, max: 16 })
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
    })
    ContactPhone: string;

    @Length({ min: 3, max: 50 })
    @IsEmail
    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    ContactEmail: string;

    @Length({ min: 12, max: 512 })
    @IsEmail
    @Column({
        type: DataType.STRING(512),
        allowNull: true,
    })
    AboutUs: string;

    @IsDate
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    OperationalSince: Date;

    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    ParentOrganizationId: string;

    @IsUUID(4)
    @ForeignKey(() => Address)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    MainAddressId: string;

    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    LogoImageResourceId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    IsHealthFacility: boolean;

    @Length({ min: 4, max: 64 })
    @Column({
        type: DataType.STRING(64),
        allowNull: true,
    })
    NationalHealthFacilityRegistryId: string;

    @HasMany(() => Person)
    Persons: Person[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
