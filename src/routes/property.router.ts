import express from "express";
import PropertyController from "../controllers/property.controller";

const router = express.Router();

router.get("/:AuthToken", async (req, res) => {
  const controller = new PropertyController();
  const response = await controller.getPropertys(req.params.AuthToken);
  if (!response) {
    res.status(404).send({ message: "No properties found" });
  } else {
    return res.send(response);
  }
});

router.post("/", async (req, res) => {
  const controller = new PropertyController();
  const response = await controller.createProperty(req.body);
  if (!response) {
    res.status(404).send({ message: "Failed to create property" });
  } else {
    return res.send(response);
  }
});

export default router;