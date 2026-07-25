import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { Armchair, Zap, Sun, ShieldCheck, Info, ArrowLeftRight, Search, Wind } from 'lucide-react';
import { SeatInfo } from '../types';

export const MySeat: React.FC = () => {
  const { user, updateUserSeat } = useMember();
  const [selectedFloor, setSelectedFloor] = useState<'Ground Floor' | '1st Floor'>('Ground Floor');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'my_seat'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<SeatInfo | null>(null);
  const [showConfirmSwapModal, setShowConfirmSwapModal] = useState<boolean>(false);

  const mockSeats: SeatInfo[] = [
    { id: '1', code: 'A-12', floor: '1st Floor', zone: 'AC Zone', status: 'my_seat', hasPowerOutlet: true, hasLight: true, hasErgoChair: true },
    { id: '2', code: 'A-10', floor: '1st Floor', zone: 'AC Zone', status: 'available', hasPowerOutlet: true, hasLight: true, hasErgoChair: true },
    { id: '3', code: 'A-11', floor: '1st Floor', zone: 'Window Side', status: 'occupied', hasPowerOutlet: true, hasLight: true, hasErgoChair: false },
    { id: '4', code: 'A-14', floor: '1st Floor', zone: 'Silent Corner', status: 'available', hasPowerOutlet: true, hasLight: true, hasErgoChair: true },
    { id: '5', code: 'G-01', floor: 'Ground Floor', zone: 'Standard', status: 'available', hasPowerOutlet: true, hasLight: true, hasErgoChair: false },
    { id: '6', code: 'G-05', floor: 'Ground Floor', zone: 'Window Side', status: 'occupied', hasPowerOutlet: true, hasLight: true, hasErgoChair: true },
  ];

  const filteredSeats = mockSeats.filter((s: SeatInfo) => {
    const matchesFloor = s.floor === selectedFloor;
    const matchesSearch = s.code.toLowerCase().includes(searchQuery.toLowerCase()) || s.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'my_seat'
        ? s.code === user.currentSeat
        : s.status === statusFilter;
    return matchesFloor && matchesSearch && matchesStatus;
  });

  const handleSeatClick = (seat: SeatInfo) => {
    setSelectedSeat(seat);
  };

  const handleOpenSwapModal = () => {
    if (selectedSeat && selectedSeat.status === 'available') {
      setShowConfirmSwapModal(true);
    }
  };

  const handleConfirmSwap = () => {
    if (selectedSeat && selectedSeat.status === 'available') {
      updateUserSeat(selectedSeat.code, selectedSeat.floor);
      setShowConfirmSwapModal(false);
      setSelectedSeat(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Armchair className="h-5 w-5 text-amber-500" />
            Interactive Desk Map & Swap
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Explore live seat availability, desk amenities, or switch to an open desk
          </p>
        </div>

        {/* Floor Selector Tabs */}
        <div className="flex items-center bg-card border border-border p-1 rounded-xl shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setSelectedFloor('Ground Floor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedFloor === 'Ground Floor'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ground Floor (Quiet Zone)
          </button>
          <button
            onClick={() => setSelectedFloor('1st Floor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedFloor === '1st Floor'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            1st Floor (Silent Zone)
          </button>
        </div>
      </div>

      {/* Current Assigned Seat Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-card p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex px-3.5 py-2 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black font-mono text-lg sm:text-xl shadow whitespace-nowrap shrink-0">
            {user.currentSeat}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Your Reserved Desk</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 whitespace-nowrap">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight">
              {user.floor} &bull; Personal 240V Outlet & Lamp
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <div className="flex items-center gap-1 bg-card px-2.5 py-1 rounded-lg border border-border whitespace-nowrap">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="font-bold">240V Outlet</span>
          </div>
          <div className="flex items-center gap-1 bg-card px-2.5 py-1 rounded-lg border border-border whitespace-nowrap">
            <Sun className="h-3 w-3 text-amber-500" />
            <span className="font-bold">Desk Lamp</span>
          </div>
          <div className="flex items-center gap-1 bg-card px-2.5 py-1 rounded-lg border border-border whitespace-nowrap">
            <Wind className="h-3 w-3 text-blue-500" />
            <span className="font-bold">AC Breeze</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({mockSeats.filter((s: SeatInfo) => s.floor === selectedFloor).length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'available' ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Available ({mockSeats.filter((s: SeatInfo) => s.floor === selectedFloor && s.status === 'available').length})
          </button>
          <button
            onClick={() => setStatusFilter('occupied')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'occupied' ? 'bg-slate-500/15 text-slate-500 border border-slate-500/30' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Occupied ({mockSeats.filter((s: SeatInfo) => s.floor === selectedFloor && s.status === 'occupied').length})
          </button>
          <button
            onClick={() => setStatusFilter('my_seat')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'my_seat' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Seat
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search desk code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main Grid: Map + Desk Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Desk Grid */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Layout Map ({selectedFloor})</h2>

            {/* Legend */}
            <div className="flex items-center gap-2 text-[10px]">
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-amber-500 inline-block"></span>
                <span className="text-muted-foreground font-semibold">Your Desk</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500/20 border border-emerald-500 inline-block"></span>
                <span className="text-muted-foreground font-semibold">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-slate-400/20 border border-slate-400/40 inline-block"></span>
                <span className="text-muted-foreground font-semibold">Occupied</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-accent/20 border border-border min-h-[300px] flex flex-col justify-between">
            <div className="text-center text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/60 pb-2 mb-3">
              🚪 Main Hall Entrance
            </div>

            {filteredSeats.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No seats matching filter.
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 max-w-lg mx-auto w-full">
                {filteredSeats.map((seat: SeatInfo) => {
                  const isMySeat = seat.code === user.currentSeat;
                  const isSelected = selectedSeat?.id === seat.id;

                  let colorClasses = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer';
                  if (isMySeat) {
                    colorClasses = 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-md ring-2 ring-amber-400/50 cursor-pointer';
                  } else if (seat.status === 'occupied') {
                    colorClasses = 'bg-muted/40 text-muted-foreground border-border/40 opacity-60 cursor-not-allowed';
                  }

                  if (isSelected && !isMySeat) {
                    colorClasses += ' ring-2 ring-amber-500 ring-offset-1';
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-xs transition-all duration-200 aspect-square ${colorClasses}`}
                    >
                      <Armchair className={`h-3.5 w-3.5 mb-0.5 ${isMySeat ? 'text-slate-950' : ''}`} />
                      <span className="font-bold font-mono text-xs leading-none whitespace-nowrap">{seat.code}</span>
                      <span className="text-[8px] opacity-75 truncate max-w-[45px]">{seat.zone}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="text-center text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-t border-border/60 pt-2 mt-4">
              📚 Silent Reading Lounge
            </div>
          </div>
        </div>

        {/* Desk Detail Column */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Desk Specification</h2>

            {selectedSeat ? (
              <div className="space-y-3 p-3.5 rounded-lg bg-accent/30 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold font-mono text-foreground">{selectedSeat.code}</span>
                    <p className="text-[11px] text-muted-foreground font-semibold">{selectedSeat.floor}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${
                    selectedSeat.code === user.currentSeat
                      ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                      : selectedSeat.status === 'available'
                      ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-500'
                  }`}>
                    {selectedSeat.code === user.currentSeat ? 'Current Desk' : selectedSeat.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Zone:</span>
                    <span className="font-bold text-foreground">{selectedSeat.zone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Outlet:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Available (240V)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Chair:</span>
                    <span className="font-bold text-foreground">{selectedSeat.hasErgoChair ? 'Ergonomic Mesh' : 'Standard'}</span>
                  </div>
                </div>

                {selectedSeat.code !== user.currentSeat && selectedSeat.status === 'available' && (
                  <button
                    onClick={handleOpenSwapModal}
                    className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    Instant Swap to {selectedSeat.code}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-accent/20 border border-dashed border-border text-center space-y-1.5">
                <Info className="h-6 w-6 text-amber-500 mx-auto" />
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Select any desk on the layout map to inspect details or request a seat swap.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-card border border-border text-xs space-y-1">
            <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Seat Policy</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Desks stay reserved during active plans. Swaps update gate access logs instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSwapModal && selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-xs font-bold text-foreground">Confirm Desk Swap</h3>
              <button onClick={() => setShowConfirmSwapModal(false)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-muted-foreground">
                Swap your assigned seat from <strong className="text-amber-500 font-mono">{user.currentSeat}</strong> to <strong className="text-emerald-500 font-mono">{selectedSeat.code}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowConfirmSwapModal(false)}
                className="w-1/2 py-2 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSwap}
                className="w-1/2 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs"
              >
                Confirm Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
