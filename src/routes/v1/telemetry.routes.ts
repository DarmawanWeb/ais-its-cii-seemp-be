import express, { Router } from 'express';
import {
  createTelemetryController,
  getAllTelemetryController,
  getTelemetryByMmsiController,
  updateTelemetryController,
  deleteTelemetryController,
  updateFuelConsumptionByMMSIController,
} from '../../controllers/telemetry.controller';

const router: Router = express.Router();

router.post('/', createTelemetryController);
router.get('/', getAllTelemetryController);
router.get('/:mmsi', getTelemetryByMmsiController);
router.put('/:mmsi', updateTelemetryController);
router.delete('/:mmsi', deleteTelemetryController);
router.post('/:mmsi/fuel', updateFuelConsumptionByMMSIController);

export default router;
