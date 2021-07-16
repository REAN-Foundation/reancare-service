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
    BeforeCreate,
    IsEmail,
} from 'sequelize-typescript';

import { uuid } from 'uuidv4';
import * as bcrypt from 'bcryptjs';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'ApiClient',
    tableName: 'api_clients',
    paranoid: true,
    freezeTableName: true,
})
export default class ApiClient extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => {
            return uuid();
        },
        allowNull: false,
    })
    id: string;

    @Length({ min: 1, max: 64 })
    @Column({
        type: DataType.STRING(64),
        allowNull: false,
    })
    ClientName: string;

    @Length({ min: 1 })
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: 'MobileApp',
    })
    ClientInterfaceType: string;
    
    @Length({ min: 1, max: 16 })
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
    })
    ClientCode: string;

    @Length({ min: 6, max: 256 })
    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Password: string;

    @Length({ min: 10, max: 16 })
    @Column({
        type: DataType.STRING(16),
        allowNull: true,
    })
    Phone: string;

    @Length({ min: 3, max: 128 })
    @IsEmail
    @Column({
        type: DataType.STRING(128),
        allowNull: true,
    })
    Email: string;

    @Length({ min: 8, max: 512})
    @Column({
        type: DataType.STRING(512),
        allowNull: true,
    })
    ApiKey: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    ValidFrom: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    ValidTill: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
}
