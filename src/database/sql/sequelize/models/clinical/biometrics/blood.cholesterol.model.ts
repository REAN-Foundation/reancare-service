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
    BelongsTo,
    IsDecimal,
    IsDate } from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import Person from '../../person/person.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'BloodCholesterol',
    tableName       : 'biometrics_blood_cholesterol',
    paranoid        : true,
    freezeTableName : true
})
export default class BloodCholesterol extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @Length({ min: 2, max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PersonId: string;

    @BelongsTo(() => Person)
    Person: Person;

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
        allowNull : true,
    })
    TotalCholesterol: number;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    HDL: number;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    LDL: number;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    TriglycerideLevel: number;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Ratio: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    A1CLevel: number;

    @Length({ max: 8 })
    @Column({
        type         : DataType.STRING(8),
        allowNull    : true,
        defaultValue : 'mg/dl'
    })
    Unit: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    RecordDate: Date;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    RecordedByUserId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
