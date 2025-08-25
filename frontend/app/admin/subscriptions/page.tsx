'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Trash, Plus, Loader2, X } from 'lucide-react';
import { Subscription } from '@/lib/types/subscription';
import { SubscriptionClass } from '@/lib/httpClient/subscription';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 0,
    duration: 0,
    description: '',
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    setLoading(true);
    setError(null);
    try {
      const data = await SubscriptionClass.getAllSubscriptions();
      setSubscriptions(data?.data || []);
    } catch {
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setNewPlan((prev) => ({
      ...prev,
      [name]: ['price', 'duration'].includes(name) ? Number(value) : value,
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    try {
      await SubscriptionClass.createSubscriptionPlan(newPlan);
      toast.success('Subscription plan created');
      setNewPlan({ name: '', price: 0, duration: 0, description: '' });
      setFormVisible(false);
      fetchSubscriptions();
    } catch {
      toast.error('Failed to create subscription');
    } finally {
      setFormLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setFormLoading(true);
    try {
      await SubscriptionClass.deleteSubscriptionPlan(deleteId);
      toast.success('Subscription deleted');
      setSubscriptions((subs) => subs.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete subscription');
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-[#102135] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Manage Subscriptions
          </h1>
          <p className="mt-1 text-[#102135] text-lg">Create, view, and manage subscription plans</p>
        </div>

        {/* Subscription List */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#102135]">Subscription Plans</h2>
            <button
              onClick={() => setFormVisible(true)}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-6 py-2 text-base font-semibold hover:bg-blue-700"
            >
              <Plus size={22} />
              Add Plan
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={30} />
            </div>
          ) : subscriptions.length === 0 ? (
            <p className="text-[#102135] text-lg text-center py-10">No subscription plans found.</p>
          ) : (
            subscriptions.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-5 mb-5 flex justify-between items-center bg-white hover:shadow transition"
              >
                <div>
                  <h3 className="text-xl font-semibold text-[#102135]">{plan.name || plan.plan}</h3>
                  <p className="text-[#102135] text-base">
                    ${plan.price.toFixed(2)} &bull; {plan.duration} day{plan.duration !== 1 ? 's' : ''}
                  </p>
                  {plan.description && <p className="text-[#102135] mt-1">{plan.description}</p>}
                </div>
                <button
                  onClick={() => setDeleteId(plan.id)}
                  className="text-[#EA1414] border-2 border-[#EA1414] bg-white px-7 py-2 rounded-lg hover:bg-[#fee]" 
                  aria-label={`Delete ${plan.name || plan.plan}`}
                  disabled={formLoading}
                >
                  <Trash size={22} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Create Modal */}
        {formVisible && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-90">
            <form
              onSubmit={onSubmit}
              className="bg-white rounded-2xl max-w-lg w-full p-10 shadow-xl relative"
            >
              <button
                onClick={() => setFormVisible(false)}
                type="button"
                className="absolute right-8 top-8 text-2xl text-[#102135] hover:opacity-60"
                aria-label="Close"
              >
                <X size={30} />
              </button>
              <h2 className="text-3xl font-bold text-[#102135] mb-8">Create Subscription Plan</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[#102135] text-base font-medium mb-2">Plan Name</label>
                  <input
                    name="name"
                    value={newPlan.name}
                    onChange={onInputChange}
                    placeholder="Plan Name"
                    className="w-full border border-[#bfc9db] rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#102135] text-base font-medium mb-2">Price (USD)</label>
                  <input
                    name="price"
                    value={newPlan.price}
                    onChange={onInputChange}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0"
                    className="w-full border border-[#bfc9db] rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#102135] text-base font-medium mb-2">Duration (days)</label>
                  <input
                    name="duration"
                    value={newPlan.duration}
                    onChange={onInputChange}
                    type="number"
                    min={1}
                    step={1}
                    placeholder="0"
                    className="w-full border border-[#bfc9db] rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#102135] text-base font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newPlan.description}
                    onChange={onInputChange}
                    rows={3}
                    placeholder="Description"
                    className="w-full border border-[#bfc9db] rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-10">
                <button
                  type="button"
                  onClick={() => setFormVisible(false)}
                  className="px-10 py-3 border-2 border-[#bfc9db] rounded-lg text-[#102135] text-lg font-semibold bg-white hover:bg-[#f6f9fb] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-10 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {formLoading ? <Loader2 className="animate-spin mx-auto" size={22} /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10">
              <h3 className="text-3xl font-bold text-[#102135] mb-6">Confirm Delete</h3>
              <p className="text-lg text-[#102135] mb-10">
                Are you sure you want to delete this subscription plan?
              </p>
              <div className="flex justify-center gap-8 mt-8">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-10 py-3 border-2 border-[#bfc9db] rounded-lg text-[#102135] text-lg font-semibold bg-white hover:bg-[#f6f9fb] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={formLoading}
                  className="px-10 py-3 rounded-lg bg-[#EA1414] text-white text-lg font-semibold hover:bg-[#c51212] transition disabled:opacity-70"
                >
                  {formLoading ? <Loader2 className="animate-spin mx-auto" size={22} /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
