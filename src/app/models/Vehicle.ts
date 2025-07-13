import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/database';
import { VehicleAttributes, VehicleCreationAttributes, VehicleStatus } from '../types';

class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: number;
  public name!: string;
  public plate!: string;
  public status!: VehicleStatus;
  public userId!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public getUser?: any;
  public setUser?: any;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: 'Name must be between 2 and 100 characters',
        },
        notEmpty: {
          msg: 'Name cannot be empty',
        },
      },
    },
    plate: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [7, 10],
          msg: 'Plate must be between 7 and 10 characters',
        },
        notEmpty: {
          msg: 'Plate cannot be empty',
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: {
          args: [['active', 'inactive']],
          msg: 'Status must be either active or inactive',
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['plate'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Vehicle;