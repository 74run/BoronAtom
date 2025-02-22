var admin = require("firebase-admin");

var serviceAccount = require("./boronatom-ai-firebase-adminsdk-fbsvc-fbfc0089d0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();