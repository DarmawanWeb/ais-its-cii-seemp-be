import express from 'express';
import { type Router } from 'express';

import authRoutes from './auth.routes';
import aisRoutes from './ais.routes';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/ais', aisRoutes);

export default router;
