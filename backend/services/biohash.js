const crypto = require('crypto');

/**
 * BioHash Service
 * Generates an irreversible cryptographic hash from biometric data.
 * Uses a pepper (system secret) and a salt (user-specific) to ensure one-wayness.
 */

class BioHashService {
    constructor() {
        // In a real production environment, this should be an environment variable.
        this.systemPepper = process.env.BIO_PEPPER || 'biocore-internal-secret-pepper-2026';
    }

    /**
     * Creates an irreversible hash for biometric data.
     * @param {string} biometricData - The raw biometric data (e.g., face template, fingerprint hash).
     * @param {string} userSalt - A unique salt for the user.
     * @returns {string} The irreversible Bio Hash.
     */
    generateHash(biometricData, userSalt) {
        if (!biometricData || !userSalt) {
            throw new Error('Biometric data and user salt are required.');
        }

        // 1. Combine data with salt and pepper
        const input = `${userSalt}:${biometricData}:${this.systemPepper}`;

        // 2. Hash using SHA-256 (part of the irreversible design)
        const hash = crypto.createHash('sha256').update(input).digest('hex');

        // 3. Optional: Perform multiple iterations (key stretching) to further prevent brute force
        let stretchedHash = hash;
        for (let i = 0; i < 1000; i++) {
            stretchedHash = crypto.createHash('sha256').update(stretchedHash + this.systemPepper).digest('hex');
        }

        return stretchedHash;
    }

    /**
     * Verifies if the provided biometric data matches the stored hash.
     * Since it's irreversible, we hash the input and compare.
     */
    verify(inputData, userSalt, storedHash) {
        const computedHash = this.generateHash(inputData, userSalt);
        return computedHash === storedHash;
    }
}

module.exports = new BioHashService();
