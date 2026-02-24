import { createBrowserRouter, Navigate } from "react-router-dom";


import MakePayment from "../pages/MakePayment";
import BillList from "../pages/BillList";
import Dashboard from "../pages/Dashboard";
import BuildingList from "../pages/building/BuildingList";
import ResidentLayout from "../layouts/ResidentLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import AddBuilding from "../pages/building/AddBuilding";
const AppRoutes = createBrowserRouter([

  /* ================= PAYMENT (RESIDENT) ================= */
  {
    path: "/",
    element: <ResidentLayout />,
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
    {
    path: "/",
    element: <ManagerLayout />,
    children: [
      {
        path: "building",
        element: <BuildingList />,
      },
            {
        path: "add-building",
        element: <AddBuilding />,
      }
      
    ],
  },
]);

export default AppRoutes;
