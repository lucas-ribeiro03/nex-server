const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define("Follow", {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });

  Follow.associate = (models) => {
    Follow.belongsTo(models.Users, {
      foreignKey: "followerId",
      as: "followerUser",
    });

    Follow.belongsTo(models.Users, {
      foreignKey: "followingId",
      as: "followingUser",
    });
  };

  return Follow;
};
