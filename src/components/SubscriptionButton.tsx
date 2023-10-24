"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props = { isPro: boolean };

const SubscriptionButton = (props: Props) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe");
      if (!response.ok) {
        throw new Error("Error in fetching messages");
      }
      const data = (await response.json()) as {
        url: string;
      };

      router.push(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button disabled={loading} onClick={handleSubscription} variant="outline">
      {props.isPro ? "Manage Subscriptions" : "Get Pro"}
    </Button>
  );
};

export default SubscriptionButton;
