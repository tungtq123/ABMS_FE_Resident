import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MakePayment from "../pages/MakePayment";
import BillDetail from "../pages/BillDetail";
import TransactionHistory from "../pages/TransactionHistory";
import BillList from "../pages/BillList";
import Dashboard from "../pages/Dashboard";
import MaintenanceList from "../pages/MaintenanceList";
import MaintenanceDetail from "../pages/MaintenanceDetail";
import CreateMaintenanceRequest from "../pages/CreateMaintenanceRequest";
import EditMaintenanceRequest from "../pages/EditMaintenanceRequest";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary";
import BuildingList from "../pages/building/BuildingList";
import AddBuilding from "../pages/building/AddBuilding";
import ResidentLayout from "../layouts/ResidentLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../context/ProtectedRoute";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <ResidentLayout />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "payment/:billId", element: <MakePayment /> },
        { path: "bills/:billId", element: <BillDetail /> },
        { path: "payment/bill-list", element: <BillList /> },
        { path: "transactions", element: <TransactionHistory /> },
        { path: "maintenance", element: <MaintenanceList /> },
        { path: "maintenance/create", element: <CreateMaintenanceRequest /> },
        { path: "maintenance/edit/:id", element: <EditMaintenanceRequest /> },
        { path: "maintenance/:id", element: <MaintenanceDetail /> },
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <ManagerLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "building", element: <BuildingList /> },
        { path: "add-building", element: <AddBuilding /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
