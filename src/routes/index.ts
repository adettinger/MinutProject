import express from "express";
import PingController from "../controllers/pingController";
import ManagerRouter from "./manager.router";
import PropertyRouter from "./property.router";
import ReservationRouter from "./reservation.router";

const router = express.Router();

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.use("/managers", ManagerRouter);
router.use("/propertys", PropertyRouter);
router.use("/reservations", ReservationRouter);

export default router;