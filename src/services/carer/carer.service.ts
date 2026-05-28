import { apiFetch } from "@/lib/api";

export const carerService = {
    async getProfile() {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("accessToken")
                : null;

        if (!token) {
            throw new Error("No token found");
        }

        return apiFetch("/carer/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};