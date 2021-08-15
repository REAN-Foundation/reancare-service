import {
    Table,
    Column,
    Model,
    DataType,
    BelongsToMany,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
    IsEmail,
    IsDate,
    Index,
    HasMany,
    ForeignKey,
} from 'sequelize-typescript';
import { OrganizationTypes } from '../../../domain.types/organization.domain.types';

import { v4 } from 'uuid';
import Address from './address.model';
import Person from './person.model';
import OrganizationPersons from './organization.persons.model';
import User from './user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Organization',
    tableName       : 'organizations',
    paranoid        : true,
    freezeTableName : true,
})
export default class Organization extends Model {

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

    @Length({ min: 1, max: 64 })
    @Column({
        type         : DataType.STRING(64),
        allowNull    : true,
        defaultValue : '',
    })
    Name: string;

    @Column({
        type   : DataType.ENUM,
        values : [
            OrganizationTypes.Clinic,
            OrganizationTypes.Hospital,
            OrganizationTypes.DiagnosticLab,
            OrganizationTypes.Pharmacy,
            OrganizationTypes.AmbulanceService,
            OrganizationTypes.Unknown,
        ],
        defaultValue : 'Unknown',
        allowNull    : false,
    })
    Type: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ContactUserId: string;

    @Index
    @Length({ min: 10, max: 16 })
    @Column({
        type      : DataType.STRING(16),
        allowNull : false,
    })
    ContactPhone: string;

    @Length({ min: 3, max: 50 })
    @IsEmail
    @Column({
        type      : DataType.STRING(50),
        allowNull : true,
    })
    ContactEmail: string;

    @Length({ min: 12, max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    About: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ParentOrganizationId: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    OperationalSince: Date;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ImageResourceId: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : true
    })
    IsHealthFacility: boolean;

    @Length({ min: 4, max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    NationalHealthFacilityRegistryId: string;

    // @BelongsToMany(() => Person, { through: 'OrganizationPersons' })
    // Persons: Person[];
    @BelongsToMany(() => Person, () => OrganizationPersons)
    Persons: Array<Person & { OrganizationPersons: OrganizationPersons }>;

    @HasMany(() => Address)
    Addresses: Address[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}


