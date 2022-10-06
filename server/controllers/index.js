const { Order, Product, Category } = require("../models/index");
const {
	sequelize,
	Sequelize: { Op },
} = require("../models");

module.exports = {
	async payOrder(req, res) {
		const orderId = req.params.orderId;
		const t = await sequelize.transaction();

		try {
			// find order
			const order = await Order.findByPk(orderId, { transaction: t });
			if (!order) {
				throw new Error("Order does not exist");
			}
			if (order.isPaid) {
				throw new Error("Product already paid");
			}

			// find product
			const product = await Product.findByPk(order.productId, {
				transaction: t,
			});
			if (product.stock < order.quantity) {
				throw new Error("Product stock is not enough");
			}

			// update idPaid order
			await Order.update(
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

			// update product stock
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
	},
};
