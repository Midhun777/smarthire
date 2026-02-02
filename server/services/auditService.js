const AuditLog = require('../models/AuditLog');

/**
 * Log an action to the AuditLog collection
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Description of the action (e.g., 'User Login')
 * @param {string} entityType - Type of entity involved (e.g., 'User', 'Job', 'Application')
 * @param {string} entityId - ID of the entity involved
 * @param {string} details - Additional details or metadata
 * @param {object} req - Express request object to extract IP address
 */
const logAction = async (userId, action, entityType, entityId = null, details = '', req = null) => {
    try {
        const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : '';

        const logEntry = new AuditLog({
            user: userId,
            action,
            entityType,
            entityId,
            details,
            ipAddress
        });

        await logEntry.save();
    } catch (error) {
        console.error('Failed to log audit action:', error);
    }
};

module.exports = { logAction };
