const { Order, Product, Category } = require("../models/index");
const {
	sequelize,
	Sequelize: { Op },
} = require("../models");

module.exports = {
	findTotalOrderPrice(req, res) {
		Order.findOne({
			attributes: [[sequelize.fn("SUM", sequelize.col("total_price")), "total"]],
		})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	},
	findOrders(req, res) {
		Order.findAll({
			where: {
				quantity: {
					[Op.gte]: 3,
				},
			},
		})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	},
	findTotalPriceSummary(req, res) {},
	findSummaryGroupByProduct(req, res) {
		sequelize
			.query(
				`SELECT "Order"."product_id" AS "productId",
    SUM("total_price") AS "sumPrice", 
    SUM("quantity") AS "sumQty", 
    "Product"."id" AS "Product.id", 
    "Product"."name" AS "Product.name" 
    FROM "orders" AS "Order" 
    LEFT OUTER JOIN "products" AS "Product" 
    ON "Order"."product_id" = "Product"."id" 
    GROUP BY "productId", "Product"."id";`,
				{
					logging: console.log,

					// If plain is true, then sequelize will only return the first
					// record of the result set. In case of false it will return all records.
					plain: false,

					// Set this to true if you don't have a model definition for your query.
					raw: true,

					// The type of query you are executing. The query type affects how results are formatted before they are passed back.
					type: sequelize.QueryTypes.SELECT,
				}
			)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json(err);
			});
		// Order
		//   .findAll({
		//     attributes: [
		//       'productId',
		//       [sequelize.fn("SUM", sequelize.col('total_price')), 'sumPrice'],
		//       [sequelize.fn("SUM", sequelize.col('quantity')), 'sumQty'],
		//     ],
		//     include: {
		//       model: Product,
		//       attributes: ['id', 'name']
		//     },
		//     group: ['productId', "Product.id"]
		//   })
		//   .then(data => res.status(200).json(data))
		//   .catch(err => res.status(500).json(err))
	},
	findOrderOnYear(req, res) {},
	findRawSummaryGroup(req, res) {},

	async payOrder(req, res) {
		// your code here
		/*
			cek ordernya ada atau ngga
			kalo ada cek product ada atau ngga
			kalo product ada cek stock
			kalo stock cukup
			update is paidnya jadi true
			update paid_date nya
			ambil qty
			kalo ada kurangi stock - qty
			selesai
		*/

		// const t = await sequelize.transaction();
		try {
			await Product.bulkCreate(
				[
					{ id: 1, name: "Awesome Rubber Mouse edited", stock: 22 },
					{ id: 2, name: "Generic Frozen Chair edited", stock: 22 },
					{ name: "new product", stock: 10, description: "test" },
				],
				{
					updateOnDuplicate: ["name", "stock"],
				}
			);
			res.status(200).json({ msg: "pembayaran berhasil" });
		} catch (error) {
			res.status(500).json(error);
		}
	},

	async _(req, res) {
		const orderId = req.params.order_id;
		const t = await sequelize.transaction();

		try {
			const order = await Order.findByPk(orderId);
			if (!order) {
				throw new Error("Order does not exist");
			}
			if (order.isPaid) {
				throw new Error("Product already paid");
			}
			const product = await Product.findByPk(order.productId);
			if (product.stock < order.quantity) {
				throw new Error("Product stock is not enough");
			}
			const updatedOrder = await Order.update(
				{
					isPaid: true,
					paidDate: new Date(),
				},
				{
					where: {
						id: orderId,
					},
					transaction: t,
					returning: true,
				}
			);

			await Product.update(
				{
					stock: product.stock - order.quantity,
				},
				{
					where: {
						id: order.productId,
					},
					transaction: t,
				}
			);

			await t.commit();
			res.status(200).json({ msg: "pembayaran berhasil" });
		} catch (error) {
			await t.rollback();
			res.status(500).json({ error });
		}
		/**
		 *
		 * 1. perlu tau param order_id
		 * 2. find Order berdasar order_id (quantity, isPaid, productId)
		 *    -> isPaid udah true gausah lanjut
		 * 3. find Product -> productId order, (stock)
		 *    -> jika stocknya kurang dari order quantity gausah lanjut
		 * 4. update order -> isPaid true
		 * 5. update product -> kurangi stocknya
		 * 6. commit
		 * 7. kalo gagal rollback
		 */
	},
};
