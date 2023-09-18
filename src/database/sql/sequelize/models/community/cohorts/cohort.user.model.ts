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
    ForeignKey,
    BelongsTo
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Cohort from './cohort.model';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CohortUser',
    tableName       : 'cohort_users',
    paranoid        : true,
    freezeTableName : true
})
export default class CohortUser extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @BelongsTo(() =>  User)
    User:  User;

    @IsUUID(4)
    @ForeignKey(() => Cohort)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    CohortId: string;

    @BelongsTo(() =>  Cohort)
    Cohort:  Cohort;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
