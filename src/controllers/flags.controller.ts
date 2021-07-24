import { Router } from 'express';
import { getFlags, setFlag } from '../models/flags.model';

const router = Router();

router.get('/', async (req, res) => {
  const flags = await getFlags();

  res.json({ ...flags });
});

router.post('/freemode', async (req, res) => {
  const { value } = req.body;

  const result = await setFlag('freemode', value);

  res.json({ message: `set freemode as ${result} successfully`, result });
});

export default router;
