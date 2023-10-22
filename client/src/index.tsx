import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import App from "./App";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#103f5b",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
