import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import Pregnancy from './pregnancy.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Vaccination',
    tableName       : 'maternity_vaccinations',
    paranoid        : true,
    freezeTableName : true,
})
export default class Vaccination extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Pregnancy)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PregnancyId: string;
    

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    VaccineName: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    DoseNumber: number;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    DateAdministered: Date;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    MedicationId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    MedicationConsumptionId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
