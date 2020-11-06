/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('games', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'games',
    timestamps: false
  });
};
