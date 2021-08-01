import { Router } from 'express';
import { getFlag, getFlags, setFlag } from '../models/flags.model';

const router = Router();

router.get('/', async (req, res) => {
  const flags = await getFlags();

  const serialized: { [key: string]: boolean } = flags.reduce((obj, { key, value }) => ({ ...obj, [key]: value }), {});

  res.json(serialized);
});

router.get('/:key', async (req, res) => {
  const { key } = req.params;

  const result = await getFlag(key);

  res.json({ result });
});

router.post('/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  const result = await setFlag(key, value);

  res.json({ message: `set ${key} as ${result} successfully`, result });
});

export default router;
