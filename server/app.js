const express = require("express");
const app = express();
const Controller = require("./controllers");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.status(200).json({ msg: "Hello world" }));
app.put("/payOrder/:orderId", Controller.payOrder);
app.get("/orders", Controller.getOrders);
app.get("/products", Controller.getProducts);

app.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
});
