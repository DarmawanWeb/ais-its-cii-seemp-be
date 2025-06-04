import express from 'express';
import { type Router } from 'express';

import { getSEEMPByMmsiController } from '../../controllers/seemp.controller';

const router: Router = express.Router();

router.get('/:mmsi', getSEEMPByMmsiController);

export default router;
