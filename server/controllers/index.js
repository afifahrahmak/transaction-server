const { Order, Product, Category } = require("../models/index");
const {
	sequelize,
	Sequelize: { Op },
} = require("../models");

module.exports = {
	async payOrder(req, res) {
		res.status(201).json({ msg: "Pay order" });
	},
};
