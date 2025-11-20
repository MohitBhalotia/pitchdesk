"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  Users, Trophy } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Competition {
  _id: string;
  title: string;
  description: string;
  collegeName: string;
  bannerImage1: string;
  prizePool: string;
  registrationDeadline: string;
  totalRegistered: number;
  teamSize: {
    min: number;
    max: number;
  };
}

function calculateDaysLeft(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function TournamentsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        setLoading(true);
        const res = await axios.get('/api/competitions');
        console.log(res.data)
        setCompetitions(res.data);
      } catch (error) {
        console.error('Error fetching competitions:', error);
        setError('Failed to fetch competitions');
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Competitions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover and participate in entrepreneurship competitions from colleges worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Competitions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover and participate in entrepreneurship competitions from colleges worldwide
          </p>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <p className="font-semibold text-lg mb-2">Error Loading Competitions</p>
              <p>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Competitions</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Discover and participate in entrepreneurship competitions from colleges worldwide
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => {
          const daysLeft = calculateDaysLeft(competition.registrationDeadline);

          return (
            <Card key={competition._id} className="hover:shadow-lg transition-shadow">
              <div className="-mt-6 ">
                <Image
                  src={competition.bannerImage1}
                  alt={competition.title}
                  width={500}
                  height={300}
                  className=" rounded-t-lg"
                />
              </div>

              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="w-fit">
                    {competition.collegeName}
                  </Badge>
                  <Badge variant={daysLeft > 7 ? "default" : daysLeft > 0 ? "destructive" : "secondary"} className="w-fit">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg sm:text-xl">{competition.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {competition.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{competition.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{competition.totalRegistered} registered</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/competitions/${competition._id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {competitions.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No competitions available</h3>
          <p className="text-muted-foreground">
            Check back later for new entrepreneurship competitions
          </p>
        </div>
      )}
    </div>
  );
}