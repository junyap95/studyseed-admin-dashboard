import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../components/Register";

describe("Register Component", () => {
  it("renders Register form", () => {
    render(<Register />);

    // Check if the form elements are rendered
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("displays error message on failed submission", async () => {
    render(<Register />);

    // Mock the fetch function to simulate a failed submission
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Registration failed" }),
      })
    ) as jest.Mock;

    // Fill out the form and submit
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Check if the error message is displayed
    expect(await screen.findByText("Registration failed")).toBeInTheDocument();
  });
});
