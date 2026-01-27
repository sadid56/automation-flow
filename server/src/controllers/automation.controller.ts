import { Request, Response } from 'express';
import { Automation } from '../models/automation.model.js';
import { AutomationExecutor } from '../services/automation-executor.service.js';
import { sendEmail } from '../utils/nodemailer.js';

export const createAutomation = async (req: Request, res: Response) => {
  try {
    const { name, nodes, edges } = req.body;
    const automation = await Automation.create({ name, nodes, edges });
    res.status(201).json(automation);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ message });
  }
};

export const getAutomations = async (req: Request, res: Response) => {
  try {
    const automations = await Automation.find().sort({ createdAt: -1 });
    res.json(automations);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(500).json({ message });
  }
};

export const getAutomationById = async (req: Request, res: Response) => {
  try {
    const automation = await Automation.findById(req.params.id);
    if (!automation) return res.status(404).json({ message: 'Automation not found' });
    res.json(automation);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(500).json({ message });
  }
};

export const updateAutomation = async (req: Request, res: Response) => {
  try {
    const { name, nodes, edges } = req.body;
    const automation = await Automation.findByIdAndUpdate(
      req.params.id,
      { name, nodes, edges },
      { new: true },
    );
    if (!automation) return res.status(404).json({ message: 'Automation not found' });
    res.json(automation);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ message });
  }
};

export const deleteAutomation = async (req: Request, res: Response) => {
  try {
    const automation = await Automation.findByIdAndDelete(req.params.id);
    if (!automation) return res.status(404).json({ message: 'Automation not found' });
    res.json({ message: 'Automation deleted successfully' });
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(500).json({ message });
  }
};

export const testAutomation = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    // Trigger background execution
    AutomationExecutor.execute(id, email).catch((err) =>
      console.error('Background execution error:', err),
    );
    await sendEmail({
      to: email,
      subject: 'Test Automation',
      text: 'Test automation has been started',
    });

    res.json({ message: 'Test run started in background' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(500).json({ message });
  }
};
