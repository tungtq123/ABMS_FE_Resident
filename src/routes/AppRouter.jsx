import { createBrowserRouter, Navigate } from "react-router-dom";


import MainLayout from "../layouts/MainLayout";
import MakePayment from "../pages/MakePayment";
import BillList from "../pages/BillList";
import Dashboard from "../pages/Dashboard";
import MaintenanceList from "../pages/MaintenanceList";
import MaintenanceDetail from "../pages/MaintenanceDetail";
import CreateMaintenanceRequest from "../pages/CreateMaintenanceRequest";
import EditMaintenanceRequest from "../pages/EditMaintenanceRequest";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary";

const AppRoutes = createBrowserRouter([

  /* ================= PAYMENT (RESIDENT) ================= */
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
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
      /* ================= MAINTENANCE (RESIDENT) ================= */
      {
        path: "maintenance",
        element: <MaintenanceList />,
      },
      {
        path: "maintenance/create",
        element: <CreateMaintenanceRequest />,
      },
      {
        path: "maintenance/edit/:id",
        element: <EditMaintenanceRequest />,
      },
      {
        path: "maintenance/:id",
        element: <MaintenanceDetail />,
      },
    ],
  },
]);


export default AppRoutes;
