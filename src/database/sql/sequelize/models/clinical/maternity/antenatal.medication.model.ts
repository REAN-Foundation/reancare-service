import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import AnteNatalVisit from './antenatal.visit.model';
import Pregnancy from './pregnancy.model';
import Visit from '../visit.model';
import Medication from '../medication/medication.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'AntenatalMedication',
    tableName       : 'maternity_antenatal_medications',
    paranoid        : true,
    freezeTableName : true,
})
export default class AntenatalMedication extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id:string;

    @IsUUID(4)
    @ForeignKey(() => AnteNatalVisit)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    AnteNatalVisitId: string;

    @IsUUID(4)
    @ForeignKey(() => Pregnancy)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PregnancyId: string;

    @IsUUID(4)
    @ForeignKey(() => Visit)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    VisitId: string;

    

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Name: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Given: string;

    @IsUUID(4)
    @ForeignKey(() => Medication)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    MedicationId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
