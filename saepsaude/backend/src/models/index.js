import { sequelize } from "../config/database.js";
import { User } from "./User.js";
import { Company } from "./Company.js";
import { Activity } from "./Activity.js";
import { Like } from "./Like.js";
import { Comment } from "./Comment.js";

User.hasMany(Activity, { foreignKey: "userId", onDelete: "CASCADE" });
Activity.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Like, { foreignKey: "userId", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "userId" });

Activity.hasMany(Like, { foreignKey: "activityId", onDelete: "CASCADE" });
Like.belongsTo(Activity, { foreignKey: "activityId" });

User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

Activity.hasMany(Comment, { foreignKey: "activityId", onDelete: "CASCADE" });
Comment.belongsTo(Activity, { foreignKey: "activityId" });

export { sequelize, User, Company, Activity, Like, Comment };
