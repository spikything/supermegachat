const functions = require("firebase-functions");
const Filter = require("bad-words");
const admin = require("firebase-admin");

// This cloud function will run whenever a document is added to the Firestore database.
// It filters bad words at the server level, but requires a paid 'Blaze' plan Firebase account.
// As a fallback, filtering is implemented in the frontend too. So it's not essential to deploy this function.

admin.initializeApp();
const db = admin.firestore();

exports.filterBadWords = functions.firestore.document('message/{msgId}').onCreate(async (doc, ctx) => {

    const filter = new Filter( {placeHolder:'🤐'} );
    const {text, uid} = doc.data();

    if (filter.isProfane(text)) {
        const filtered = filter.clean(text);
        await doc.ref.update({text: filtered});
    }

});
