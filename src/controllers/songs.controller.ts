import { Router } from 'express';
import { deleteSong } from '../models/songs.model';

const router = Router();

router.post('/next', async (req, res) => {
  const deleted = await deleteSong();

  res.json({ message: 'skipped song successfully', deleted });
});

export default router;
