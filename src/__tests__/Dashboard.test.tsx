import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../app/dashboard/page";
import axios from "axios";

jest.mock("axios");

describe("DashboardPage", () => {
  beforeEach(() => {
    localStorage.setItem("access", "mock_token");
    jest.clearAllMocks();
  });

  it("renders projects after fetching", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Project Alpha",
          description: "Testing project",
          tasks: [{ id: 10, title: "Task A", status: "pending" }],
        },
      ],
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("Task A")).toBeInTheDocument();
    });
  });
});
