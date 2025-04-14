const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });

    Posts.hasMany(models.Comments, {
      foreignKey: "postId",
    });

    Posts.hasMany(models.PostLikes, {
      foreignKey: "postId",
      as: "likes",
    });
  };

  return Posts;
};
