module.exports = function(sequelize, DataTypes) {
	var Label = sequelize.define('Label', {
		name: DataTypes.TEXT
	})
	return Label
}
