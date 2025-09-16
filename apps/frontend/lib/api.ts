import ky from "ky";

export const apiPublicClient = ky.create({
  prefixUrl:process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});
