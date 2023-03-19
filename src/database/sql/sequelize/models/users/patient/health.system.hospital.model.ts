import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey,IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import HealthSystem from './health.system.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HealthSystemHospital',
    tableName       : 'health_system_hospitals',
    paranoid        : true,
    freezeTableName : true
})
export default class HealthSystemHospital extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => HealthSystem)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    HealthSystemId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Name: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
