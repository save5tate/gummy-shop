import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import orbLogo from "./assets/orb-hut.png";

function App() {
  const API = "http://localhost/shopping-app/backend/api.php";

  const [stores, setStores] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetch(`${API}?stores`)
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error(err));
  }, []);

  const loadItems = (storeId) => {
    setSelectedStore(storeId);

    fetch(`${API}?store_items=${storeId}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  };

  const addItem = () => {
    if (!newItem.trim()) return;

    fetch(`${API}?add_item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        store_id: selectedStore,
        name: newItem,
        quantity: 1,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewItem("");
        loadItems(selectedStore);
      })
      .catch((err) => console.error(err));
  };

  const deleteItem = (id) => {
    fetch(`${API}?delete_item=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => loadItems(selectedStore))
      .catch((err) => console.error(err));
  };

  const toggleChecked = (item) => {
    fetch(`${API}?update_item=${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: item.name,
        quantity: item.quantity,
        checked: item.checked == 1 ? 0 : 1,
      }),
    })
      .then((res) => res.json())
      .then(() => loadItems(selectedStore))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-4 app-wrapper">
      {/* LOGO */}
      <div className="text-center mb-4">
        <img
          src={orbLogo}
          alt="Orb Hut"
          style={{
            maxWidth: "400px",
            width: "100%",
            height: "auto",
            filter: "drop-shadow(3px 3px 0px black)",
          }}
        />
      </div>

      <div className="row">
        {/* STORES */}
        <div className="col-md-4">
          <h3>Shops</h3>

          <div style={{ marginBottom: "10px" }}>
            House of Orbs
          </div>

          {stores.length === 0 && <p>No stores found</p>}

          {stores.map((store) => (
            <div
              key={store.id}
              className="card p-2 mb-2 hover-blink"
              onClick={() => loadItems(store.id)}
            >
              {store.name}
            </div>
          ))}
        </div>

        {/* ITEMS */}
        <div className="col-md-8">
          <h3>Orbs</h3>

          {!selectedStore && <p>Select a shop</p>}

          {selectedStore && (
            <>
              <div className="d-flex mb-3">
                <input
                  className="form-control"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Enter orb name..."
                />
                <button
                  className="btn btn-warning ms-2 hover-blink"
                  onClick={addItem}
                >
                  Add Orb
                </button>
              </div>

              {items.length === 0 && <p>No orbs found</p>}

              {items.map((item) => (
                <div
                  key={item.id}
                  className="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center hover-blink"
                >
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={item.checked == 1}
                      onChange={() => toggleChecked(item)}
                      style={{ marginRight: "10px" }}
                    />

                    <span
                      style={{
                        textDecoration:
                          item.checked == 1 ? "line-through" : "none",
                        opacity: item.checked == 1 ? 0.5 : 1,
                      }}
                    >
                      {item.name} (x{item.quantity})
                    </span>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    Remove
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