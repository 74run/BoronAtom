const admin = require('firebase-admin');
const serviceAccount = require('./boronatom-ai-firebase-adminsdk-fbsvc-fbfc0089d0.json'); // Update this path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin; 