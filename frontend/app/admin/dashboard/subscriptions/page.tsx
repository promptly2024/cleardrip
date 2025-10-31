"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Trash2, Plus, Loader2, X, AlertCircle, Menu } from "lucide-react";
import { Subscription } from "@/lib/types/subscription";
import { SubscriptionClass } from "@/lib/httpClient/subscription";
import { toast } from "sonner";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: "",
    price: 0,
    duration: 0,
    description: "",
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const data = await SubscriptionClass.getAllSubscriptions();
      setSubscriptions(data?.data || []);
    } catch (error: any) {
      console.error("Failed to fetch subscriptions:", error);
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setNewPlan((prev) => ({
      ...prev,
      [name]: ["price", "duration"].includes(name) ? Number(value) : value,
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!newPlan.name.trim()) {
      toast.error("Plan name is required");
      return;
    }
    if (newPlan.price < 0) {
      toast.error("Price cannot be negative");
      return;
    }
    if (newPlan.duration < 1) {
      toast.error("Duration must be at least 1 day");
      return;
    }

    setFormLoading(true);
    try {
      await SubscriptionClass.createSubscriptionPlan(newPlan);
      toast.success("Subscription plan created successfully");
      setNewPlan({ name: "", price: 0, duration: 0, description: "" });
      setFormVisible(false);
      fetchSubscriptions();
    } catch (error: any) {
      console.error("Failed to create subscription:", error);
      toast.error(error.message || "Failed to create subscription");
    } finally {
      setFormLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    
    setDeleteError(null);
    setFormLoading(true);
    
    try {
      console.log("Attempting to delete subscription with ID:", deleteId);
      
      const response = await SubscriptionClass.deleteSubscriptionPlan(deleteId);
      
      console.log("Delete response:", response);
      
      toast.success("Subscription deleted successfully");
      setSubscriptions((subs) => subs.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      console.error("Delete error details:", {
        message: error.message,
        status: error.status,
        response: error.response,
        error: error,
      });
      
      const errorMessage = error.message || error.response?.data?.message || "Failed to delete subscription";
      setDeleteError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Create and manage plans
                </p>
              </div>
            </div>

            <button
              onClick={() => setFormVisible(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors text-xs sm:text-sm font-medium flex-shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Plan</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Subscription List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Subscription Plans
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12 sm:py-16">
                <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  No subscription plans found.
                </p>
                <button
                  onClick={() => setFormVisible(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Plan
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {subscriptions.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                        {plan.name}
                      </h3>
                      <p className="text-sm sm:text-base text-blue-600 font-medium mt-1">
                        ${plan.price.toFixed(2)} • {plan.duration} day
                        {plan.duration !== 1 ? "s" : ""}
                      </p>
                      {plan.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setDeleteId(plan.id);
                        setDeleteError(null);
                      }}
                      className="px-3 py-2 rounded-md border border-red-400 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 flex-shrink-0 self-start sm:self-auto"
                      title="Delete subscription plan"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm hidden sm:inline">Delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {formVisible && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4 overflow-y-auto">
          <form
            onSubmit={onSubmit}
            className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10 my-auto"
          >
            <button
              onClick={() => setFormVisible(false)}
              type="button"
              className="absolute right-3 sm:right-6 top-3 sm:top-6 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
              Create Subscription Plan
            </h2>

            <div className="space-y-3 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Plan Name *
                </label>
                <input
                  name="name"
                  value={newPlan.name}
                  onChange={onInputChange}
                  placeholder="e.g., Premium Monthly"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Price (USD) *
                  </label>
                  <input
                    name="price"
                    value={newPlan.price}
                    onChange={onInputChange}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Duration (days) *
                  </label>
                  <input
                    name="duration"
                    value={newPlan.duration}
                    onChange={onInputChange}
                    type="number"
                    min={1}
                    step={1}
                    placeholder="30"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={newPlan.description}
                  rows={3}
                  onChange={onInputChange}
                  placeholder="Enter plan description..."
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 sm:mt-10">
              <button
                type="button"
                onClick={() => setFormVisible(false)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-700 bg-white font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-blue-600 text-white font-medium text-sm sm:text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Plan"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 my-auto">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
              Confirm Delete
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center">
              Are you sure you want to delete this subscription plan? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-red-800">{deleteError}</div>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => {
                  setDeleteId(null);
                  setDeleteError(null);
                }}
                disabled={formLoading}
                className="flex-1 border border-gray-300 bg-white text-gray-700 rounded-lg py-2.5 sm:py-3 font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={formLoading}
                className="flex-1 bg-red-600 text-white rounded-lg py-2.5 sm:py-3 font-medium text-sm sm:text-base hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
