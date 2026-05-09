import { useEffect, useState } from "react";
import api from "../api/api";

export default function HomeExpenses() {
  const [items, setItems] = useState([]);

  const [f, setF] = useState({
    expenseDate: "",
    category: "",
    amount: "",
    description: "",
  });

  const load = () => {
    api.get("/home-expenses").then((r) => setItems(r.data.data));
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    await api.post("/home-expenses", {
      ...f,
      amount: Number(f.amount),
    });

    setF({
      expenseDate: "",
      category: "",
      amount: "",
      description: "",
    });

    load();
  };

  const sortedItems = [...items].sort(
    (a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)
  );

  return (
    <>
      <h2>Home Expenses</h2>

      <form onSubmit={save} className="card p-3 mb-3 row g-2">
        <div className="col">
          <input
            className="form-control"
            type="date"
            value={f.expenseDate}
            onChange={(e) => setF({ ...f, expenseDate: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <input
            className="form-control"
            placeholder="Category"
            value={f.category}
            onChange={(e) => setF({ ...f, category: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <input
            className="form-control"
            type="text"
            inputMode="numeric"
            placeholder="Amount"
            value={f.amount}
            onChange={(e) => setF({ ...f, amount: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <input
            className="form-control"
            placeholder="Description"
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
          />
        </div>

        <div className="col">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <div className="table-responsive card p-2">
        <table className="table table-bordered table-hover align-middle mb-0 w-100">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>S.No</th>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {sortedItems.map((x, index) => (
              <tr key={x.id}>
                <td>{index + 1}</td>
                <td>{x.expenseDate}</td>
                <td>{x.category}</td>
                <td>₹{x.amount}</td>
                <td>{x.description || "-"}</td>
              </tr>
            ))}

            {sortedItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No home expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}