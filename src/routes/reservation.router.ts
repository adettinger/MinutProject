import express from "express";
import ReservationController from "../controllers/reservation.controller";

const router = express.Router();

router.get("/:AuthToken/:PropertyId", async (req, res) => {
  const controller = new ReservationController();
  const response = await controller.getReservations(req.params.AuthToken, Number(req.params.PropertyId));
  if (!response) {
    res.status(404).send({ message: "No reservations found" });
  } else {
    return res.send(response);
  }
});

router.post("/", async (req, res) => {
  const controller = new ReservationController();
  const response = await controller.createReservation(req.body);
  if (!response) {
    res.status(404).send({ message: "Failed to create reservation" });
  } else {
    return res.send(response);
  }
});

router.post("/delete/", async (req, res) => {
    const controller = new ReservationController();
    const response = await controller.deleteReservation(req.body);
    if (!response) {
      res.status(404).send({ message: "Failed to delete reservation" });
    } else {
      return res.send({ message: "Reservation deleted" });
    }
  });

export default router;