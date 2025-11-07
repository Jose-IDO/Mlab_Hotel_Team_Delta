import { Router } from "express";
import { notificationRepository } from "../repositories/notificationRepository";
import { authenticate } from "../middleware/auth";


const router = Router();

router.get("/", authenticate, async (req, res) => {
  const userId = (req as any).user?.id;
  const notifications = await notificationRepository.getUserNotifications(userId);
  res.json({ ok: true, data: notifications });
});

router.put("/:id/read", authenticate, async (req, res) => {
  const { id } = req.params;
  const updated = await notificationRepository.markAsRead(Number(id));
  res.json({ ok: true, data: updated });
});

export default router;
