const functions = require("firebase-functions");

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("{yourFirebaseKeysFile}");

const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const OktaJwtVerifier = require("@okta/jwt-verifier");

const { getGrades } = require("./grades");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "{yourOktaIssuer}",
});

exports.exchangeOktaTokenForFirebaseToken = functions.https.onCall(
  async (data, context) => {
    const jwt = await oktaJwtVerifier.verifyIdToken(
      data.idToken,
      "{yourOktaClientId}",
      data.nonce
    );

    const firebaseToken = await firebaseApp
      .auth()
      .createCustomToken(jwt.claims.jti, {
        name: jwt.claims.name,
        email: jwt.claims.email,
        preferred_username: jwt.claims.preferred_username,
      });

    return { firebaseToken };
  }
);

exports.getGrades = functions.https.onCall((data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );

  const grades = getGrades({
    email: context.auth.token.email,
    name: context.auth.token.name
  }, data);

  return grades;
});
