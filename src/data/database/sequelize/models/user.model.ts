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
import * as bcrypt from 'bcryptjs';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    freezeTableName: true
})
export default class User extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => { return uuid(); },
        allowNull: false
    })
    id: string;

    @Length({ min: 1, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: ''
    })
    Prefix: string;

    @Length({ min: 1, max: 70})
    @Column({
        type: DataType.STRING(70),
        allowNull: false,
    })
    FirstName: string;

    @Length({ min: 1, max: 70})
    @Column({
        type: DataType.STRING(70),
        allowNull: true,
    })
    MiddleName: string;

    @Length({ min: 1, max: 70})
    @Column({
        type: DataType.STRING(70),
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
        allowNull: true
    })
    BirthDate: Date;

    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    ImageResourceId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    IsActive: boolean;

    @IsDate
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    LastLogin: Date;

    @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: '+05:30'
    })
    DefaultTimeZone: string;

    @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: '+05:30'
    })
    CurrentTimeZone: string;
    
    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

    @BeforeCreate
    static encryptPassword(user) {
        if(user.Password != null) {
            user.Password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(8));
        }
    }
};
