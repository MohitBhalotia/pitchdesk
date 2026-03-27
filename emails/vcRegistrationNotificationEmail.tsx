import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VCNotificationProps {
  vcName: string;
  vcEmail: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function VCRegistrationNotificationEmail({
  vcName,
  vcEmail,
}: VCNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>New VC Registration Alert</Preview>
        <Container style={container}>
          <Section style={coverSection}>
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
              <Heading style={h1}>New VC Registration</Heading>
              <Text style={mainText}>
                Hello Admin,
                <br />
                A new Venture Capitalist / Investor has just registered on Pitch Desk. Please review their details and verify their account manually in the database.
              </Text>

              <Section style={detailsSection}>
                <Text style={detailsHeader}>Registration Details:</Text>
                <Text style={detailsText}><strong>Name:</strong> {vcName}</Text>
                <Text style={detailsText}><strong>Email:</strong> {vcEmail}</Text>
                <Text style={detailsText}><strong>Role:</strong> VC / Investor</Text>
              </Section>
            </Section>

            <Hr />

            <Section style={lowerSection}>
              <Text style={cautionText}>
                This is an automated notification. Please do not reply to this email.
              </Text>
            </Section>
          </Section>

          <Text style={footerText}>
            © {new Date().getFullYear()}, Pitch Desk. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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

const text = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "20px 0",
};

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

const mainText = {
  ...text,
  marginBottom: "18px",
};

const detailsSection = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const detailsHeader = {
  ...text,
  margin: "0 0 10px 0",
  fontWeight: "bold",
  fontSize: "16px",
  color: "#1a202c",
};

const detailsText = {
  ...text,
  margin: "5px 0",
};

const cautionText = {
  ...text,
  margin: 0,
  fontSize: "13px",
  color: "#718096",
};
