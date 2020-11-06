/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('artist', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'games',
        key: 'id'
      }
    }
  }, {
    tableName: 'artist',
    timestamps: false
  });
};
