import { createBrowserRouter, Navigate } from "react-router-dom";


import MakePayment from "../pages/MakePayment";
import BillList from "../pages/BillList";
import Dashboard from "../pages/Dashboard";
import MaintenanceList from "../pages/MaintenanceList";
import MaintenanceDetail from "../pages/MaintenanceDetail";
import CreateMaintenanceRequest from "../pages/CreateMaintenanceRequest";
import EditMaintenanceRequest from "../pages/EditMaintenanceRequest";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary";
import BuildingList from "../pages/building/BuildingList";
import ResidentLayout from "../layouts/ResidentLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import AddBuilding from "../pages/building/AddBuilding";
const AppRoutes = createBrowserRouter([

  /* ================= PAYMENT (RESIDENT) ================= */
  {
    path: "/",
    element: <ResidentLayout />,
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
