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

interface InviteTeamMemberEmailProps {
  memberName: string;
  memberEmail: string;
  teamName: string;
  leaderName: string;
  competitionTitle: string;
  inviteLink: string;
  teamId: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function InviteTeamMemberEmail({
  memberName,
  memberEmail,
  teamName,
  leaderName,
  competitionTitle,
  inviteLink,
  teamId,
}: InviteTeamMemberEmailProps) {
  const urlWithTeam = `${inviteLink}&teamId=${encodeURIComponent(teamId)}`;

  return (
    <Html>
      <Head />
      <Preview>You have been invited to join {teamName} for {competitionTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            {/* Logo Section */}
            <Section style={imageSection}>
              <Img
                src={`${baseUrl}/logo1.png`}
                width="75"
                height="45"
                alt="Pitch Desk Logo"
              />
            </Section>

            {/* Upper Body */}
            <Section style={upperSection}>
              <Heading style={h1}>Team Invitation</Heading>
              <Text style={mainText}>
                Hi <strong>{memberName}</strong>,
              </Text>
              
              <Text style={mainText}>
                <strong>{leaderName}</strong> has invited you to join the team <strong>"{teamName}"</strong> for the competition:
              </Text>

              {/* Competition Details */}
              <Section style={highlightSection}>
                <Text style={highlightText}>{competitionTitle}</Text>
              </Section>

              {/* Action Button */}
              <Section style={buttonSection}>
                <Button
                  href={urlWithTeam}
                  style={button}
                >
                  Accept or Decline Invitation
                </Button>
              </Section>

              <Text style={noteText}>
                This invitation link is unique to you. If you're not registered on Pitch Desk yet, 
                you'll be prompted to sign up first.
              </Text>
            </Section>

            <Hr />

            {/* Team Details */}
            <Section style={lowerSection}>
              <Text style={detailLabel}>Team Details:</Text>
              <Text style={detailValue}>
                <strong>Team Name:</strong> {teamName}<br />
                <strong>Team ID:</strong> {teamId}<br />
                <strong>Invited by:</strong> {leaderName}<br />
                <strong>Your Email:</strong> {memberEmail}
              </Text>
            </Section>
          </Section>

          {/* Legal Footer */}
          <Text style={footerText}>
            This invitation was sent via Pitch Desk, IIIT Nagpur Campus. © {new Date().getFullYear()}, Pitch Desk. All rights
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

const buttonSection = {
  textAlign: "center" as const,
  margin: "25px 0 15px 0",
};

const highlightSection = {
  backgroundColor: "#f0f7ff",
  padding: "16px",
  borderRadius: "6px",
  margin: "20px 0",
  border: "1px solid #dbeafe",
  textAlign: "center" as const,
};

const highlightText = {
  color: "#1e40af",
  fontSize: "16px",
  fontWeight: 600,
  margin: 0,
};

const noteText = {
  ...text,
  fontSize: "14px",
  color: "#666",
  textAlign: "center" as const,
  margin: "15px 0 0 0",
  fontStyle: "italic",
};

const detailLabel = {
  color: "#4a5568",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0 0 8px 0",
};

const detailValue = {
  color: "#2d3748",
  fontSize: "14px",
  margin: "0",
  lineHeight: "1.6",
};