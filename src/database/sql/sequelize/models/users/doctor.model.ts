import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import Person from '../person/person.model';
import User from './user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Doctor',
    tableName       : 'doctors',
    paranoid        : true,
    freezeTableName : true,
})
export default class Doctor extends Model {

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

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PersonId: string;

    @Length({ min: 4, max: 24 })
    @Column({
        type      : DataType.STRING(24),
        allowNull : false,
    })
    DisplayId: string;

    // @Length({ min: 4, max: 16})
    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    NationalDigiDoctorId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    EhrId: string;

    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    About: string;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    Locality: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Qualifications: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    PractisingSince: Date;

    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    Specialities: string;

    @Column({
        type      : DataType.STRING(2048),
        allowNull : true,
    })
    ProfessionalHighlights: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    ConsultationFee: number;

    @BelongsTo(() => User)
    User: User;

    @BelongsTo(() => Person)
    Person: Person;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
