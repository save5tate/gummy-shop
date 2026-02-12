import React, { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/items")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cardNumber, expiration, cvv })
    });

    const data = await response.json();

    if (data.success) {
      setMessage("🎉 Payment Successful!");
    } else {
      setMessage("❌ Invalid Payment Information");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🍬 Gummy Candy Shop 🍬</h1>

      {!selectedItem && (
        <>
          {items.map(item => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <button onClick={() => setSelectedItem(item)}>
                Buy Now
              </button>
              <hr />
            </div>
          ))}
        </>
      )}

      {selectedItem && (
        <div>
          <h2>Checkout: {selectedItem.name}</h2>

          <form onSubmit={handleCheckout}>
            <input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            /><br /><br />

            <input
              placeholder="MM/YY"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
            /><br /><br />

            <input
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            /><br /><br />

            <button type="submit">Complete Purchase</button>
          </form>

          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
