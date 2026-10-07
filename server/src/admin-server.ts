import "dotenv/config";
import adminApp from "./admin-app";

const port = Number(
  process.env.ADMIN_API_PORT || 4002,
);

adminApp.listen(port, () => {
  console.log(
    `AQR Capital Admin API running on http://localhost:${port}`,
  );
});