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

interface ApplicationAcceptedProps {
  founderName: string;
  startupName: string;
  programName: string;
  programUrl: string;
  vcName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function ApplicationAcceptedEmail({
  founderName,
  startupName,
  programName,
  programUrl,
  vcName,
}: ApplicationAcceptedProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Congratulations! Your application to {programName} has been accepted.</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            {/* Logo */}
            <Section style={imageSection}>
              <Img
                src={`${baseUrl}/logo1.png`}
                alt="Pitch Desk Logo"
                height={60}
                style={{
                  height: "60px",
                  width: "auto",
                  maxWidth: "160px",
                  display: "block",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            </Section>

            {/* Green header banner */}
            <Section style={successBanner}>
              <Text style={bannerText}>Application Accepted</Text>
            </Section>

            <Section style={upperSection}>
              <Heading style={h1}>Congratulations, {founderName}!</Heading>

              <Text style={mainText}>
                We are thrilled to inform you that your application for{" "}
                <strong>{startupName}</strong> has been{" "}
                <strong style={{ color: "#16a34a" }}>accepted</strong> into the{" "}
                <strong>{programName}</strong> investment program.
              </Text>

              <Text style={mainText}>
                {vcName} and the investment team will be reaching out to you
                shortly with details on the next steps. In the meantime, you can
                visit the program page for more information.
              </Text>

              <Button href={programUrl} style={button}>
                View Program Details
              </Button>

              <Text style={tipText}>
                Keep an eye on your inbox — you will hear from us soon with
                onboarding information and next steps.
              </Text>
            </Section>

            <Hr />

            <Section style={lowerSection}>
              <Text style={cautionText}>
                This decision was made by {vcName} on the PitchDesk platform.
                If you believe this email was sent in error, please contact us
                at{" "}
                <Link href="mailto:info@pitchdesk.in" style={inlineLink}>
                  info@pitchdesk.in
                </Link>
                .
              </Text>
            </Section>
          </Section>

          <Text style={footerText}>
            © {new Date().getFullYear()} Pitch Desk. All rights reserved.{" "}
            <Link href="https://pitchdesk.in/privacy" target="_blank" style={link}>
              Privacy Policy
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

const coverSection = { backgroundColor: "#ffffff" };

const imageSection = {
  backgroundColor: "#1a202c",
  width: "100%",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 20px",
  overflow: "hidden",
  boxSizing: "border-box" as const,
  lineHeight: 0,
};

const successBanner = {
  backgroundColor: "#16a34a",
  padding: "14px 30px",
  textAlign: "center" as const,
};

const bannerText = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 700,
  margin: "0",
  letterSpacing: "0.5px",
};

const upperSection = {
  padding: "30px",
};

const lowerSection = {
  padding: "20px 30px",
  backgroundColor: "#f0fdf4",
};

const h1 = {
  color: "#1a202c",
  fontSize: "22px",
  fontWeight: 700,
  marginBottom: "16px",
};

const text = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
};

const mainText = {
  ...text,
  marginBottom: "16px",
};

const tipText = {
  ...text,
  fontSize: "13px",
  color: "#718096",
  marginTop: "16px",
  fontStyle: "italic",
};

const cautionText = {
  ...text,
  fontSize: "13px",
  color: "#4a7c59",
};

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 30px 20px",
  color: "#718096",
};

const link = {
  color: "#2754C5",
  fontSize: "12px",
  textDecoration: "underline",
};

const inlineLink = {
  color: "#2754C5",
  textDecoration: "underline",
};

const button = {
  backgroundColor: "#16a34a",
  color: "#ffffff",
  borderRadius: "6px",
  fontSize: "15px",
  padding: "12px 24px",
  textDecoration: "none",
  fontWeight: 600,
  display: "inline-block",
  marginTop: "8px",
  marginBottom: "8px",
};
