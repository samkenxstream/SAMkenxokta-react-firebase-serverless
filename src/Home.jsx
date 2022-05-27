import React, { useState } from "react";

import { useOktaAuth } from "@okta/okta-react";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

function Home() {
  const [reportCardData, setReportCardData] = useState();
  const [nonce, setNonce] = useState("test");
  const [selectedSemester, setSelectedSemester] = useState("Spring 2022");
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () =>
    oktaAuth.signInWithRedirect({
      nonce: nonce,
    });
  const logout = async () => {
    oktaAuth.signOut("/");
    signOut();
  };

  const {
    REACT_APP_FIREBASE_APIKEY,
    REACT_APP_FIREBASE_AUTHDOMAIN,
    REACT_APP_FIREBASE_PROJECTID,
    REACT_APP_FIREBASE_STORAGEBUCKET,
    REACT_APP_FIREBASE_MESSAGINGSENDERID,
    REACT_APP_FIREBASE_APPID,
    REACT_APP_ENV,
  } = process.env;

  const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_APIKEY,
    authDomain: REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: REACT_APP_FIREBASE_PROJECTID,
    storageBucket: REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: REACT_APP_FIREBASE_APPID,
  };

  const app = initializeApp(firebaseConfig);
  const functions = getFunctions(app);

  const auth = getAuth();

  if (REACT_APP_ENV === "development") {
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  const getGrades = async () => {
    const getGradesCall = httpsCallable(functions, "getGrades");
    const resp = await getGradesCall({
      name: selectedSemester.split(" ")[0],
      year: selectedSemester.split(" ")[1],
    });

    setReportCardData(resp.data);
  };

  const exchangeOktaTokenForFirebaseToken = async () => {
    const idTokenResp = await oktaAuth.getIdToken();

    const exchangeToken = httpsCallable(
      functions,
      "exchangeOktaTokenForFirebaseToken"
    );

    const resp = await exchangeToken({
      accessToken: authState.accessToken.accessToken,
      idToken: idTokenResp,
      nonce: nonce,
    });

    await signInWithCustomToken(auth, resp.data.firebaseToken);
  };

  if (authState?.isAuthenticated) {
    exchangeOktaTokenForFirebaseToken();
  }

  return (
    <div className="App">
      <main role="main" className="inner cover container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light ">
          <ul className="nav navbar-nav ml-auto navbar-right ms-auto">
            <li>
              {auth?.currentUser && (
                <button
                  className="btn btn-outline-secondary my-2 my-sm-0"
                  onClick={logout}
                >
                  Logout
                </button>
              )}

              {!auth?.currentUser && (
                <button className="btn btn-outline-secondary" onClick={login}>
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>

        {!auth?.currentUser && (
          <div>
            <p className="lead">
              In order to use this application you must be logged into your Okta
              account
            </p>
            <p className="lead">
              <button className="btn btn-primary" onClick={login}>
                Login
              </button>
            </p>
          </div>
        )}
        {auth?.currentUser && (
          <div>
            <h1 className="cover-heading">
              Please select a semester to get your report card
            </h1>

            <div className="row">
              <div className="col-2">
                <select
                  className="form-select"
                  value={selectedSemester}
                  onChange={(e) => {
                    setSelectedSemester(e.target.value);
                  }}
                >
                  <option value="Fall 2021">Fall 2021</option>
                  <option value="Spring 2021">Spring 2021</option>
                  <option value="Fall 2022">Fall 2022</option>
                  <option value="Spring 2022">Spring 2022</option>
                </select>
              </div>
              <div className="col-2">
                <button className="btn btn-primary" onClick={getGrades}>
                  Get Grades
                </button>
              </div>
            </div>

            {reportCardData && (
              <>
                <p>
                  <b>Name: </b> {reportCardData.name}
                </p>
                <p>
                  <b>School: </b> {reportCardData.school}
                </p>
                <p>
                  <b>Semester: </b> {reportCardData.semester} -{" "}
                  {reportCardData.year}
                </p>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="text-start"> Course </th>
                      <th> Score </th>
                      <th> Letter Grade </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportCardData.grades.map((grade, i) => {
                      return (
                        <tr key={i}>
                          <td>{grade.course}</td>
                          <td>{grade.score}</td>
                          <td>{grade.letterGrade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        <footer
          className="bg-light text-center fixed-bottom"
          style={{
            width: "100%",
            padding: "0 15px",
          }}
        >
          <p>
            A Small demo using <a href="https://developer.okta.com/">Okta</a> to
            Secure an{" "}
            <a href="https://firebase.google.com/">
              Firebase hosted application{" "}
            </a>{" "}
            with a serverless{" "}
            <a href="https://firebase.google.com/docs/functions">function</a>
          </p>
          <p>
            By <a href="https://github.com/nickolasfisher">Nik Fisher</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Home;
