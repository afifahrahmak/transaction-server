var express = require('express');
var router = express.Router();
const controller = require('../controllers/index');

/* GET home page. */
router.get('/', controller.findSummaryGroupByProduct);
router.get('/summary', controller.findTotalPriceSummary);
router.get('/summary-group', controller.findSummaryGroupByProduct);
router.get('/year', controller.findRawSummaryGroup)
router.patch('/orders/:order_id', controller.payOrder);

module.exports = router;
