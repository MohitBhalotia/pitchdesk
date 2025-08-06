import ProfileCard from "@/components/ProfileCard";
import vcData from "../../../data/aiVCs.json";

export const metadata = {
  title: "Meet the VCs | PitchDesk",
  description: "Discover our AI-powered Venture Capitalists and their unique personalities, philosophies, and investment criteria.",
};

export default function MeetTheVCsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-violet-100 dark:from-teal-950 dark:to-violet-900 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-teal-500 to-violet-600 bg-clip-text text-transparent mb-4">Meet the AI VCs</h1>
        <p className="text-xl text-muted-foreground mb-2">Explore the personalities, philosophies, and deal-making styles of our AI-powered Venture Capitalists.</p>
        <span className="inline-block bg-gradient-to-r from-teal-200 to-violet-200 dark:from-teal-800 dark:to-violet-800 h-1 w-32 rounded-full mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {vcData.map((vc, idx) => (
          <ProfileCard key={vc.name + idx} {...vc} />
        ))}
      </div>
    </main>
  );
}
