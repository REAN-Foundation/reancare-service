import {
    Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CareplanEnrollment',
    tableName       : 'careplan_enrollments',
    paranoid        : true,
    freezeTableName : true,
})
export default class Enrollment extends Model {

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
        type      : DataType.STRING(64),
        allowNull : false,
    })
    UserId: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    EnrollmentId: number;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    ParticipantId: number;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    CareplanCode: string;

    @Column({
        type         : DataType.STRING(64),
        allowNull    : false,
        defaultValue : "AHA"
    })
    CareplanProvider: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    CareplanName: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    StartDate: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    EndDate: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : true
    })
    IsActive: boolean;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Name: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
