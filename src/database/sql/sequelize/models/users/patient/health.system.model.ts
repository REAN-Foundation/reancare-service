import {
    Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HealthSystem',
    tableName       : 'health_systems',
    paranoid        : true,
    freezeTableName : true
})
export default class HealthSystem extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Name: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Tags: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
