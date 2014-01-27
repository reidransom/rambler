module.exports = function(sequelize, DataTypes) {
	var Note = sequelize.define('Note', {
		body: DataTypes.TEXT
	})
	return Note
}
