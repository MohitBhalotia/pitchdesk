import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordProps {
  resetPasswordToken: string;
  fullName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function ResetPasswordEmail({
  resetPasswordToken,
  fullName,
}: ResetPasswordProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Pitch Desk Password Reset</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            {/* Logo Section */}
            <Section style={imageSection}>
              <Img
                src={`${baseUrl}/logo.svg`}
                width="75"
                height="45"
                alt="Pitch Desk Logo"
              />
            </Section>

            {/* Upper Body */}
            <Section style={upperSection}>
              <Heading style={h1}>Reset your password</Heading>
              <Text style={mainText}>
                Hi {fullName},
                <br />
                We received a request to reset your password for your Pitch Desk account.
                If you made this request, please click the button below to set a new password.
                This link is valid for 10 minutes. If you didn’t request a password reset,
                you can safely ignore this email.
              </Text>

              {/* Call to Action */}
              <Button
                href={`${baseUrl}/reset-password?token=${resetPasswordToken}`}
                style={button}
              >
                Reset Password
              </Button>
            </Section>

            <Hr />

            {/* Footer Notice */}
            <Section style={lowerSection}>
              <Text style={cautionText}>
                Pitch Desk will never email you and ask you to disclose or verify your password, credit card, or banking account number.
              </Text>
            </Section>
          </Section>

          {/* Legal Footer */}
          <Text style={footerText}>
            This message was produced and distributed by Pitch Desk, IIIT Nagpur Campus. © {new Date().getFullYear()}, Pitch Desk. All rights
            reserved. View our{" "}
            <Link
              href="https://yourdomain.com/privacy"
              target="_blank"
              style={link}
            >
              privacy policy
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}


// -------------------- STYLES --------------------

const main = {
  backgroundColor: "#f6f9fc",
  color: "#212121",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  padding: "0",
  margin: "0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
};

const h1 = {
  color: "#1a202c",
  fontSize: "22px",
  fontWeight: 700,
  marginBottom: "16px",
};

const link = {
  color: "#2754C5",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "20px 0",
};

const imageSection = {
  backgroundColor: "#1a202c",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
};

const coverSection = { backgroundColor: "#ffffff" };

const upperSection = {
  padding: "30px",
};

const lowerSection = {
  padding: "20px 30px",
  backgroundColor: "#f7fafc",
};

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 30px 20px",
  color: "#718096",
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  fontSize: "16px",
  textAlign: "center" as const,
};

const codeText = {
  fontSize: "40px",
  fontWeight: "bold",
  letterSpacing: "5px",
  textAlign: "center" as const,
  color: "#2d3748",
  margin: "10px 0",
};

const validityText = {
  ...text,
  fontSize: "13px",
  marginTop: "4px",
  textAlign: "center" as const,
  color: "#718096",
};

const verificationSection = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 0 20px",
};

const mainText = {
  ...text,
  marginBottom: "18px",
};

const cautionText = {
  ...text,
  margin: 0,
  fontSize: "13px",
  color: "#e53e3e",
};

const button = {
  backgroundColor: "#2754C5",
  color: "#ffffff",
  borderRadius: "6px",
  fontSize: "16px",
  padding: "12px 20px",
  textDecoration: "none",
  fontWeight: 600,
  display: "inline-block",
  marginTop: "10px",
};
