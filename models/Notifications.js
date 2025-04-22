const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define("Notifications", {
    notificationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Users, {
      foreignKey: "receiverId",
      as: "receiver",
    });
    Notifications.belongsTo(models.Users, {
      foreignKey: "senderId",
      as: "sender",
    });
    Notifications.belongsTo(models.Posts, {
      foreignKey: "postId",
      as: "post",
    });
  };

  return Notifications;
};
