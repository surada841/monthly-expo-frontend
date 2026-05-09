import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ModuleSelection from "./pages/ModuleSelection";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import CustomerBookings from "./pages/CustomerBookings";
import HomeExpenses from "./pages/HomeExpenses";
import TractorExpenses from "./pages/TractorExpenses";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";

const Protected = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route
        path="/app"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<ModuleSelection />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="customer-bookings/:customerId" element={<CustomerBookings />} />
        <Route path="home-expenses" element={<HomeExpenses />} />
        <Route path="tractor-expenses" element={<TractorExpenses />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  </BrowserRouter>
);