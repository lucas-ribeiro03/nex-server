const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });
    Comments.associate = (models) =>
      Comments.belongsTo(models.Posts, {
        foreignKey: "postId",
      });
  };

  return Comments;
};
