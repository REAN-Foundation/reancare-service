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
    ForeignKey,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Consent',
    tableName       : 'consents',
    paranoid        : true,
    freezeTableName : true,
})
export default class Consent extends Model {

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
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ResourceId: string;

    @Length({ min: 1, max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    ResourceCategory: string;

    @Length({ min: 1, max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    ResourceName: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TenantId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    OwnerUserId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ConsentHolderUserId: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
        defaultValue : false,
    })
    AllResourcesInCategory: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
        defaultValue : false,
    })
    TenantOwnedResource: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
        defaultValue : false,
    })
    Perpetual: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
        defaultValue : false,
    })
    Revoked: boolean;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    RevokedTimestamp: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    ConsentGivenOn: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    ConsentValidFrom: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ConsentValidTill: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
