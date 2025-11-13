import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

export default function AdvisorsPage() {
    const advisors = [
        { id: 1, image: '/advisors/advisor1.jpg', scope: 'Industrial Advisor' },
        { id: 2, image: '/advisors/advisor2.jpg', scope: 'Mentor & Advisor' },
        { id: 3, image: '/advisors/advisor3.jpg', scope: 'Industrial Advisor' },
        { id: 4, image: '/advisors/advisor4.jpg', scope: 'Banking Advisor' },
        { id: 5, image: '/advisors/advisor5.jpg', scope: 'Financial Advisor' }
    ]

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 mt-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Our Advisory Board
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Get guidance from experienced professionals who help startups grow and succeed.
                        Leverage their expertise to navigate your entrepreneurial journey.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {advisors.map((advisor) => (
                        <AdvisorCard key={advisor.id} advisor={advisor} />
                    ))}
                </div>
            </div>
        </div>
    )
}

interface AdvisorCardProps {
    advisor: {
        id: number
        image: string
        scope: string
    }
}

function AdvisorCard({ advisor }: AdvisorCardProps) {
    return (
        <Card className="w-full max-w-sm border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="px-2">
                <div className="relative aspect-[4/5] w-full">
                    <Image
                        src={advisor.image}
                        alt={`Advisor ${advisor.id}`}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={advisor.id <= 2}
                        quality={90}
                    />
                </div>
                <div className="pt-2 text-center">
                    <p className="text-xl font-bold text-muted-foreground">{advisor.scope}</p>
                </div>
            </CardContent>
        </Card>
    )
}