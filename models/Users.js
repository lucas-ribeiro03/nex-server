const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Posts, {
      foreignKey: "userId",
      as: "posts",
    });
    Users.associate = (models) =>
      Users.hasMany(models.Comments, {
        foreignKey: "userId",
      });

    Users.hasMany(models.PostLikes, {
      foreignKey: "userId",
    });

    Users.belongsToMany(models.Users, {
      through: models.Follow,
      as: "following",
      foreignKey: "followerId",
      otherKey: "followingId",
    });

    Users.belongsToMany(models.Users, {
      through: models.Follow,
      as: "followers",
      foreignKey: "followingId",
      otherKey: "followerId",
    });

    Users.hasMany(models.Notifications, {
      foreignKey: "receiverId",
      as: "receivedNotifications",
    });

    Users.hasMany(models.Notifications, {
      foreignKey: "senderId",
      as: "sentNotifications",
    });
  };
  return Users;
};
