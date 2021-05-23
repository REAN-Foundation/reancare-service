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
    } from 'sequelize-typescript';

import { UUIDV4 } from 'sequelize/types';
import * as bcrypt from 'bcryptjs';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    freezeTableName: true
})
export class User extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: UUIDV4,
        allowNull: false
    })
    id: string;

    @Length({ min: 1, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: true,
    })
    Prefix: string;

    @Length({ min: 1, max: 25})
    @Column({
        type: DataType.STRING(25),
        allowNull: false,
    })
    FirstName: string;

    @Length({ min: 1, max: 25})
    @Column({
        type: DataType.STRING(25),
        allowNull: true,
    })
    MiddleName: string;

    @Length({ min: 1, max: 25})
    @Column({
        type: DataType.STRING(25),
        allowNull: false,
    })
    LastName: string;

    @Length({ min: 1, max: 10})
    @Column({
        type: DataType.STRING(10),
        allowNull: true,
    })
    UserName: string;

    @Length({ min: 6, max: 256})
    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Password: string;

    @Length({ min: 10, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: true,
    })
    Phone: string;

    @Length({ min: 3, max: 50})
    @IsEmail
    @Column({
        type: DataType.STRING(16),
        allowNull: true,
    })
    Email: string;

    @IsDate
    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    BirthDate: Date;

    @IsUUID(4)
    @Column({
        type: DataType.UUIDV4,
        allowNull: true
    })
    ProfilePhotoResourceId: string;

    @IsInt
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    MainRole: number;

    @IsUUID(4)
    @Column({
        type: DataType.UUIDV4,
        allowNull: true
    })
    RoleTableId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    IsActive: boolean;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

    @BeforeCreate
    static encryptPassword(user) {
        user.Password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(8));
    }

};
