import { apiFetch } from "@/lib/api";
import { AdminDashboardStats } from "@/types/admin.types";

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
