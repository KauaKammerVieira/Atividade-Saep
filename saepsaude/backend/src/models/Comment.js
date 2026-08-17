import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  texto: { type: DataTypes.STRING(500), allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  activityId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: "comentarios", timestamps: true });
