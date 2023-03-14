const { Order, Product, Category } = require("../models/index");
const {
	sequelize,
	Sequelize: { Op },
} = require("../models");

module.exports = {
	async payOrder(req, res) {
		const t = await sequelize.transaction();
		try {
			const { orderId } = req.params
			const order = await Order.findByPk(orderId, { include: Product, transaction: t })
			if (!order) throw { msg: 'Order not found' }
			if (order.isPaid) throw { msg: 'Order has already been paid' }
			if (order.Product.stock < order.quantity) throw { msg: 'Product stock not available' }

			await Order.update(
				{ isPaid: true, paidDate: new Date() },
				{ where: { id: orderId }, transaction: t }
			)
			await Product.decrement('stock', { by: Order.quantity, where: { id: order.Product.id, transaction: t } })
			await t.commit()
			res.status(200).json({ msg: `Pay order with ID ${orderId} success` });
		} catch (error) {
			console.log(error);
			await t.rollback()
			res.status(500).json(error)
		}
	}
};
