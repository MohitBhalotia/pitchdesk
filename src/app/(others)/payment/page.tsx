'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NumberFlow from '@number-flow/react';
import { BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const PAYMENT_FREQUENCIES: ('monthly' | 'yearly')[] = ['monthly', 'yearly'];
const TIERS = [
  {
    id: 'standard',
    name: 'Standard',
    planId: "68aa8cbf5958f9468e59ca14",
    price: {
      monthly: 699,
      yearly: 6000,
    },
    description: 'Everything you need to build and scale your business.',
    features: [
      '3 Pitches of 20 minutes each',
      'Includes a deeper and longer qna session',
      'Single-user account',
      '1 English + 1 Hindi general AI VC',
      'Priority email support',
      'Analysis and improvement of your pitch',
      'Pitch improvement suggestions',
      'Perrsonalised pitch generation',
    ],
    cta: 'Buy Now',
    // popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    planId: "68aa8cbf5958f9468e59ca15",
    price: {
      monthly: 1999,
      yearly: 15000,
    },
    description: 'Critical security, performance, observability and support.',
    features: [
      '10 Pitches of 20 minutes each',
      'Includes a deeper and longer qna session',
      'Single-user account',
      '6 English + 6 Hindi AI VC',
      'All 12 having different personalities',
      'Priority email support',
      'Analysis and improvement of your pitch',
      'Pitch improvement suggestions',
      'Perrsonalised pitch generation',
    ],
    cta: 'Buy Now',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    planId: "68aa8cbf5958f9468e59ca16",
    price: {
      monthly: 4999,
      yearly: 35000,
    },
    description: 'Critical security, performance, observability and support.',
    features: [
      '25 Pitches of 20 minutes each',
      'Includes a deeper and longer qna session',
      'Single-user account',
      '6 English + 6 Hindi AI VC',
      'All 12 having different personalities',
      'Real time venture capitalists connections',
      'Priority email support',
      'Analysis and improvement of your pitch',
      'Pitch improvement suggestions',
      'Personalised pitch generation',
    ],
    cta: 'Buy Now',
  },

];


const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(240,119,119,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,119,118,0.3),rgba(255,255,255,0))] pointer-events-none" />
);

// const Tab = ({
//   text,
//   selected,
//   setSelected,
//   discount = false,
// }: {
//   text: string;
//   selected: boolean;
//   setSelected: (text: string) => void;
//   discount?: boolean;
// }) => {
//   return (
//     <button
//       onClick={() => setSelected(text)}
//       className={cn(
//         'text-foreground relative w-fit px-4 py-2 text-sm font-semibold capitalize transition-colors',
//         discount && 'flex items-center justify-center gap-2.5',
//       )}
//     >
//       <span className="relative z-10">{text}</span>
//       {selected && (
//         <motion.span
//           layoutId="tab"
//           transition={{ type: 'spring', duration: 0.4 }}
//           className="bg-background absolute inset-0 z-0 rounded-full shadow-sm"
//         ></motion.span>
//       )}
//       {discount && (
//         <Badge
//           className={cn(
//             'relative z-10 bg-gray-100 text-xs whitespace-nowrap text-black shadow-none hover:bg-gray-100',
//             selected
//               ? 'bg-[#F3F4F6] hover:bg-[#F3F4F6]'
//               : 'bg-gray-300 hover:bg-gray-300',
//           )}
//         >
//           Save 35%
//         </Badge>
//       )}
//     </button>
//   );
// };

const PricingCard = ({
  tier,
  paymentFrequency,
  submitPayment,
  loading
}: {
  tier: (typeof TIERS)[0];
  paymentFrequency: keyof typeof tier.price;
  submitPayment: (planId: string) => void;
  loading: boolean;
}) => {
  const price = tier.price[paymentFrequency];
  const isPopular = tier.popular;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow',
        'bg-background text-foreground',
        // isPopular && 'outline outline-[#eb638a]',
      )}
    >
      {isPopular && <PopularBackground />}

      <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
        {tier.name}
        {isPopular && (
          <Badge className="mt-1 bg-orange-900 px-1 py-0 text-white hover:bg-orange-900">
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      <div className="relative h-12">
        {typeof price === 'number' ? (
          <>
            <NumberFlow
              format={{
                style: 'currency',
                currency: 'INR',
                trailingZeroDisplay: 'stripIfInteger',
              }}
              value={price}
              className="text-4xl font-medium"
            />
            <p className="-mt-2 text-xs font-medium">Per month/user</p>
          </>
        ) : (
          <h1 className="text-4xl font-medium">{price}</h1>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm font-medium',
                'text-foreground/60',
              )}
            >
              <BadgeCheck strokeWidth={1} size={16} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={cn(
          'h-fit w-full rounded-lg',
        )}
        onClick={() => submitPayment(tier.planId)}
        disabled={loading}
      >
        {loading ? 'Processing...' : tier.cta}
      </Button>
    </div>
  );
};

export default function PricingSection() {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState<
    'monthly' | 'yearly'
  >(PAYMENT_FREQUENCIES[0]);

  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?._id;
  const userName = session?.user?.fullName || "User";
  const userEmail = session?.user?.email || "user@email.com";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (planId: string) => {
    setLoading(true);
    try {
      //check for user logg in
      if (!userId) {
        alert("User not logged in. Please sign in to continue.");
        setLoading(false);
        router.push("/login");
        return;
      }
      
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        body: JSON.stringify({ planId, userId }), //i think userId backend me session se leni chahiye..auth se
      });
      const data = await res.json();

      if (!data.key) {
        alert("Error creating order");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "PitchDesk",
        description: "Plan Subscription",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any){
          const res = await fetch("/api/razorpay/payment/verify", {
            method: "POST",
            body: JSON.stringify(response),
          });
          const resData = await res.json();
          console.log(resData)
          alert("Payment successful!");
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch  {
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="flex flex-col items-center gap-10 py-10 bg-gray-100 dark:bg-[#111]">
      <div className="space-y-7 text-center">
        <div className="space-y-4 ">
          <h1 className="text-4xl font-medium md:text-5xl">
            Plans and Pricing
          </h1>
          <p>
            Receive unlimited credits when you pay yearly, and save on your
            plan.
          </p>
        </div>
        {/* <div className="mx-auto flex w-fit rounded-full bg-[#F3F4F6] p-1 dark:bg-[#222]">
          {PAYMENT_FREQUENCIES.map((freq) => (
            <Tab
              key={freq}
              text={freq}
              selected={selectedPaymentFreq === freq}
              setSelected={(text) =>
                setSelectedPaymentFreq(text as 'monthly' | 'yearly')
              }
              discount={freq === 'yearly'}
            />
          ))}
        </div> */}
      </div>

      <div className="  grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 ">
        {TIERS.map((tier, i) => (
          <PricingCard
            key={i}
            tier={tier}
            paymentFrequency={selectedPaymentFreq}
            submitPayment={handlePayment}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}

