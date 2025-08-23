import { APIURL } from "@/utils/env";
import { toast } from "sonner";
import { SubscriptionResponse } from "../types/subscription";

export class SubscriptionClass {
  // Get current user's active subscription
  static async getCurrentSubscription(): Promise<SubscriptionResponse> {
    try {
      const response = await fetch(`${APIURL}/subscriptions/current`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Failed to fetch current subscription", {
          description: result.message || "Cannot retrieve subscription",
        });
        throw new Error(result.message || "Cannot retrieve subscription");
      }

      toast.success("Current subscription retrieved successfully");
      return result;
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      throw error;
    }
  }

  // Subscribe to a plan (default Monthly)
  static async subscribeToPlan(): Promise<SubscriptionResponse> {
    try {
      const response = await fetch(`${APIURL}/subscriptions/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Failed to create subscription", {
          description: result.message || "Cannot subscribe",
        });
        throw new Error(result.message || "Cannot subscribe");
      }

      toast.success("Subscription created successfully");
      return result;
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      throw error;
    }
  }
}
