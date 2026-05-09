import { useEffect, useState } from "react";
import api from "../api/api";

export default function Customers() {
  const [items, setItems] = useState([]);

  const [f, setF] = useState({
    name: "",
    mobileNumber: "",
    villageName: "",
  });

  const [filter, setFilter] = useState({
    name: "",
    village: "",
  });

  const load = () => {
    api.get("/customers").then((r) => setItems(r.data.data));
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    await api.post("/customers", f);

    setF({
      name: "",
      mobileNumber: "",
      villageName: "",
    });

    load();
  };

  const filteredItems = items
    .filter((x) => {
      const name = x.name?.toLowerCase() || "";
      const village = x.villageName?.toLowerCase() || "";

      return (
        name.includes(filter.name.toLowerCase()) &&
        village.includes(filter.village.toLowerCase())
      );
    })
    .sort((a, b) => b.id - a.id);

  const clearFilters = () => {
    setFilter({
      name: "",
      village: "",
    });
  };

  return (
    <>
      <h2>Customers</h2>

      <form onSubmit={save} className="card p-3 mb-3 row g-2">
        <div className="col">
          <input
            className="form-control"
            placeholder="Name"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <input
            className="form-control"
            placeholder="Mobile"
            value={f.mobileNumber}
            onChange={(e) => setF({ ...f, mobileNumber: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <input
            className="form-control"
            placeholder="Village"
            value={f.villageName}
            onChange={(e) => setF({ ...f, villageName: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <div className="card p-3 mb-3">
        <h5>Filters</h5>

        <div className="row g-2">
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Search by customer name"
              value={filter.name}
              onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            />
          </div>

          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Search by village"
              value={filter.village}
              onChange={(e) =>
                setFilter({ ...filter, village: e.target.value })
              }
            />
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
        </div>
      </div>

      <div className="table-responsive card p-2">
        <table className="table table-bordered table-hover align-middle mb-0 w-100">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>S.No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Village</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((x, index) => (
              <tr key={x.id}>
                <td>{index + 1}</td>
                <td>{x.name}</td>
                <td>{x.mobileNumber}</td>
                <td>{x.villageName}</td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}