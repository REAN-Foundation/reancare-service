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
    ForeignKey,
    IsDate,
    IsDecimal,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'BloodOxygenSaturation',
    tableName       : 'biometrics_blood_oxygen_saturation',
    paranoid        : true,
    freezeTableName : true
})
export default class BloodOxygenSaturation extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : false,
        validate  : {
            min : 10,
            max : 100
        }
    })
    BloodOxygenSaturation: number;

    @Length({ min: 1, max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        defaultValue : '%'
    })
    Unit: string;

    @IsDate
    @Column({
        type      : DataType.DATE(),
        allowNull : true
    })
    RecordDate: Date;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true
    })
    RecordedByUserId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

    EhrId: string;

    PatientId: string;

}
