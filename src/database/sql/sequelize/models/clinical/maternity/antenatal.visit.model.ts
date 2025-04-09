import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Pregnancy from './pregnancy.model';
import Visit from '../visit.model';
import BodyWeight from '../biometrics/body.weight.model';
import BodyTemperature from '../biometrics/body.temperature.model';
import BloodPressure from '../biometrics/blood.pressure.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'AnteNatalVisit',
    tableName       : 'maternity_antenatal_visits',
    paranoid        : true,
    freezeTableName : true,
})
export default class AnteNatalVisit extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Visit)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    VisitId: string;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    ExternalVisitId: string;

    @IsUUID(4)
    @ForeignKey(() => Pregnancy)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PregnancyId: string;


    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    DateOfVisit: Date;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    GestationInWeeks: number;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    FetalHeartRateBPM: number;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    FundalHeight: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    DateOfNextVisit: Date;

    @IsUUID(4)
    @ForeignKey(() => BodyWeight)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    BodyWeightID: string;

    @IsUUID(4)
    @ForeignKey(() => BodyTemperature)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    BodyTemperatureId: string;

    @IsUUID(4)
    @ForeignKey(() => BloodPressure)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    BloodPressureId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
