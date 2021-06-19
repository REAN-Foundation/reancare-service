import { 
    Table, 
    Column, 
    Model,
    DataType,
    HasMany,
    HasOne,
    BelongsTo,
    BelongsToMany,
    CreatedAt, 
    UpdatedAt, 
    DeletedAt, 
    IsUUID,
    PrimaryKey,
    Length,
    BeforeCreate,
    IsEmail,
    IsDate,
    IsInt,
    ForeignKey
    } from 'sequelize-typescript';

import { uuid } from 'uuidv4';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'UserRole',
    tableName: 'user_roles',
    paranoid: true,
    freezeTableName: true
})
export default class UserRole extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => { return uuid(); },
        allowNull: false
    })
    id: string;

    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    UserId: string;

    @IsInt
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    RoleId: number;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
