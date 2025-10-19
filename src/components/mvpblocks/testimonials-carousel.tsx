'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const defaultTestimonials = [
  {
    text: 'PitchDesk helped me transform my messy pitch into a compelling story. The AI judges gave me brutally honest feedback that actually helped me secure my first funding!',
    imageSrc: '/assets/avatars/avatar-1.webp',
    name: 'Bhargav bidkar',
    role: 'Startup Founder',
    rating: 5
  },
  {
    text: 'As a student with no pitching experience, I was terrified. But practicing with AI judges built my confidence. Now I can pitch my college project to investors without sweating!',
    imageSrc: '/assets/avatars/avatar-2.webp',
    name: 'Priya Patel',
    role: 'Student',
    rating: 5
  },
  {
    text: 'The pitch document generator saved me 20+ hours of work. It created investor-ready decks that I could customize. This platform is a game-changer for early-stage founders.',
    imageSrc: '/assets/avatars/avatar-3.webp',
    name: 'Pawan raut',
    role: 'Entrepreneur',
    rating: 4
  },
  {
    text: 'I wish the AI could provide more industry-specific feedback for deep tech startups. Great for basic pitching, but needs more customization options for specialized domains.',
    imageSrc: '/assets/avatars/avatar-4.webp',
    name: 'Pankaj quriyal',
    role: 'Biotech Founder',
    rating: 3
  },
  {
    text: 'Practicing with different VC personas helped me understand what different investors look for. My pitch success rate improved from 20% to 65% in just 2 months!',
    imageSrc: '/assets/avatars/avatar-5.webp',
    name: 'Suraj bhan',
    role: 'Serial Entrepreneur',
    rating: 5
  },
  {
    text: 'The evaluation metrics are super detailed - from body language analysis to content structure. It felt like having a personal pitch coach available 24/7.',
    imageSrc: '/assets/avatars/avatar-6.webp',
    name: 'krish',
    role: ' Founder',
    rating: 4
  },

  {
    text: 'The platform is great, but I experienced some lag during peak hours. However, the customer support team was incredibly responsive and fixed the issues quickly.',
    imageSrc: '/assets/avatars/avatar-8.webp',
    name: 'Siddharth Kumar',
    role: 'Founder',
    rating: 4
  },
  {
    text: 'Being able to practice anytime without the pressure of real investors was liberating. I refined my pitch through 50+ iterations before my first real VC meeting.',
    imageSrc: '/assets/avatars/avatar-9.webp',
    name: 'Aditi Verma',
    role: 'Founder',
    rating: 5
  },

  {
    text: "Can't wait for the crowdfunding feature! The current platform already helped me connect with 3 potential investors through the 'Meet VCs' program. Life-changing!",
    imageSrc: '/assets/avatars/avatar-11.webp',
    name: 'Debdeep mukharjee',
    role: 'Founder',
    rating: 5
  },

];

interface TestimonialProps {
  testimonials?: {
    text: string;
    imageSrc: string;
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

  return (
    <section
      className={cn('relative overflow-hidden py-16 md:py-24', className)}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative mb-12 text-center md:mb-16"
        >
          <h1 className="from-foreground to-foreground/40 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-bold text-transparent md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <motion.p
            className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg"
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
                  className="border-border from-secondary/20 to-card relative h-full w-80 rounded-2xl border bg-gradient-to-b p-6 shadow-md backdrop-blur-sm flex flex-col" // Added w-80 and flex-col
                >
                  {/* Enhanced decorative gradients */}
                  <div className="from-primary/15 to-card absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b blur-md" />
                  <div className="from-primary/10 absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-gradient-to-t to-transparent opacity-70 blur-xl" />

                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-primary mb-4"
                  >
                    <div className="relative">
                      <Quote className="h-8 w-8 -rotate-180" /> 
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-foreground/90 relative mb-4 text-base leading-relaxed flex-grow" 
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
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      {testimonial.rating || 5}/5
                    </span>
                  </motion.div>

                  {/* Enhanced user info with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="border-border/40 mt-auto flex items-center gap-3 border-t pt-3"
                  >
                    <Avatar className="border-border ring-primary/10 ring-offset-background h-9 w-9 border ring-2 ring-offset-1"> {/* Slightly smaller avatar */}
                      <AvatarImage
                        src={testimonial.imageSrc}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="text-xs font-medium">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1"> 
                      <h4 className="text-foreground font-medium text-sm truncate"> 
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {testimonial.role && (
                          <p className="text-muted-foreground text-xs truncate"> 
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
