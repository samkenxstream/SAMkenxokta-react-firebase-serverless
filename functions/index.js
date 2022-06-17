const functions = require("firebase-functions");

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("{yourFirebaseKeysFile}");
const axios = require('axios').default;

const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const OktaJwtVerifier = require("@okta/jwt-verifier");

const { getGrades } = require("./grades");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "https://{yourOktaDomain}/oauth2/default",
});

exports.exchangeOktaTokenForFirebaseToken = functions.https.onCall(
  async (data, context) => {
    const jwt = await oktaJwtVerifier.verifyAccessToken(data.accessToken, "api://default");

    const userInfo = await axios.get('https://{yourOktaDomain}/oauth2/default/v1/userinfo', {
      headers: {
        'Authorization': `Bearer ${data.accessToken}`
      },
      method: 'get'
    });

    const firebaseToken = await firebaseApp
      .auth()
      .createCustomToken(jwt.claims.uid, {
        name: userInfo.data.name,
        email: userInfo.data.email,
        preferred_username: userInfo.data.preferred_username,
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
