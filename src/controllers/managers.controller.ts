import { Router } from 'express';
import * as business from '../business/managers.business';

const router = Router();

router.get('/', async (req, res) => {
  const managers = await business.getManagers();

  res.json(managers);
});

router.post('/:username', async (req, res) => {
  const result = await business.postManager(req.params.username);

  if (result.isErr()) {
    const { error } = result;

    if (error === business.PostManagerError.ManagerAlreadyExists) {
      return res.status(400).json({ error: 'ManagerAlreadyExists' });
    }
    return res.status(500);
  }

  return res.status(200).json(result.value);
});

router.delete('/:username', async (req, res) => {
  const result = await business.deleteManager(req.params.username);

  if (result.isErr()) {
    const { error } = result;

    if (error === business.DeleteManagerError.ManagerNotExists) {
      return res.status(404).json({ error: 'ManagerNotExists' });
    }
    return res.status(500);
  }

  return res.status(200).json(result.value);
});

export default router;
