'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const defaultTestimonials = [
  {
    text: 'PitchDesk helped me transform my messy pitch into a compelling story. The AI judges gave me brutally honest feedback that actually helped me secure my first funding!',
    name: 'Bhargav bidkar',
    role: 'Startup Founder',
    rating: 5
  },
  {
    text: 'As a student with no pitching experience, I was terrified. But practicing with AI judges built my confidence. Now I can pitch my college project to investors without sweating!',
    name: 'Priya Patel',
    role: 'Student',
    rating: 5
  },
  {
    text: 'The pitch document generator saved me 20+ hours of work. It created investor-ready decks that I could customize. This platform is a game-changer for early-stage founders.',
    name: 'Pawan raut',
    role: 'Entrepreneur',
    rating: 4
  },
  {
    text: 'I wish the AI could provide more industry-specific feedback for deep tech startups. Great for basic pitching, but needs more customization options for specialized domains.',
    name: 'Pankaj quriyal',
    role: 'Biotech Founder',
    rating: 3
  },
  {
    text: 'Practicing with different VC personas helped me understand what different investors look for. My pitch success rate improved from 20% to 65% in just 2 months!',
    name: 'Suraj bhan',
    role: 'Serial Entrepreneur',
    rating: 5
  },
  {
    text: 'The evaluation metrics are super detailed - from body language analysis to content structure. It felt like having a personal pitch coach available 24/7.',
    name: 'krish',
    role: ' Founder',
    rating: 4
  },

  {
    text: 'The platform is great, but I experienced some lag during peak hours. However, the customer support team was incredibly responsive and fixed the issues quickly.',
    name: 'Siddharth Kumar',
    role: 'Founder',
    rating: 4
  },
  {
    text: 'Being able to practice anytime without the pressure of real investors was liberating. I refined my pitch through 50+ iterations before my first real VC meeting.',
    name: 'Aditi Verma',
    role: 'Founder',
    rating: 5
  },

  {
    text: "Can't wait for the crowdfunding feature! The current platform already helped me connect with 3 potential investors through the 'Meet VCs' program. Life-changing!",
    name: 'Debdeep mukharjee',
    role: 'Founder',
    rating: 5
  },

];

interface TestimonialProps {
  testimonials?: {
    text: string;
    name: string;
    role?: string;
    rating?: number
  }[];
  title?: string;
  subtitle?: string;
  autoplaySpeed?: number;
  className?: string;
}

export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  title = 'Hear from our pitching community',
  subtitle = 'From AI-powered practice sessions to investor-ready documents, see how our platform is helping startups pitch with confidence and clarity.',
  autoplaySpeed = 3000,
  className,
}: TestimonialProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplaySpeed);

    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi, autoplaySpeed]);

  const allTestimonials = [...testimonials, ...testimonials];
  const cardColors = [
    'bg-mint text-mint-foreground',
    'bg-yellow text-yellow-foreground',
    'bg-pink text-pink-foreground',
    'bg-lavender text-lavender-foreground',
  ];

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-mint/10 py-20 md:py-28',
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative mb-12 text-center md:mb-16"
        >
          <h1 className="mb-4 text-3xl font-display font-extrabold text-ink md:text-5xl">
            {title}
          </h1>

          <motion.p
            className="text-ink/60 mx-auto max-w-2xl text-base md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="flex justify-center px-4"
                style={{ minWidth: '320px', maxWidth: '380px' }} 
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    'relative h-full w-80 rounded-3xl p-6 flex flex-col',
                    cardColors[index % cardColors.length]
                  )}
                >
                  <Quote className="h-8 w-8 -rotate-180 mb-4 opacity-40" />

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="relative mb-4 text-base leading-relaxed flex-grow"
                  >
                    <span className="relative">{testimonial.text}</span>
                  </motion.p>

                  {/* Star Rating */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.35 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-1 mb-4"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-4 h-4 transition-colors',
                          star <= (testimonial.rating || 5)
                            ? 'fill-current'
                            : 'opacity-20'
                        )}
                      />
                    ))}
                    <span className="text-sm opacity-70 ml-1">
                      {testimonial.rating || 5}/5
                    </span>
                  </motion.div>

                  {/* User info */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="mt-auto flex items-center gap-3 border-t border-current/10 pt-3"
                  >
                    <Avatar className="h-9 w-9 border border-current/10">
                      <AvatarFallback className="text-xs font-medium bg-white/60">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {testimonial.role && (
                          <p className="text-xs opacity-70 truncate">
                            {testimonial.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
