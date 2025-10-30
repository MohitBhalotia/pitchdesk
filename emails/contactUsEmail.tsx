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

interface ContactUsEmailProps {
  fullName: string;
  email: string;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function ContactUsEmail({
  fullName,
  email,
  message,
}: ContactUsEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission from {fullName}</Preview>
      <Body style={main}>
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
              <Heading style={h1}>New Contact Form Submission</Heading>
              <Text style={mainText}>
                You have received a new message through your website's contact form.
              </Text>

              {/* Contact Details */}
              <Section style={detailsSection}>
                <Text style={detailLabel}>From:</Text>
                <Text style={detailValue}>{fullName}</Text>
                
                <Text style={detailLabel}>Email:</Text>
                <Text style={detailValue}>
                  <Link href={`mailto:${email}`} style={emailLink}>
                    {email}
                  </Link>
                </Text>
                
                <Text style={detailLabel}>Message:</Text>
                <Text style={messageText}>{message}</Text>
              </Section>

              {/* Action Buttons */}
              <Section style={buttonSection}>
                <Button
                  href={`mailto:${email}?subject=Re: Your contact form submission&body=Hi ${fullName},`}
                  style={button}
                >
                  Reply to {fullName}
                </Button>
              </Section>
            </Section>

            <Hr />

            {/* Footer Notice */}
            <Section style={lowerSection}>
              <Text style={cautionText}>
                This message was sent through your website's contact form. Please respond within 24-48 hours.
              </Text>
            </Section>
          </Section>

          {/* Legal Footer */}
          <Text style={footerText}>
            This message was produced and distributed by Pitch Desk, IIIT Nagpur Campus. © {new Date().getFullYear()}, Pitch Desk. All rights
            reserved. View our{" "}
            <Link
              href="https://pitchdesk.in/privacy"
              target="_blank"
              style={link}
            >
              Privacy policy
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

const mainText = {
  ...text,
  marginBottom: "18px",
};

const cautionText = {
  ...text,
  margin: 0,
  fontSize: "13px",
  color: "#4a5568",
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

// New styles for contact details
const detailsSection = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "6px",
  margin: "20px 0",
  border: "1px solid #e2e8f0",
};

const detailLabel = {
  color: "#4a5568",
  fontSize: "14px",
  fontWeight: 600,
  margin: "8px 0 4px 0",
};

const detailValue = {
  color: "#2d3748",
  fontSize: "15px",
  margin: "0 0 12px 0",
  lineHeight: "1.5",
};

const messageText = {
  color: "#2d3748",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "8px 0 0 0",
  padding: "12px",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "4px",
  fontStyle: "italic",
};

const emailLink = {
  color: "#2754C5",
  textDecoration: "none",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "20px 0 10px 0",
};