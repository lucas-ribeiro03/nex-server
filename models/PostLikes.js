const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const PostLikes = sequelize.define("PostLikes");

  PostLikes.associate = (models) => {
    PostLikes.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });
    PostLikes.associate = (models) =>
      PostLikes.belongsTo(models.Posts, {
        foreignKey: "postId",
      });
  };

  return PostLikes;
};
