import {
    Column, CreatedAt, DataType, DeletedAt,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Location',
    tableName       : 'User_locations',
    paranoid        : true,
    freezeTableName : true
})
export default class Location extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    PatientUserId: string;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    City: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Longitude: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Lattitude: number;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    CurrentTimezone: string;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
        defaultValue : true
    })
    IsActive: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
