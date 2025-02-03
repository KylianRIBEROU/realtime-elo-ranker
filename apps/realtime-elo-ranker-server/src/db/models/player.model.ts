import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Player extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1000,
    })
    rank: number;
}
