// utils/kinde/getUser.ts
import { getAccessToken } from "./getAccessToken";

export const getUser = async (id: string) => {
  const token = await getAccessToken();

  const res = await fetch(
    `https://ojmarket.kinde.com/api/v1/user?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Error fetching user data:", data);
    throw new Error("Failed to fetch user");
  }

  return data;
};
