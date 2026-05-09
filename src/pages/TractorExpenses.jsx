import { useEffect, useState } from "react";
import api from "../api/api";

export default function TractorExpenses() {
  const [items, setItems] = useState([]);

  const [f, setF] = useState({
    expenseDate: "",
    category: "",
    amount: "",
    description: "",
  });

  const [filter, setFilter] = useState({
    month: "",
    category: "",
  });

  const load = () => {
    api.get("/tractor-expenses").then((r) => setItems(r.data.data));
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    await api.post("/tractor-expenses", {
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

  const filteredItems = [...items]
    .filter((x) => {
      const expenseMonth = x.expenseDate ? x.expenseDate.slice(5, 7) : "";

      return (
        (filter.month === "" || expenseMonth === filter.month) &&
        (filter.category === "" || x.category === filter.category)
      );
    })
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

  const totalExpense = filteredItems.reduce(
    (sum, x) => sum + Number(x.amount || 0),
    0
  );

  const clearFilters = () => {
    setFilter({
      month: "",
      category: "",
    });
  };

  return (
    <>
      <h2>Tractor Expenses</h2>

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
          <select
            className="form-select"
            value={f.category}
            onChange={(e) => setF({ ...f, category: e.target.value })}
            required
          >
            <option value="">Select Expense Type</option>
            <option value="DIESEL">DIESEL</option>
            <option value="REPAIR">REPAIR</option>
            <option value="DRIVER_SALARY">DRIVER SALARY</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="SPARE_PARTS">SPARE PARTS</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="col">
          <input
            className="form-control"
            type="text"
            inputMode="numeric"
            placeholder="Enter amount"
            value={f.amount}
            onChange={(e) => setF({ ...f, amount: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <input
            className="form-control"
            type="text"
            placeholder="Repair details / description"
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
          />
        </div>

        <div className="col">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <div className="card p-3 mb-3">
        <h5>Filters</h5>

        <div className="row g-2">
          <div className="col-md-4">
            <select
              className="form-select"
              value={filter.month}
              onChange={(e) => setFilter({ ...filter, month: e.target.value })}
            >
              <option value="">All Months</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={filter.category}
              onChange={(e) =>
                setFilter({ ...filter, category: e.target.value })
              }
            >
              <option value="">All Expense Types</option>
              <option value="DIESEL">DIESEL</option>
              <option value="REPAIR">REPAIR</option>
              <option value="DRIVER_SALARY">DRIVER SALARY</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="SPARE_PARTS">SPARE PARTS</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>

          <div className="col-md-2">
            <div className="form-control fw-bold">
              Total: ₹{totalExpense}
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive card p-2">
        <table className="table table-bordered table-hover align-middle mb-0 w-100">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>S.No</th>
              <th>Date</th>
              <th>Expense Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((x, index) => (
              <tr key={x.id}>
                <td>{index + 1}</td>
                <td>{x.expenseDate}</td>
                <td>{x.category}</td>
                <td>₹{x.amount}</td>
                <td>{x.description || "-"}</td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No tractor expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}