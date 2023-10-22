import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("test basic home page", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const header = screen.getByRole("heading", { level: 1 });
  expect(header).toHaveTextContent("Portal Home");
});
