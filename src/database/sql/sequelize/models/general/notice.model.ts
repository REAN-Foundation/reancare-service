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
} from 'sequelize-typescript';

import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Notice',
    tableName       : 'notices',
    paranoid        : true,
    freezeTableName : true,
})
export default class Notice extends Model {

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
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Link: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    PostDate: Date;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    DaysActive: number;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndDate: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : true
    })
    IsActive: boolean;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Tags: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ImageUrl: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Action: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
