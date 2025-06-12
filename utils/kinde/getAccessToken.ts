// utils/kinde/getAccessToken.ts
export const getAccessToken = async () => {
  const res = await fetch("https://ojmarket.kinde.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "0c045bfd7e8246f68441bed304384e68",
      client_secret: 'lXi1PzU5GA4dcafmWgDJFuoP8VHhVZF1YZtIp1VFKAaJX4M9jkO',
      audience: "https://ojmarket.kinde.com/api",
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error("Failed to fetch access token from Kinde");

  return data.access_token;
};
