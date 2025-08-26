"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Trash2, Plus, Loader2, X } from "lucide-react";
import { Subscription } from "@/lib/types/subscription";
import { SubscriptionClass } from "@/lib/httpClient/subscription";
import { toast } from "sonner";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: "",
    price: 0,
    duration: 0,
    description: "",
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const data = await SubscriptionClass.getAllSubscriptions();
      setSubscriptions(data?.data || []);
    } catch {
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
    setFormLoading(true);
    try {
      await SubscriptionClass.createSubscriptionPlan(newPlan);
      toast.success("Subscription plan created");
      setNewPlan({ name: "", price: 0, duration: 0, description: "" });
      setFormVisible(false);
      fetchSubscriptions();
    } catch {
      toast.error("Failed to create subscription");
    } finally {
      setFormLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setFormLoading(true);
    try {
      await SubscriptionClass.deleteSubscriptionPlan(deleteId);
      toast.success("Subscription deleted");
      setSubscriptions((subs) => subs.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete subscription");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Subscription Management
          </h1>
          <p className="mt-1 text-gray-600">
            Create, view, and manage subscription plans
          </p>
        </div>

        {/* Subscription List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Subscription Plans
            </h2>
            <button
              onClick={() => setFormVisible(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Plan
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No subscription plans found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 border rounded-lg bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      ${plan.price.toFixed(2)} • {plan.duration} day
                      {plan.duration !== 1 ? "s" : ""}
                    </p>
                    {plan.description && (
                      <p className="text-gray-600 mt-1">{plan.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setDeleteId(plan.id)}
                    className="px-3 py-2 rounded-md border border-red-400 text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Modal */}
        {formVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(243_246_255_/0.85)] backdrop-blur-md px-2">
            <form
              onSubmit={onSubmit}
              className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-10 relative"
              style={{boxShadow: "0 8px 32px rgba(68, 89, 128, 0.12)"}}
            >
              <button
                onClick={() => setFormVisible(false)}
                type="button"
                className="absolute right-7 top-7 text-gray-300 hover:text-gray-500 text-2xl"
                aria-label="Close"
              >
                <X className="w-7 h-7" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Create Subscription Plan
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">
                    Plan Name
                  </label>
                  <input
                    name="name"
                    value={newPlan.name}
                    onChange={onInputChange}
                    placeholder="Plan Name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">
                    Price (USD)
                  </label>
                  <input
                    name="price"
                    value={newPlan.price}
                    onChange={onInputChange}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">
                    Duration (days)
                  </label>
                  <input
                    name="duration"
                    value={newPlan.duration}
                    onChange={onInputChange}
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Number of days"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newPlan.description}
                    rows={3}
                    onChange={onInputChange}
                    placeholder="Description (optional)"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => setFormVisible(false)}
                  className="px-9 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-9 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {formLoading ? <Loader2 className="animate-spin mx-auto" size={22} /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(243_246_255_/0.85)] backdrop-blur-md px-2">
            <div
              className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 flex flex-col items-center"
              style={{boxShadow: "0 8px 32px rgba(68, 89, 128, 0.13)"}}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                Confirm Delete
              </h2>
              <p className="text-gray-600 mb-7 text-center">
                Are you sure you want to delete this subscription plan?
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-gray-300 bg-white text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition"
                >
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
