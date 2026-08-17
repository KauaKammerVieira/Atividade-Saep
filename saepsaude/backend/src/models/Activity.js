import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Activity = sequelize.define("Activity", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tipo: {
    type: DataTypes.ENUM("corrida", "caminhada", "trilha"),
    allowNull: false
  },
  distanciaMetros: { type: DataTypes.INTEGER, allowNull: false },
  duracaoMinutos: { type: DataTypes.INTEGER, allowNull: false },
  calorias: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: "atividades", timestamps: true });
