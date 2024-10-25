import express from "express";
import ManagerController from "../controllers/manager.controller";

const router = express.Router();

router.post("/", async (req, res) => {
  const controller = new ManagerController();
  const response = await controller.createManager();
  return res.send(response);
});

router.get("/:AuthToken", async (req, res) => {
  const controller = new ManagerController();
  const response = await controller.getManager(req.params.AuthToken);
  if (!response)  {
    res.status(404).send({ message: "No manager found" });
  } else {
    return res.send(response);
  }
});

router.get("/", async (req, res) => {
  const controller = new ManagerController();
  const response = await controller.getAllManagers();
  if (!response)  {
    res.status(404).send({ message: "No managers found" });
  } else {
    return res.send(response);
  }
});

export default router;