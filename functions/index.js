const functions = require("firebase-functions");
const Filter = require("bad-words");
const admin = require("firebase-admin");

// NOTE: If you wish to use cloud functions, you may need to upgrade your Firebase account
/*
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
*/