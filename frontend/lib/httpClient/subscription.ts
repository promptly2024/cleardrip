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

      return result;
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      throw error;
    }
  }

  // Subscribe to a plan
  static async subscribeToPlan(planId: string): Promise<SubscriptionResponse> {
    try {
      const response = await fetch(`${APIURL}/subscriptions/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId }),
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

  // Get all available subscription plans
  static async getAllSubscriptions(): Promise<SubscriptionResponse> {
    try {
      const response = await fetch(`${APIURL}/subscriptions/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Failed to fetch subscription plans", {
          description: result.message || "Cannot retrieve subscription plans",
        });
        throw new Error(result.message || "Cannot retrieve subscription plans");
      }

      return result;
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      throw error;
    }
  }

  // Create a new subscription plan (Admin only)
  static async createSubscriptionPlan(subscriptionData: any): Promise<SubscriptionResponse> {
    try {
      const response = await fetch(`${APIURL}/subscriptions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(subscriptionData),
      });
      
      const result = await response.json();
      if (!response.ok) {
        toast.error("Failed to create subscription plan", {
          description: result.message || "Cannot create subscription plan",
        });
        throw new Error(result.message || "Cannot create subscription plan");
      }

      toast.success("Subscription plan created successfully");
      return result;
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      throw error;
    }
  }

  // Delete Subscription
  static async deleteSubscriptionPlan(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${APIURL}/subscriptions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error("Failed to delete subscription plan", {
          description: result.message || "Failed to delete plan",
        });
        throw new Error(result.message || "Failed to delete plan");
      }

      toast.success("Subscription plan deleted");
      return result;
    } catch (error) {
      console.error("Error deleting subscription plan:", error);
      throw error;
    }
  }

}

