import apiClient from "@/utils/apiClient";
import { User } from "@/types/User";

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await apiClient.post<{ user: User }>(`/api/auth/register`, {
    name,
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await apiClient.post<{ user: User; token: string }>(`/api/auth/login`, {
    email,
    password,
  });
  return res.data;
};
