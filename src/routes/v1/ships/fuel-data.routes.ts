import express, { Router } from "express";
import {
  addFuelData,
  getAllFuelData,
  deleteFuelData
} from "../../../controllers/ships/fuel-data.controller";

const router: Router = express.Router();

router.post("/", addFuelData);
router.get("/", getAllFuelData);
router.delete("/:mmsi", deleteFuelData);

export default router;
