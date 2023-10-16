import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt,
    ForeignKey, IsUUID, Length, Model,
    PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import Tenant from '../../tenant/tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Cohort',
    tableName       : 'cohorts',
    paranoid        : true,
    freezeTableName : true,
})
export default class Cohort extends Model {

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
    @ForeignKey(() => Tenant)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TenantId: string;

    @BelongsTo(() =>  Tenant)
    Tenant:  Tenant;

    @Length({ max: 128 })
    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Name: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ImageUrl: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    OwnerUserId: string;

    @BelongsTo(() =>  User)
    Owner:  User;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
