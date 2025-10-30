const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Run every hour to check for expired matches
exports.checkExpiredMatches = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = new Date();

    try {
      // Query matches that are active and should have expired
      const matchesSnapshot = await db
        .collection('matches')
        .where('active', '==', true)
        .get();

      const batch = db.batch();
      let expiredCount = 0;

      matchesSnapshot.forEach((doc) => {
        const match = doc.data();
        const expiresAt = new Date(match.expiresAt);

        // Check if match has expired and has no messages
        if (expiresAt < now && match.messageCount === 0) {
          batch.update(doc.ref, { active: false, expiredAt: now.toISOString() });
          expiredCount++;
        }
      });

      await batch.commit();

      console.log(`Expired ${expiredCount} matches with no messages`);
      return null;
    } catch (error) {
      console.error('Error checking expired matches:', error);
      throw error;
    }
  });

// Trigger when a new message is created
exports.onMessageCreated = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const matchId = message.matchId;

    try {
      const matchRef = admin.firestore().collection('matches').doc(matchId);
      const matchDoc = await matchRef.get();

      if (!matchDoc.exists) {
        console.log('Match not found');
        return null;
      }

      // Update last message timestamp
      await matchRef.update({
        lastMessageAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    } catch (error) {
      console.error('Error updating match:', error);
      throw error;
    }
  });