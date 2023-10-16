import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt,
    ForeignKey, IsUUID, Length, Model,
    PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserGroup',
    tableName       : 'user_groups',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserGroup extends Model {

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
