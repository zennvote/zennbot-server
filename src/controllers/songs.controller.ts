import { Router } from 'express';
import { deleteSong, setFreemode } from '../models/songs.model';

const router = Router();

router.post('/next', async (req, res) => {
  const deleted = await deleteSong();

  res.json({ message: 'skipped song successfully', deleted });
});

router.post('/freemode', async (req, res) => {
  const { value } = req.body;

  const result = await setFreemode(value);

  res.json({ message: `set freemode as ${value} successfully`, value });
});

export default router;
