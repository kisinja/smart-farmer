// utils/kinde/getUser.ts
import { getAccessToken } from "./getAccessToken";

export const getUser = async (id: string) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`https://ojmarket.kinde.com/api/v1/user?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
