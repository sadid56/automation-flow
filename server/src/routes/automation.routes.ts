import { Router } from 'express';
import {
  createAutomation,
  getAutomations,
  getAutomationById,
  updateAutomation,
  deleteAutomation,
  testAutomation,
} from '../controllers/automation.controller.js';

const router: Router = Router();

router.post('/', createAutomation);
router.get('/', getAutomations);
router.get('/:id', getAutomationById);
router.put('/:id', updateAutomation);
router.delete('/:id', deleteAutomation);
router.post('/:id/test', testAutomation);

export default router;
