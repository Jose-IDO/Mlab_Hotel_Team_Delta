import { Router } from "express";
import { notificationRepository } from "../repositories/notificationRepository";
import { authenticate } from "../middleware/auth";


const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(400).json({ ok: false, error: 'User ID not found' });
    }
    
    const notifications = await notificationRepository.getUserNotifications(userId);
    res.json({ ok: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.put("/:id/read", authenticate, async (req, res) => {
  const { id } = req.params;
  const updated = await notificationRepository.markAsRead(Number(id));
  res.json({ ok: true, data: updated });
});

// Admin route to send promotional notifications
router.post("/broadcast", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Check if user has admin or super_admin role
    const userRoles = user?.roles?.map((r: any) => r.name) || [];
    const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');
    
    if (!isAdmin) {
      return res.status(403).json({ ok: false, error: 'Admin access required' });
    }

    const { message, userIds } = req.body;
    
    if (!message) {
      return res.status(400).json({ ok: false, error: 'Message is required' });
    }

    let notifications;
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      // Send to specific users
      notifications = await notificationRepository.createBulk(userIds, message, 'promotion');
    } else {
      // Send to all users who have the customer role
      const { rows } = await (await import('../config/db')).default.query(
        `SELECT DISTINCT u.id 
         FROM users u 
         JOIN user_roles ur ON ur.user_id = u.id 
         JOIN roles r ON r.id = ur.role_id 
         WHERE r.name = 'customer' AND ur.is_active = TRUE`
      );
      const allUserIds = rows.map((r: any) => r.id);
      notifications = await notificationRepository.createBulk(allUserIds, message, 'promotion');
    }

    res.json({ ok: true, data: notifications, count: notifications.length });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
