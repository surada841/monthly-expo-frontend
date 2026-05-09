import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function CustomerBookings() {
  const { customerId } = useParams();

  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");

  const load = () => {
    api.get(`/bookings/customer/${customerId}`).then((r) => {
      setData(r.data.data);
    });
  };

  useEffect(() => {
    load();
  }, [customerId]);

  const payAll = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    await api.post(`/bookings/customer/${customerId}/payments`, {
      amount: Number(amount),
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: "CASH",
      notes: "Bulk customer payment",
    });

    setAmount("");
    load();
  };

  if (!data) return <h4>Loading...</h4>;

  return (
    <>
      <h2>{data.customerName} - All Loads</h2>

      <div className="card p-3 mb-3">
        <h5>Customer Payment Summary</h5>

        <p>Total Amount: ₹{data.totalAmount}</p>
        <p>Paid Amount: ₹{data.totalPaid}</p>
        <p>Remaining Amount: ₹{data.totalRemaining}</p>
        <p>Status: {data.paymentStatus}</p>

        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              type="text"
              inputMode="numeric"
              placeholder="Enter amount to pay"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-success w-100" onClick={payAll}>
              Pay
            </button>
          </div>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Remaining</th>
            <th>Payment</th>
            <th>Delivery</th>
          </tr>
        </thead>

        <tbody>
          {data.bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.bookingDate}</td>
              <td>{b.materialType}</td>
              <td>₹{b.totalAmount}</td>
              <td>₹{b.amountPaid}</td>
              <td>₹{b.remainingAmount}</td>
              <td>{b.paymentStatus}</td>
              <td>{b.deliveryStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}