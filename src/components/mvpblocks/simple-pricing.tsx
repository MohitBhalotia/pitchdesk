"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Check, IndianRupee, Sparkles } from "lucide-react";
import { plans } from "data/plans";
import { useSession } from "next-auth/react";



export default function SimplePricing() {
  const router = useRouter();
  const {data: session} = useSession(); //useUser();
  const user = session?.user;
  // const getCheckoutUrl = async (plan: string) => {
  //   const response = await axios.post("/api/stripe/checkout", {
  //     plan: plan,
  //     email: user?.email as string,
  //   });
  //   if (response.data.url) {
  //     console.log("response.data.url", response.data.url);
  //     localStorage.setItem('checkoutToken', response.data.token);
  //     router.push(response.data.url);
  //   } else {
  //     toast.error("Failed to get checkout URL");
  //   }
  // };

  return (
    <div id="pricing" className="not-prose  py-10 relative flex w-full flex-col gap-16 overflow-hidden px-4 text-center ">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center space-y-2">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
          >
            <Sparkles className="text-primary mr-1 h-3.5 w-3.5 animate-pulse" />
            Simple, Transparent Pricing
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pb-4 from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
          >
            Start with our free trial and scale as you grow. No hidden fees, no
            surprises.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-md pt-2 text-lg"
          >
            Simple, transparent pricing that scales with your business. No
            hidden fees, no surprises.
          </motion.p>
        </div>

        <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-4">
          {Object.values(plans).map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex"
            >
              <Card
                className={cn(
                  "bg-secondary/20 relative h-full w-full text-left transition-all duration-300 hover:shadow-lg",
                  plan.popular
                    ? "ring-primary/50 dark:shadow-primary/10 shadow-md ring-2"
                    : "hover:border-primary/30",
                  plan.popular &&
                    "from-primary/[0.03] bg-gradient-to-b to-transparent"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-0 left-0 mx-auto w-fit">
                    <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 shadow-sm">
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className={cn("pb-4", plan.popular && "pt-8")}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        plan.popular
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-foreground"
                      )}
                    >
                      <plan.icon className="h-4 w-4" />
                    </div>
                    <CardTitle
                      className={cn(
                        "text-xl font-bold",
                        plan.popular && "text-primary"
                      )}
                    >
                      {plan.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-3 space-y-2">
                    <p className="text-sm">{plan.description}</p>
                    <div className="pt-2">
                        <div className="flex items-baseline">
                          <span
                            className={cn(
                              "text-3xl font-bold flex items-center gap-1",
                              plan.popular ? "text-primary" : "text-foreground"
                            )}
                          >
                          <IndianRupee/>{plan.price}
                          </span>
                        </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 pb-6">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full",
                          plan.popular
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span
                        className={
                          plan.popular
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </CardContent>
                <CardFooter className={cn(plan.popular && "pointer-events-auto relative z-10")}>
                  {user?.role === plan.id ? (
                    <Button className="w-full font-medium duration-300 bg-white text-black">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (user) {
                          console.log("plan", plan);
                          // getCheckoutUrl(plan.id);
                          toast.success("Redirecting to checkout...");
                        } else {
                          toast.info("Please log in to continue");
                          router.push("/login");
                        }
                      }}
                      variant={plan.popular ? "default" : "outline"}
                      className={cn(
                        "w-full font-medium transition-all duration-300",
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-md"
                          : "hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      {plan.cta}
                    </Button>
                  )}
                </CardFooter>

                {/* Subtle gradient effects */}
                {plan.popular ? (
                  <>
                    <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-lg bg-gradient-to-t to-transparent" />
                    <div className="border-primary/20 pointer-events-none absolute inset-0 rounded-lg border" />
                  </>
                ) : (
                  <div className="hover:border-primary/10 pointer-events-none absolute inset-0 rounded-lg border border-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}