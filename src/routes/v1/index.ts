import express from 'express';
import { type Router } from 'express';

import authRoutes from './auth.routes';
import aisRoutes from './ais.routes';
import shipsRoutes from './ships';
import ciiRoutes from './cii';
import portRoutes from './port.routes';
import telemetryRoutes from './telemetry.routes';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/ais', aisRoutes);
router.use('/ships', shipsRoutes);
router.use('/cii', ciiRoutes);
router.use('/port', portRoutes);
router.use('/telemetry', telemetryRoutes);

export default router;
