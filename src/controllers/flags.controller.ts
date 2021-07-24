import { Router } from 'express';
import { setFreemode } from '../models/songs.model';
import { getFreemode } from '../utils/redis';

const router = Router();

router.get('/', async (req, res) => {
  const freemode = await getFreemode();

  res.json({ freemode });
});

router.post('/freemode', async (req, res) => {
  const { value } = req.body;

  const result = await setFreemode(value);

  res.json({ message: `set freemode as ${result} successfully`, result });
});

export default router;
