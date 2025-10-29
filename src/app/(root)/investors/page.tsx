import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Investor = {
  id: number;
  fundSize: string;
  ticketSize: string;
  sectors: string[];
  stages: string[];
};

const investors: Investor[] = [
  {
    id: 1,
    fundSize: "300 cr",
    ticketSize: "1 – 10 cr",
    sectors: ["Healthtech", "SaaS", "Fintech"],
    stages: ["Pre-seed", "Seed", "Series A"],
  },
  {
    id: 2,
    fundSize: "800 cr",
    ticketSize: "5 – 25 cr",
    sectors: ["Consumer Internet", "AI", "Deep Tech"],
    stages: ["Seed", "Series A", "Growth"],
  },
  {
    id: 3,
    fundSize: "200 cr",
    ticketSize: "50 lacs – 5 cr",
    sectors: ["Agritech", "Cleantech", "Mobility"],
    stages: ["Early Stage", "Series A"],
  },
  {
    id: 4,
    fundSize: "1,000 cr",
    ticketSize: "10 – 40 cr",
    sectors: ["Fintech", "Consumer Goods", "Edtech"],
    stages: ["Series A", "Series B", "Series C"],
  },
  {
    id: 5,
    fundSize: "150 cr",
    ticketSize: "25 lacs – 2 cr",
    sectors: ["Media", "Creator Economy", "D2C Brands"],
    stages: ["Pre-seed", "Seed"],
  },
  {
    id: 6,
    fundSize: "600 cr",
    ticketSize: "3 – 15 cr",
    sectors: ["Enterprise SaaS", "B2B Commerce", "Supply Chain"],
    stages: ["Seed", "Series A", "Series B"],
  },
];

export default function InvestorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Our Investor Network</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
         Explore our onboard network of venture capital firms investing in promising startups.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-4">
        {investors.map((investor) => (
          <Card
            key={investor.id}
            className="border border-border/60 hover:border-primary/50 hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-muted/40 hover:bg-muted/50"
          >
            <CardHeader className="pb-2 ">
              <CardTitle className="text-2xl font-semibold">Investor {investor.id}</CardTitle>
              <CardDescription className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Fund Size: </span>
                  <span className="font-medium text-foreground">{investor.fundSize}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Ticket Size: </span>
                  <span className="font-medium text-foreground">{investor.ticketSize}</span>
                </p>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground/90">
                  Sector Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {investor.sectors.map((sector) => (
                    <Badge
                      key={sector}
                      variant="outline"
                      className="text-xs px-2 py-1 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground/90">
                  Investment Stage
                </h3>
                <div className="flex flex-wrap gap-2">
                  {investor.stages.map((stage) => (
                    <Badge
                      key={stage}
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

