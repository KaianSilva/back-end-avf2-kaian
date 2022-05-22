import express from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerConfig from "./features/docs";

export default (app: express.Application) => {
  app.use("/docs", serve, setup(swaggerConfig));
};
