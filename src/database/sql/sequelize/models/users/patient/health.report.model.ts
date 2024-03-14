import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID,
    Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HealthReport',
    tableName       : 'patient_health_reports',
    paranoid        : true,
    freezeTableName : true,
})
export default class HealthReport extends Model {

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

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Preference: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
