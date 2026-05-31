"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToOrders, updateOrderStatus, ORDER_STATUSES } from "@/lib/orders";
import { PRICING } from "@/lib/constants";

const TK = PRICING.currencySymbol;

const STATUS_STYLES = {
  Pending:   "bg-amber-100 text-amber-800 border-amber-300",
  Shipped:   "bg-blue-100 text-blue-800 border-blue-300",
  Delivered: "bg-emerald-mid/15 text-emerald-mid border-emerald-mid/40",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function AdminDashboard({ user, onSignOut }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const unsub = subscribeToOrders(
      (data) => { setOrders(data); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); }
    );
    return () => unsub?.();
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + (o.amountPaidAdvance || 0), 0);
    const byStatus = ORDER_STATUSES.reduce((acc, s) => {
      acc[s] = orders.filter((o) => o.orderStatus === s).length;
      return acc;
    }, {});
    return { total: orders.length, revenue, byStatus };
  }, [orders]);

  const visible = filter === "All" ? orders : orders.filter((o) => o.orderStatus === filter);

  async function changeStatus(id, status) {
    setBusyId(id);
    try {
      const orderData = orders.find((o) => o.id === id) || null;
      await updateOrderStatus(id, status, orderData);
    } catch (e) {
      alert("Could not update status: " + e.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="bg-emerald-deep text-white px-5 sm:px-10 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Amar Bagan — Orders</h1>
          <p className="text-white/60 text-sm">{user?.email}</p>
        </div>
        <button onClick={onSignOut} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors">
          Sign out
        </button>
      </header>

      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Orders" value={stats.total} />
          <StatCard label="Advance Collected" value={`${TK}${stats.revenue.toLocaleString()}`} gold />
          <StatCard label="Pending" value={stats.byStatus.Pending || 0} />
          <StatCard label="Delivered" value={stats.byStatus.Delivered || 0} />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", ...ORDER_STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                filter === s ? "bg-emerald text-white border-emerald" : "bg-white text-ink border-line hover:border-gold-soft"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {loading && <p className="text-ink-soft py-12 text-center">Loading orders…</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            {error.includes("permission") || error.includes("insufficient")
              ? "Permission denied. Confirm this email is in NEXT_PUBLIC_ADMIN_EMAILS and in firestore.rules."
              : "Error loading orders: " + error}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="text-ink-soft py-12 text-center">No orders in this view yet.</p>
        )}

        {/* Orders */}
        <div className="space-y-4">
          {visible.map((o) => (
            <div key={o.id} className="bg-cream-card border border-line rounded-xl p-5 shadow-soft">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display text-lg font-semibold text-ink">{o.customerName}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[o.orderStatus] || ""}`}>
                      {o.orderStatus}
                    </span>
                    {o.paymentPlan === "full_prepayment" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-bg text-gold">Pre-paid · +{o.bonusKg}kg</span>
                    )}
                  </div>
                  <p className="text-sm text-ink-soft mt-1">
                    {o.phone} · {o.city}
                  </p>
                  <p className="text-sm text-ink-soft">{o.address}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-bold text-gold">{TK}{(o.amountPaidAdvance || 0).toLocaleString()}</div>
                  <div className="text-xs text-ink-soft">paid now</div>
                  {o.balanceDue > 0 && (
                    <div className="text-xs text-ink-soft mt-1">Balance: {TK}{o.balanceDue.toLocaleString()}</div>
                  )}
                </div>
              </div>

              {/* Status controls */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line">
                {ORDER_STATUSES.map((s) => (
                  <button key={s} disabled={busyId === o.id || o.orderStatus === s}
                    onClick={() => changeStatus(o.id, s)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      o.orderStatus === s ? "bg-emerald text-white border-emerald" : "bg-white text-ink border-line hover:border-emerald"
                    }`}>
                    {s}
                  </button>
                ))}
                <span className="ml-auto text-xs text-ink-soft self-center">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, gold }) {
  return (
    <div className="bg-cream-card border border-line rounded-xl p-4">
      <div className="text-xs text-ink-soft uppercase tracking-wide">{label}</div>
      <div className={`font-display text-2xl font-bold mt-1 ${gold ? "text-gold" : "text-emerald"}`}>{value}</div>
    </div>
  );
}
