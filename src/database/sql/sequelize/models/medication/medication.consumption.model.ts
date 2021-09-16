import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    PrimaryKey,
    Length,
    IsInt,
    IsUUID,
    ForeignKey,
    IsDecimal,
    IsDate,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../user.model';
import Drug from './drug.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'MedicationConsumption',
    tableName       : 'medication_consumptions',
    paranoid        : true,
    freezeTableName : true,
})
export default class MedicationConsumption extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    MedicationId: string;
   
    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    DrugName: string; //This is brand-name

    @IsUUID(4)
    @ForeignKey(() => Drug)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    DrugId: string;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Dose: number;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Details: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    TimeScheduleStart: Date

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    TimeScheduleEnd: Date

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    TakenAt: Date

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsTaken: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsMissed: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsCancelled: boolean;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    CancelledOn: Date

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Note: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
