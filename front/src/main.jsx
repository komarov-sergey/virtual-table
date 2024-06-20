import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./components/App.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import RecordCard from "./components/RecordCard.jsx";
import RecordCardEdit from "./components/RecordCardEdit.jsx";
import RecordCardNew from "./components/RecordCardNew.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/:tableId",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "record/:recordId",
    element: <RecordCard />,
  },
  {
    path: "record/edit/:recordId",
    element: <RecordCardEdit />,
  },
  {
    path: "record/new",
    element: <RecordCardNew />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
