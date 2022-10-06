"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Orders extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Orders.belongsTo(models.Product, {
				foreignKey: "product_id",
			});
		}
	}
	Orders.init(
		{
			userId: DataTypes.INTEGER,
			productId: DataTypes.INTEGER,
			quantity: DataTypes.INTEGER,
			totalPrice: DataTypes.INTEGER,
			isPaid: DataTypes.BOOLEAN,
			orderDate: DataTypes.DATE,
			paidDate: DataTypes.DATE,
			paidDate: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Order",
			underscored: true,
		}
	);
	return Orders;
};
