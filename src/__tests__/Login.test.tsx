import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../app/login/page";
import axios from "axios";
import { useRouter } from "next/navigation";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("submits login successfully", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: { access: "mock_access", refresh: "mock_refresh" },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "ozkan" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("access")).toBe("mock_access");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
