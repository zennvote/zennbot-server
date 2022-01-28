import { Router } from 'express';
import * as business from '../business/managers.business';

const router = Router();

router.get('/', async (req, res) => {
  const managers = await business.getManagers();

  res.json(managers);
});

export default router;
