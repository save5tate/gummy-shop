import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [stores, setStores] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newItem, setNewItem] = useState("");

  const API = "http://localhost/shopping-app/backend/api.php";

  useEffect(() => {
    fetch(`${API}?stores`)
      .then(res => res.json())
      .then(data => {
        console.log("STORES RESPONSE:", data);
        setStores(data);
      })
      .catch(err => console.error("STORES ERROR:", err));
  }, []);
  const loadItems = (storeId) => {
    setSelectedStore(storeId);

    fetch(`${API}?store_items=${storeId}`)
      .then(res => res.json())
      .then(data => {
        console.log("ITEMS RESPONSE:", data);
        setItems(data);
      })
      .catch(err => console.error("ITEMS ERROR:", err));
  };
  const addItem = () => {
    if (!newItem.trim()) return;

    fetch(`${API}?add_item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        store_id: selectedStore,
        name: newItem,
        quantity: 1
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("ADD ITEM RESPONSE:", data);
        setNewItem("");
        loadItems(selectedStore);
      })
      .catch(err => console.error("ADD ITEM ERROR:", err));
  };

  const deleteItem = (id) => {
    fetch(`${API}?delete_item=${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        console.log("DELETE RESPONSE:", data);
        loadItems(selectedStore);
      })
      .catch(err => console.error("DELETE ERROR:", err));
  };

  return (
    <div className="container mt-4">
      <h1>Shopping App</h1>

      <div className="row mt-3">

        {/* ================= STORES ================= */}
        <div className="col-md-4">
          <h3>Stores</h3>

          {stores.length === 0 && <p>No stores found</p>}

          {stores.map(store => (
            <div
              key={store.id}
              className="card p-2 mb-2"
              style={{ cursor: "pointer" }}
              onClick={() => loadItems(store.id)}
            >
              {store.name}
            </div>
          ))}
        </div>

        {/* ================= ITEMS ================= */}
        <div className="col-md-8">
          <h3>Items</h3>

          {!selectedStore && <p>Select a store</p>}

          {selectedStore && (
            <>
              <div className="d-flex mb-3">
                <input
                  className="form-control"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Enter item name"
                />
                <button className="btn btn-primary ms-2" onClick={addItem}>
                  Add
                </button>
              </div>

              {items.length === 0 && <p>No items found</p>}

              {items.map(item => (
                <div key={item.id} className="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    {item.name} (x{item.quantity})
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;