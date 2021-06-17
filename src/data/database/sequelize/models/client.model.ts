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

import { UUIDV4 } from 'sequelize';
import * as bcrypt from 'bcryptjs';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Client',
    tableName: 'clients',
    paranoid: true,
    freezeTableName: true
})
export class Client extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: UUIDV4,
        allowNull: false
    })
    id: string;

    @Length({ min: 1, max: 64})
    @Column({
        type: DataType.STRING(64),
        allowNull: false,
    })
    ClientName: string;

    @Length({ min: 1, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
    })
    ClientCode: string;

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

    @Length({ min: 16, max: 256})
    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    APIKey: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    ValidFrom: Date;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
    })
    ValidTo: Date;

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
    static encryptPassword(client) {
        client.Password = bcrypt.hashSync(client.Password, bcrypt.genSaltSync(8));
    }

};
