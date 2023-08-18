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
    IsEmail,
    IsDate,
    Index,
    ForeignKey,
} from 'sequelize-typescript';

import { OrganizationTypeList } from '../../../../../../domain.types/general/organization/organization.types';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';

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
        type         : DataType.ENUM,
        values       : OrganizationTypeList,
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

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
