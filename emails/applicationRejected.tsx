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

interface ApplicationRejectedProps {
  founderName: string;
  startupName: string;
  programName: string;
  programUrl: string;
  vcName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function ApplicationRejectedEmail({
  founderName,
  startupName,
  programName,
  programUrl,
  vcName,
}: ApplicationRejectedProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>An update on your application to {programName} from {vcName}.</Preview>
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

            <Section style={upperSection}>
              <Heading style={h1}>An update on your application</Heading>

              <Text style={mainText}>Hi {founderName},</Text>

              <Text style={mainText}>
                Thank you for taking the time to apply with{" "}
                <strong>{startupName}</strong> to the{" "}
                <strong>{programName}</strong> investment program.
              </Text>

              <Text style={mainText}>
                After careful consideration, {vcName} has decided not to move
                forward with your application at this time. This was a
                competitive process, and we appreciate the effort you put into
                your pitch.
              </Text>

              <Text style={mainText}>
                Please do not be discouraged — every rejection is a step closer
                to the right opportunity. We encourage you to keep building,
                keep pitching, and keep growing your startup.
              </Text>

              <Button href={programUrl} style={button}>
                View Program Page
              </Button>

              <Text style={tipText}>
                There are always more opportunities. Keep an eye on PitchDesk
                for new investment programs that may be a great fit for your
                startup.
              </Text>
            </Section>

            <Hr />

            <Section style={lowerSection}>
              <Text style={cautionText}>
                This decision was made by {vcName} on the PitchDesk platform.
                If you have any questions, please reach out at{" "}
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

const upperSection = {
  padding: "30px",
};

const lowerSection = {
  padding: "20px 30px",
  backgroundColor: "#fafafa",
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
  marginBottom: "14px",
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
  color: "#718096",
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
  backgroundColor: "#4a5568",
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
