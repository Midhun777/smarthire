const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    supportEmail: {
        type: String,
        default: 'support@smarthire.com'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    systemAlert: {
        type: String,
        default: ''
    },
    allowedFileTypes: {
        type: [String],
        default: ['pdf']
    },
    maxFileSize: {
        type: Number,
        default: 5 * 1024 * 1024 // 5MB
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
