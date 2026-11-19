import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek, MessInventoryItem, MessMenuItem } from '../../types';
import {
  Utensils,
  Package,
  Star,
  Edit2,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  ChefHat,
} from 'lucide-react';

export const WardenMessTab: React.FC = () => {
  const {
    weeklyMenu,
    updateDailyMenu,
    messInventory,
    updateInventoryStock,
    messFeedbacks,
  } = useApp();

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  // Menu editor modal
  const [isMenuEditorOpen, setIsMenuEditorOpen] = useState(false);
  const currentMenu = weeklyMenu.find((m) => m.dayOfWeek === selectedDay) || weeklyMenu[0];

  const [breakfastItems, setBreakfastItems] = useState(currentMenu.breakfast.items.join(', '));
  const [lunchItems, setLunchItems] = useState(currentMenu.lunch.items.join(', '));
  const [lunchSpecial, setLunchSpecial] = useState(currentMenu.lunch.specialDish || '');
  const [snacksItems, setSnacksItems] = useState(currentMenu.snacks.items.join(', '));
  const [dinnerItems, setDinnerItems] = useState(currentMenu.dinner.items.join(', '));
  const [dinnerSweet, setDinnerSweet] = useState(currentMenu.dinner.dessert || (currentMenu.dinner as any).sweet || '');
  const [menuSavedMsg, setMenuSavedMsg] = useState(false);

  // Stock edit modal
  const [editingItem, setEditingItem] = useState<MessInventoryItem | null>(null);
  const [newStockQty, setNewStockQty] = useState('');

  const handleOpenMenuEditor = () => {
    const m = weeklyMenu.find((item) => item.dayOfWeek === selectedDay) || weeklyMenu[0];
    setBreakfastItems(m.breakfast.items.join(', '));
    setLunchItems(m.lunch.items.join(', '));
    setLunchSpecial(m.lunch.specialDish || '');
    setSnacksItems(m.snacks.items.join(', '));
    setDinnerItems(m.dinner.items.join(', '));
    setDinnerSweet(m.dinner.dessert || (m.dinner as any).sweet || '');
    setIsMenuEditorOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MessMenuItem = {
      ...currentMenu,
      dayOfWeek: selectedDay,
      breakfast: {
        ...currentMenu.breakfast,
        items: breakfastItems.split(',').map((s) => s.trim()).filter(Boolean),
      },
      lunch: {
        ...currentMenu.lunch,
        items: lunchItems.split(',').map((s) => s.trim()).filter(Boolean),
        specialDish: lunchSpecial,
      },
      snacks: {
        ...currentMenu.snacks,
        items: snacksItems.split(',').map((s) => s.trim()).filter(Boolean),
      },
      dinner: {
        ...currentMenu.dinner,
        items: dinnerItems.split(',').map((s) => s.trim()).filter(Boolean),
        dessert: dinnerSweet,
      },
    };

    updateDailyMenu(updated);
    setMenuSavedMsg(true);
    setTimeout(() => {
      setMenuSavedMsg(false);
      setIsMenuEditorOpen(false);
    }, 1200);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !newStockQty) return;
    updateInventoryStock(editingItem.id, Number(newStockQty));
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Annapurna Mess &amp; Ration Command
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Update weekly meal timetables, supervise ration stock inventory, and monitor hygiene feedback.
          </p>
        </div>

        <button
          onClick={handleOpenMenuEditor}
          className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(139,92,246,0.3)] cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit {selectedDay} Menu</span>
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === day
                ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                : 'bg-[#16181D] text-zinc-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 4-Meal Cards for Selected Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Breakfast */}
        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] space-y-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-xs font-semibold text-amber-400">Breakfast</span>
            <span className="text-[10px] text-zinc-400 font-mono">{currentMenu.breakfast.time}</span>
          </div>
          <p className="text-xs font-semibold text-white">{currentMenu.breakfast.items.join(' • ')}</p>
          <p className="text-[11px] text-zinc-400">
            {(currentMenu.breakfast as any).calories || (currentMenu.breakfast as any).beverage || 'Tea / Coffee / Fresh Fruit'}
          </p>
        </div>

        {/* Lunch */}
        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] space-y-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-xs font-semibold text-emerald-400">Lunch Thali</span>
            <span className="text-[10px] text-zinc-400 font-mono">{currentMenu.lunch.time}</span>
          </div>
          <p className="text-xs font-semibold text-white">{currentMenu.lunch.items.join(' • ')}</p>
          <p className="text-[11px] text-emerald-400 font-medium">
            {currentMenu.lunch.specialDish || (currentMenu.lunch as any).specialNote || 'Chef Special Thali with Raita'}
          </p>
        </div>

        {/* Snacks */}
        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] space-y-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-xs font-semibold text-violet-400">High Tea &amp; Snacks</span>
            <span className="text-[10px] text-zinc-400 font-mono">{currentMenu.snacks.time}</span>
          </div>
          <p className="text-xs font-semibold text-white">{currentMenu.snacks.items.join(' • ')}</p>
          <p className="text-[11px] text-zinc-400">
            {(currentMenu.snacks as any).beverage || 'Cutting Chai / Filter Coffee'}
          </p>
        </div>

        {/* Dinner */}
        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] space-y-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-xs font-semibold text-sky-400">Dinner Deluxe</span>
            <span className="text-[10px] text-zinc-400 font-mono">{currentMenu.dinner.time}</span>
          </div>
          <p className="text-xs font-semibold text-white">{currentMenu.dinner.items.join(' • ')}</p>
          <p className="text-[11px] text-amber-400 font-semibold">
            Sweet: {currentMenu.dinner.dessert || (currentMenu.dinner as any).sweet || 'Badam Kheer / Gulab Jamun'}
          </p>
        </div>
      </div>

      {/* Mess Stock & Feedback Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ration Inventory Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-display text-white font-bold">Kitchen Ration Inventory</h3>
            </div>
            <span className="text-xs text-zinc-400">Audited Weekly</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16181D] border-b border-white/[0.08] text-zinc-400">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Item &amp; Category</th>
                  <th className="py-2.5 px-3 font-semibold">Available Stock</th>
                  <th className="py-2.5 px-3 font-semibold">Min Threshold</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {messInventory.map((item) => {
                  const displayName = item.name || item.itemName || 'Ration Item';
                  const currentStockQty = item.currentStock ?? item.quantity ?? 0;
                  const thresholdQty = item.minimumStock ?? item.threshold ?? 0;
                  const isLow = currentStockQty <= thresholdQty;

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-white">{displayName}</p>
                        <p className="text-[10px] text-zinc-400">{item.category}</p>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-white">
                        <span className={isLow ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {currentStockQty}
                        </span>{' '}
                        <span className="text-zinc-400">{item.unit}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">
                        {thresholdQty} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setNewStockQty(currentStockQty.toString());
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#16181D] hover:bg-[#1E2026] border border-white/[0.12] text-zinc-200 text-[11px] font-medium cursor-pointer"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Reviews Stream */}
        <div className="p-6 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Food Reviews</h3>
            <span className="text-xs text-amber-400 font-bold">★ 4.8 / 5.0</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {messFeedbacks.map((fb) => (
              <div key={fb.id} className="p-3.5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{fb.studentName}</span>
                  <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                    Room {fb.roomNumber || 'A-204'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-400 font-medium">{fb.meal || fb.mealType || 'General'} • {fb.date}</p>
                <p className="text-xs text-zinc-300 italic">"{fb.comments}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Editor Modal */}
      {isMenuEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMenuEditorOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#111215] rounded-3xl p-6 sm:p-8 border border-white/[0.12] shadow-2xl relative max-h-[90vh] overflow-y-auto text-zinc-100"
          >
            <button
              onClick={() => setIsMenuEditorOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-display text-white font-bold mb-1">Edit {selectedDay}'s Menu</h3>
            <p className="text-xs text-zinc-400 mb-6">Changes update instantly across all student dashboards.</p>

            {menuSavedMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold">Menu Updated Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Breakfast Menu (comma separated)</label>
                  <input
                    type="text"
                    value={breakfastItems}
                    onChange={(e) => setBreakfastItems(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Lunch Items (comma separated)</label>
                    <input
                      type="text"
                      value={lunchItems}
                      onChange={(e) => setLunchItems(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Lunch Special Feature</label>
                    <input
                      type="text"
                      value={lunchSpecial}
                      onChange={(e) => setLunchSpecial(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Evening Snacks (comma separated)</label>
                  <input
                    type="text"
                    value={snacksItems}
                    onChange={(e) => setSnacksItems(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Dinner Items (comma separated)</label>
                    <input
                      type="text"
                      value={dinnerItems}
                      onChange={(e) => setDinnerItems(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Dinner Sweet / Dessert</label>
                    <input
                      type="text"
                      value={dinnerSweet}
                      onChange={(e) => setDinnerSweet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMenuEditorOpen(false)}
                    className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 shadow cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Stock Adjust Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setEditingItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#111215] rounded-3xl p-6 border border-white/[0.12] shadow-2xl relative space-y-4 text-zinc-100"
          >
            <h3 className="text-xl font-display text-white font-bold">
              Adjust {editingItem.name || editingItem.itemName} Stock
            </h3>
            <form onSubmit={handleStockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">New Available Stock ({editingItem.unit})</label>
                <input
                  type="number"
                  value={newStockQty}
                  onChange={(e) => setNewStockQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 cursor-pointer shadow"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
