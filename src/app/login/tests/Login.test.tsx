import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Login";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the useLocalStorage hook
jest.mock("usehooks-ts", () => ({
  useLocalStorage: jest.fn(),
}));

describe("Login Component", () => {
  const setIsAuthenticated = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useLocalStorage as jest.Mock).mockReturnValue([null, jest.fn()]);
  });

  test("renders Login form", () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          isLoading: false,
          setIsAuthenticated,
        }}
      >
        <Login />
      </AuthContext.Provider>
    );

    // Check if the form elements are rendered
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in as admin/i })).toBeInTheDocument();
  });

  test("displays error message on failed submission", async () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          isLoading: false,
          setIsAuthenticated,
        }}
      >
        <Login />
      </AuthContext.Provider>
    );

    // Mock the fetch function to simulate a failed submission
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Login failed" }),
      })
    ) as jest.Mock;

    // Fill out the form and submit
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.submit(screen.getByRole("button"));

    // Check if the error message is displayed
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  test("redirects on successful submission", async () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          isLoading: false,
          setIsAuthenticated,
        }}
      >
        <Login />
      </AuthContext.Provider>
    );

    // Mock the fetch function to simulate a successful submission
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ adminUser: { email: "test@example.com" } }),
      })
    ) as jest.Mock;

    // Fill out the form and submit
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.submit(screen.getByRole("button", { name: /sign in as admin/i }));

    // Check if the redirect happens
    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
    expect(setIsAuthenticated).toHaveBeenCalledWith(true);
  });

  afterEach(() => {
    jest.resetAllMocks(); // This ensures all mocks are cleared after each test
  });
});
