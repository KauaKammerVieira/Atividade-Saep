import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Company = sequelize.define("Company", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING(120), allowNull: false },
  logo: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "/assets/SAEPSaude.png" }
}, { tableName: "empresa", timestamps: true });
