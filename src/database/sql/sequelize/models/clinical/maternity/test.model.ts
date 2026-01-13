import { v4 } from 'uuid';
import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import Pregnancy from './pregnancy.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Test',
    tableName       : 'maternity_tests',
    paranoid        : true,
    freezeTableName : true,
})
export default class Test extends Model {

    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false,
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
    TestName: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Type: string;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    Impression: string;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    Parameters: any;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    DateOfTest: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
