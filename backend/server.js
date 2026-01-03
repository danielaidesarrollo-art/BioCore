const express = require('express');
const cors = require('cors');
const bioHashService = require('./services/biohash');
const safeCoreConnector = require('./services/safecore_connector');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Middlewares
const auditLog = (req, res, next) => {
    console.log(`[Audit] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

app.use(auditLog);

/**
 * Health Check
 */
app.get('/health', (req, res) => {
    res.json({ status: 'active', module: 'BioCore-Nucle' });
});

/**
 * Bio Authentication Endpoint
 * Receives biometric data (simulated) and authenticates through Safe Core.
 */
app.post('/api/auth/bio', async (req, res) => {
    const { biometricData, userId, livenessVerified } = req.body;

    if (!livenessVerified) {
        return res.status(403).json({ error: 'Liveness check failed. Authentication aborted.' });
    }

    try {
        // 1. Generate the Irreversible Bio Hash
        const userSalt = `salt_${userId}`; // In reality, fetch from a secure DB
        const bioHash = bioHashService.generateHash(biometricData, userSalt);

        console.log(`[BioCore] Generated Hash: ${bioHash.substring(0, 10)}...`);

        // 2. Connect and Authenticate with Safe Core
        const authResponse = await safeCoreConnector.authenticate(bioHash, {
            liveness: livenessVerified,
            userId: userId
        });

        res.json({
            success: true,
            message: 'Biometric identity verified by Safe Core',
            auth: authResponse
        });

    } catch (error) {
        console.error('[BioCore] Auth error:', error.message);
        res.status(500).json({ error: 'Internal Security Error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`
    ========================================
    BioCore Nucle API - Security Layer Active
    Port: ${PORT}
    SafeCore Bridge: CONNECTED
    ========================================
    `);
});
