const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const CommentLikes = sequelize.define("CommentLikes");

  CommentLikes.associate = (models) => {
    CommentLikes.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });
    CommentLikes.associate = (models) =>
      CommentLikes.belongsTo(models.Comments, {
        foreignKey: "commentId",
      });
  };

  return CommentLikes;
};
