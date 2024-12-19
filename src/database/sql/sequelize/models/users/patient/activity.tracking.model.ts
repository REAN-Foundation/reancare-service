import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsUUID,
    Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PatientActivityTracker',
    tableName       : 'activity_trackers',
    paranoid        : true,
    freezeTableName : true,
})
export default class PatientActivityTracker extends Model {

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
        unique    : true
    })
    PatientUserId: string;

    @BelongsTo(() => User)
    User: User;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    LastLoginDate: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    LastVitalUpdateDate: Date;

    @Column({
        type         : DataType.TEXT,
        defaultValue : null,
        allowNull    : true,
    })
    UpdatedVitalDetails: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    LastUserTaskDate: Date;

    @Column({
        type         : DataType.TEXT,
        defaultValue : null,
        allowNull    : true,
    })
    UserTaskDetails: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    LastActivityDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
