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
    modelName       : 'BloodGlucose',
    tableName       : 'biometrics_blood_glucose',
    paranoid        : true,
    freezeTableName : true
})
export default class BloodGlucose extends Model {

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
        allowNull : true,
    })
    PatientUserId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    TerraSummaryId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Provider: string;

    // @IsUUID(4)
    // @ForeignKey(() => Encounter)
    // @Column({
    //     type      : DataType.UUID,
    //     allowNull : true,
    // })
    // EncounterId: string;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : false,
        validate  : {
            min : 10,
            max : 1000
        }
    })
    BloodGlucose: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    A1CLevel: number;

    @Length({ max: 8 })
    @Column({
        type         : DataType.STRING(8),
        allowNull    : false,
        defaultValue : 'mg/dL'
    })
    Unit: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    RecordDate: Date;

    @IsUUID(4)
    @ForeignKey(() => User)
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
