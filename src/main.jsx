import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter"; // Import component vừa sửa
import "./index.css";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AuthProvider from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        {/* AppRouter bây giờ là con của AuthProvider, chắc chắn có Context */}
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);