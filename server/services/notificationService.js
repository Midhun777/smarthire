const Notification = require('../models/Notification');

/**
 * Create a single notification for one user.
 */
const createNotification = async ({ userId, type, title, body, link = '/', meta = {} }) => {
    try {
        const notif = await Notification.create({ userId, type, title, body, link, meta });
        return notif;
    } catch (err) {
        console.error('[Notification] Failed to create:', err.message);
        return null;
    }
};

/**
 * Bulk-create notifications (e.g., new job → all seekers).
 * Batches in groups of 200 to avoid mongo overload.
 */
const bulkCreateNotifications = async (notifArray) => {
    try {
        const BATCH = 200;
        for (let i = 0; i < notifArray.length; i += BATCH) {
            await Notification.insertMany(notifArray.slice(i, i + BATCH), { ordered: false });
        }
    } catch (err) {
        console.error('[Notification] Bulk create error:', err.message);
    }
};

module.exports = { createNotification, bulkCreateNotifications };
