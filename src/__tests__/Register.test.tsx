import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../app/register/page";
import axios from "axios";
import { useRouter } from "next/navigation";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RegisterPage", () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  beforeEach(() => jest.clearAllMocks());

  it("renders register form", () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("registers successfully", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { id: 1 } });

    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "ozkan" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "ozkan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /register/i }));

    await waitFor(
  () => {
    expect(mockPush).toHaveBeenCalledWith("/login");
  },
  { timeout: 2000 } // ⏳ Jest biraz daha beklesin
);

  });
});
