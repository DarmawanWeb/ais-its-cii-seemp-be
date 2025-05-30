import express from 'express';
import { type Router } from 'express';

import generalRoutes from './general.routes';
import sizeRoutes from './size.routes';

const router: Router = express.Router();

router.use('/general', generalRoutes);
router.use('/size', sizeRoutes);

export default router;
