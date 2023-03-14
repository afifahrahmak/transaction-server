const { Order, Product, Category } = require("../models/index");
const {
	sequelize,
	Sequelize: { Op },
} = require("../models");

module.exports = {
	async payOrder(req, res) {
		const t = sequelize.transaction()
		try {
			const { orderId } = req.params
			const order = await Order.findByPk(orderId, { include: Product, transaction: t })
			if (!order) throw { status: 404, msg: 'Order not found' }
			if (order.isPaid) throw { status: 400, msg: 'Order has already been paid' }
			if (order.Product.stock < order.quantity) throw { status: 400, msg: 'Product stock not available' }

			await Order.update(
				{ isPaid: true, paidDate: new Date() },
				{ where: { id: orderId }, transaction: t }
			)
			await Product.decrement('stock', { by: Order.quantity, where: { id: order.Product.id, transaction: t } })
			await t.commit()
			res.status(200).json({ msg: `Pay order with ID ${orderId} success` });
		} catch (error) {
			await t.rollback()
			if (error.status) {
				res.status(error.status).json(error.msg)
			} else {
				res.status(500).json({ msg: 'Internal Server Error' })
			}
		}
	}
};
