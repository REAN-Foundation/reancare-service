import {
    Column, CreatedAt, DataType, DeletedAt, IsUUID,
    Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'LabRecordType',
    tableName       : 'lab_record_types',
    paranoid        : true,
    freezeTableName : true,
})
export default class LabRecordType extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false,
    })
    id: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    TypeName: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    DisplayName: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    SnowmedCode: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    LoincCode: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    NormalRangeMin: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    NormalRangeMax: number;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Unit: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
