import express from 'express';
import { type Router } from 'express';

import aisRoutes from './ais.routes';
import shipsRoutes from './ships';
import ciiRoutes from './cii';
import portRoutes from './port.routes';
import telemetryRoutes from './telemetry.routes';
import seempRoutes from './seemp.routes';
import illegalTranshipmentRoutes from './illegal-transhipment.routes';

const router: Router = express.Router();

router.use('/ais', aisRoutes);
router.use('/ships', shipsRoutes);
router.use('/cii', ciiRoutes);
router.use('/port', portRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/seemp', seempRoutes);
router.use('/illegal-transhipment', illegalTranshipmentRoutes);

export default router;
