import {
    Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CareplanParticipant',
    tableName       : 'careplan_participants',
    paranoid        : true,
    freezeTableName : true,
})
export default class CareplanParticipant extends Model {

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
        type      : DataType.STRING(64),
        allowNull : false,
    })
    ParticipantId: string;

    @Column({
        type         : DataType.STRING(64),
        allowNull    : false,
        defaultValue : "AHA"
    })
    Provider: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Name: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    Gender: string;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    IsActive: boolean;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Age: number;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    Dob: Date;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Height: number;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Weight: number;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    MaritalStatus: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    ZipCode: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
