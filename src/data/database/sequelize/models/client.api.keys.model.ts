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
    ForeignKey,
    Length
    } from 'sequelize-typescript';

import { uuid } from 'uuidv4';
import ApiClient from './api.client.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'ClientApiKey',
    tableName: 'client_api_keys',
    paranoid: true,
    freezeTableName: true
})
export default class ClientApiKey extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => { return uuid(); },
        allowNull: false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => ApiClient)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    ClientId: string;

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

};
