import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";

export default (app: Express) => {
  app.use("/admin/dashboard", dashboardRoutes);
};
