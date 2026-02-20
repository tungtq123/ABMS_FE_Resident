import { createBrowserRouter, Navigate } from "react-router-dom";


import MainLayout from "../layouts/MainLayout";
import MakePayment from "../pages/MakePayment";
import BillList from "../pages/BillList";
import Dashboard from "../pages/Dashboard";

const AppRoutes = createBrowserRouter([

  /* ================= PAYMENT (RESIDENT) ================= */
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "payment/:billId",
        element: <MakePayment />,
      },
      {
        path: "payment/bill-list",
        element: <BillList />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default AppRoutes;
