import { useEffect, useState } from "react";
import api from "../api/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerList, setShowCustomerList] = useState(false);

  const [f, setF] = useState({
    customerId: "",
    bookingDate: "",
    materialType: "",
    numberOfLoads: "",
    pricePerLoad: "",
    amountPaid: 0,
    remarks: "",
  });

  const [filter, setFilter] = useState({
    village: "",
    customer: "",
    deliveryStatus: "",
    paymentStatus: "",
    month: "",
  });

  const load = () => {
    api.get("/bookings").then((r) => setBookings(r.data.data));
    api.get("/customers").then((r) => setCustomers(r.data.data));
  };

  useEffect(() => {
    load();
  }, []);

  const searchedCustomers = customers.filter((c) => {
    const keyword = customerSearch.trim().toLowerCase();

    if (keyword === "") {
      return true;
    }

    const text = `${c.name} ${c.villageName}`.toLowerCase();
    return text.includes(keyword);
  });

  const save = async (e) => {
    e.preventDefault();

    if (!f.customerId) {
      alert("Please select customer from list");
      return;
    }

    await api.post("/bookings", {
      ...f,
      numberOfLoads: Number(f.numberOfLoads),
      pricePerLoad: Number(f.pricePerLoad),
    });

    load();

    setF({
      customerId: "",
      bookingDate: "",
      materialType: "",
      numberOfLoads: "",
      pricePerLoad: "",
      amountPaid: 0,
      remarks: "",
    });

    setCustomerSearch("");
    setShowCustomerList(false);
  };

  const pay = async (id) => {
    const amount = prompt("Enter payment amount");

    if (amount) {
      await api.post(`/bookings/${id}/payments`, {
        paymentDate: new Date().toISOString().slice(0, 10),
        amount: Number(amount),
        paymentMode: "CASH",
        notes: "Paid",
      });

      load();
    }
  };

  const completeDelivery = async (id) => {
    await api.patch(`/bookings/${id}/delivered`);
    load();
  };

  const filteredBookings = bookings
    .filter((b) => {
      const villageName = b.customer?.villageName?.toLowerCase() || "";
      const customerName = b.customer?.name?.toLowerCase() || "";
      const bookingMonth = b.bookingDate ? b.bookingDate.slice(5, 7) : "";

      return (
        villageName.includes(filter.village.toLowerCase()) &&
        customerName.includes(filter.customer.toLowerCase()) &&
        (filter.month === "" || bookingMonth === filter.month) &&
        (filter.deliveryStatus === "" ||
          b.deliveryStatus === filter.deliveryStatus) &&
        (filter.paymentStatus === "" ||
          b.paymentStatus === filter.paymentStatus)
      );
    })
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

  const clearFilters = () => {
    setFilter({
      village: "",
      customer: "",
      deliveryStatus: "",
      paymentStatus: "",
      month: "",
    });
  };

  return (
    <>
      <h2>Bookings / Loads</h2>

      <form onSubmit={save} className="card p-3 mb-3 row g-2">
        <div className="col position-relative">
          <input
            className="form-control"
            type="text"
            placeholder="Type or select customer"
            value={customerSearch}
            onFocus={() => setShowCustomerList(true)}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setF({ ...f, customerId: "" });
              setShowCustomerList(true);
            }}
            required
          />

          {showCustomerList && !f.customerId && (
            <div
              className="list-group position-absolute w-100"
              style={{
                zIndex: 1000,
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {searchedCustomers.map((c) => (
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  key={c.id}
                  onMouseDown={() => {
                    setF({ ...f, customerId: c.id });
                    setCustomerSearch(`${c.name} - ${c.villageName}`);
                    setShowCustomerList(false);
                  }}
                >
                  {c.name} - {c.villageName}
                </button>
              ))}

              {searchedCustomers.length === 0 && (
                <div className="list-group-item text-muted">
                  No customer found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col">
          <input
            type="date"
            className="form-control"
            value={f.bookingDate}
            onChange={(e) => setF({ ...f, bookingDate: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <select
            className="form-select"
            value={f.materialType}
            onChange={(e) => setF({ ...f, materialType: e.target.value })}
            required
          >
            <option value="">Select Load Name</option>
            {["MATTI","KANKAR","SAND","NAGAVALLI SAND","ROCKS","20 MM","40MM","GK BRICKS","RK BRICKS", "BRICKS", "OTHER"].map((x) => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <input
            className="form-control"
            type="text"
            inputMode="numeric"
            placeholder="Enter No. of Loads"
            value={f.numberOfLoads}
            onChange={(e) => setF({ ...f, numberOfLoads: e.target.value })}
            required
          />
        </div>

        <div className="col">
          <input
            className="form-control"
            type="text"
            inputMode="numeric"
            placeholder="Enter Price Per Load"
            value={f.pricePerLoad}
            onChange={(e) => setF({ ...f, pricePerLoad: e.target.value })}
            required
          />
        </div>

        <button className="btn btn-success col">Add</button>
      </form>

      <div className="card p-3 mb-3">
        <h5>Filters</h5>

        <div className="row g-2">
          <div className="col-md-2">
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

          <div className="col-md-2">
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
            <input
              className="form-control"
              placeholder="Search by customer"
              value={filter.customer}
              onChange={(e) =>
                setFilter({ ...filter, customer: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filter.deliveryStatus}
              onChange={(e) =>
                setFilter({ ...filter, deliveryStatus: e.target.value })
              }
            >
              <option value="">All Delivery</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filter.paymentStatus}
              onChange={(e) =>
                setFilter({ ...filter, paymentStatus: e.target.value })
              }
            >
              <option value="">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Not Paid</option>
              <option value="PARTIAL">Partial</option>
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
        </div>
      </div>

      <div className="table-responsive card p-2">
        <table className="table table-bordered table-hover align-middle mb-0 w-100">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Village</th>
              <th>Load Name</th>
              <th>No. of Loads</th>
              <th>Price / Load</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Delivery</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id}>
                <td>{b.bookingDate}</td>

                <td>
                  <a href={`/app/customer-bookings/${b.customer?.id}`}>
                    {b.customer?.name}
                  </a>
                </td>

                <td>{b.customer?.villageName}</td>
                <td>{b.materialType}</td>
                <td>{b.numberOfLoads}</td>
                <td>₹{b.pricePerLoad}</td>
                <td>₹{b.totalAmount}</td>
                <td>₹{b.amountPaid}</td>
                <td>₹{b.remainingAmount}</td>

                <td>
                  <span
                    className={
                      b.deliveryStatus === "COMPLETED"
                        ? "badge bg-success"
                        : "badge bg-info"
                    }
                  >
                    {b.deliveryStatus}
                  </span>

                  {b.deliveryStatus === "PENDING" && (
                    <button
                      type="button"
                      className="btn btn-sm btn-success ms-2"
                      onClick={() => completeDelivery(b.id)}
                    >
                      Mark Completed
                    </button>
                  )}
                </td>

                <td>
                  <span
                    className={
                      b.paymentStatus === "PAID"
                        ? "badge bg-success"
                        : b.paymentStatus === "PARTIAL"
                        ? "badge bg-warning"
                        : "badge bg-danger"
                    }
                  >
                    {b.paymentStatus}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => pay(b.id)}
                  >
                    Add Payment
                  </button>
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center text-muted">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}