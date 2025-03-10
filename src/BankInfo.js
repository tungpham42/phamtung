import React, { useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAuth,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseApp from "./firebaseConfig";

const auth = getAuth(firebaseApp);
const allowedEmails = [
  "tung.42@gmail.com",
  "cotuongdottop@gmail.com",
  "cungraodotnet@gmail.com",
];

const BankInfo = () => {
  const [user] = useAuthState(auth);
  const [copied, setCopied] = useState({
    bankName: false,
    accountNumber: false,
    beneficiaryName: false,
    swiftCode: false,
    allInfo: false,
  });
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false); // New state to track sign-in process

  const bankDetails = {
    bankName: "TECHCOMBANK",
    accountNumber: "19027906069012",
    beneficiaryName: "PHAM TUNG",
    swiftCode: "VTCBVNVX",
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [field]: true });
      setTimeout(() => setCopied({ ...copied, [field]: false }), 3000);
    });
  };

  const handleCopyAll = () => {
    const allInfo = `Bank Name: ${bankDetails.bankName}\nAccount Number: ${bankDetails.accountNumber}\nBeneficiary Name: ${bankDetails.beneficiaryName}\nSWIFT Code: ${bankDetails.swiftCode}`;
    navigator.clipboard.writeText(allInfo).then(() => {
      setCopied({ ...copied, allInfo: true });
      setTimeout(() => setCopied({ ...copied, allInfo: false }), 3000);
    });
  };

  const signInWithGoogle = async () => {
    if (isSigningIn) return; // Prevent multiple clicks
    setIsSigningIn(true); // Disable button
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError(error.message);
      if (error.code === "auth/cancelled-popup-request") {
        setError(
          "Sign-in was canceled due to multiple requests. Please try again."
        );
      } else if (error.code === "auth/popup-blocked") {
        setError(
          "Popup was blocked by the browser. Please allow popups for this site."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completion.");
      } else if (error.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized. Please check Firebase Console settings."
        );
      }
    } finally {
      setIsSigningIn(false); // Re-enable button
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
      setError(error.message);
    }
  };

  return (
    <Container className="mt-5 col-lg-6 col-md-8 col-sm-12 col-12">
      {!user ? (
        <>
          <Button
            variant="primary"
            onClick={signInWithGoogle}
            disabled={isSigningIn} // Disable button while signing in
          >
            {isSigningIn ? "Signing In..." : "Sign in with Google"}
          </Button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </>
      ) : allowedEmails.includes(user.email) ? (
        <>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
          <Card className="mt-3">
            <Card.Header as="h5">Bank Information of Pham Tung</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <strong>Bank Name:</strong> {bankDetails.bankName}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleCopy(bankDetails.bankName, "bankName")}
                  >
                    <FontAwesomeIcon
                      icon={copied.bankName ? faCheck : faCopy}
                    />{" "}
                    {copied.bankName ? " Copied!" : " Copy"}
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Account Number:</strong> {bankDetails.accountNumber}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="ms-2"
                    onClick={() =>
                      handleCopy(bankDetails.accountNumber, "accountNumber")
                    }
                  >
                    <FontAwesomeIcon
                      icon={copied.accountNumber ? faCheck : faCopy}
                    />{" "}
                    {copied.accountNumber ? " Copied!" : " Copy"}
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Beneficiary Name:</strong>{" "}
                  {bankDetails.beneficiaryName}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="ms-2"
                    onClick={() =>
                      handleCopy(bankDetails.beneficiaryName, "beneficiaryName")
                    }
                  >
                    <FontAwesomeIcon
                      icon={copied.beneficiaryName ? faCheck : faCopy}
                    />{" "}
                    {copied.beneficiaryName ? " Copied!" : " Copy"}
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>SWIFT Code:</strong> {bankDetails.swiftCode}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="ms-2"
                    onClick={() =>
                      handleCopy(bankDetails.swiftCode, "swiftCode")
                    }
                  >
                    <FontAwesomeIcon
                      icon={copied.swiftCode ? faCheck : faCopy}
                    />{" "}
                    {copied.swiftCode ? " Copied!" : " Copy"}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleCopyAll}
                  >
                    <FontAwesomeIcon icon={copied.allInfo ? faCheck : faCopy} />{" "}
                    {copied.allInfo ? " All Info Copied!" : " Copy All Info"}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      ) : (
        <>
          <p>Access Denied</p>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
    </Container>
  );
};

export default BankInfo;
