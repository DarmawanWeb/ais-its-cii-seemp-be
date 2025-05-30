import express from 'express';
import { type Router } from 'express';

import generalRoutes from './general.routes';

const router: Router = express.Router();

router.use('/general', generalRoutes);

export default router;
