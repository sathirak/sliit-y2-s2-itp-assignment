import ky from "ky";

export const apiPrivateClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  hooks: {
    beforeRequest: [
      async (request) => {
        // Get token from storage (you may need to adjust this based on your auth implementation)
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
