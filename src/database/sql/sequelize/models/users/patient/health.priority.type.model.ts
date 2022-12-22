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
} from 'sequelize-typescript';

import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HealthPriorityType',
    tableName       : 'health_priority_types',
    paranoid        : true,
    freezeTableName : true
})
export default class HealthPriorityType extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Type: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
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
