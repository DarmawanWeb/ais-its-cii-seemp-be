import express from 'express';
import { FuelDataController } from "../../../controllers/ships/fuel-data.controller";
import { type Router } from 'express';


const router: Router = express.Router();

router.post("/", FuelDataController.addFuelData);
router.get("/", FuelDataController.getAllFuelData);

export default router;
