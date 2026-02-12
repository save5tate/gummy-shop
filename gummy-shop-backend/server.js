const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const items = [
  { id: 1, name: "Gummy Sharks", price: 4.99 },
  { id: 2, name: "Gummy Frogs", price: 3.99 },
  { id: 3, name: "Gummy Worms", price: 2.99 },
  { id: 4, name: "Peach Rings", price: 3.49 }
];

app.get("/items", (req, res) => {
  res.json(items);
});

app.post("/checkout", (req, res) => {
  const { cardNumber, expiration, cvv } = req.body;

  const cardValid = /^\d{16}$/.test(cardNumber);
  const expirationValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration);
  const cvvValid = /^\d{3}$/.test(cvv);

  if (cardValid && expirationValid && cvvValid) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
