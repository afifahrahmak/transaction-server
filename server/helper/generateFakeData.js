const faker = require("faker");
const fs = require("fs");

function randomDate(start, end) {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
}

function generateFakeUser(num) {
	const users = [];
	for (let i = 0; i < num; i++) {
		const first_name = faker.name.firstName();
		const last_name = faker.name.lastName();
		users.push({
			id: i + 1,
			first_name,
			last_name,
			email: faker.internet.email(first_name, last_name),
			password: faker.internet.password(),
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
	return users;
}

const totalUser = 5;
const totalCategory = 4;
const totalProduct = 8;

function generateFakeCategory(num) {
	const categories = [];
	for (let i = 0; i < num; i++) {
		const category = faker.commerce.productAdjective();
		categories.push({
			id: i + 1,
			name: category,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
	return categories;
}

function generateFakeProduct(num, categories) {
	const products = [];

	for (let i = 0; i < num; i++) {
		const product = faker.commerce;
		const categoryIndex = getRandomInt(totalCategory);
		products.push({
			id: i + 1,
			name: product.productName(),
			description: product.productDescription(),
			price: Number(product.price()),
			category_id: categories[categoryIndex].id,
			stock: 20,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
	return products;
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function generateFakeOrder(num, users, products, categories) {
	const orders = [];
	for (let i = 1; i <= num; i++) {
		const userIndex = getRandomInt(totalUser);
		const productIndex = getRandomInt(totalProduct);
		const quantity = getRandomInt(3) + 1;
		const currentOrder = {
			id: i,
			user_id: users[userIndex].id,
			product_id: products[productIndex].id,
			quantity: quantity,
			total_price: quantity * products[productIndex].price,
			is_paid: true,
			order_date: randomDate(new Date(2020, 0, 1), new Date()),
			paid_date: new Date(),
			created_at: new Date(),
			updated_at: new Date(),
		};
		orders.push(currentOrder);
	}
	return orders;
}

const users = generateFakeUser(totalUser);
const categories = generateFakeCategory(totalCategory);
const products = generateFakeProduct(totalProduct, categories);
const orders = generateFakeOrder(12, users, products, categories);

fs.writeFileSync("./db/seeders/user-seeder.js", JSON.stringify(users, null, 2));
fs.writeFileSync(
	"./db/seeders/product-seeder.js",
	JSON.stringify(products, null, 2)
);
fs.writeFileSync(
	"./db/seeders/categories-seeder.js",
	JSON.stringify(categories, null, 2)
);
fs.writeFileSync(
	"./db/seeders/orders-seeder.js",
	JSON.stringify(orders, null, 2)
);
