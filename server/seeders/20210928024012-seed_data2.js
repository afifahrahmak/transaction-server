"use strict";
const fs = require("fs");
module.exports = {
	up: async (queryInterface, Sequelize) => {
		const users = JSON.parse(fs.readFileSync("./db/seeders/user-seeder.js"));
		console.log(
			"🚀 ~ file: 20210928024012-seed_data2.js ~ line 6 ~ up: ~ users",
			users
		);
		const categories = JSON.parse(
			fs.readFileSync("./db/seeders/categories-seeder.js")
		);
		const products = JSON.parse(
			fs.readFileSync("./db/seeders/product-seeder.js")
		);
		const orders = JSON.parse(fs.readFileSync("./db/seeders/orders-seeder.js"));

		await queryInterface.bulkInsert("users", users, {});
		await queryInterface.bulkInsert("categories", categories, {});
		await queryInterface.bulkInsert("products", products, {});
		await queryInterface.bulkInsert("orders", orders, {});
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("users", null, {});
		await queryInterface.bulkDelete("categories", null, {});
		await queryInterface.bulkDelete("products", null, {});
		await queryInterface.bulkDelete("orders", null, {});
	},
};
