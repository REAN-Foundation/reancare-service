import {
    Column, CreatedAt, DataType, DeletedAt, HasMany, HasOne, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import AnteNatalVisit from './antenatal.visit.model';
import Delivery from './delivery.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Pregnancy',
    tableName       : 'maternity_pregnancies',
    paranoid        : true,
    freezeTableName : true,
})
export default class Pregnancy extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id:string;

    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    ExternalPregnancyId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    DateOfLastMenstrualPeriod: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    EstimatedDateOfChildBirth: Date;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    Gravidity: number;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    Parity: number;

    @HasMany(() => AnteNatalVisit)
    AnteNatalVisits: AnteNatalVisit[];

    @HasOne(() => Delivery)
    Delivery: Delivery;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
