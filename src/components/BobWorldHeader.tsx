import React, { useState } from 'react';
import { Search, Bell, Sparkles, Award, ShieldCheck, LogOut, UserRound } from 'lucide-react';
import { useBank } from '../context/BankContext';
import zpLogo from '../../assets/images/zplogo.png';

interface BobWorldHeaderProps {
  activeTopTab: string;
  setActiveTopTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const BobWorldHeader: React.FC<BobWorldHeaderProps> = ({
  activeTopTab,
  setActiveTopTab,
  onOpenProfile,
  onOpenNotifications,
  onOpenSearch,
}) => {
  const { profile, notifications, memberShares,society, logout } = useBank();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const greetingName = profile.name.trim();

  const topTabs = [
    { id: 'accounts', label: 'Overview' },
    { id: 'shares', label: 'Shares' },
    { id: 'save', label: 'Deposits' },
    { id: 'borrow', label: 'Loans' },
    // { id: 'statements', label: 'Passbook' },
    { id: 'society', label: 'Society' },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md pt-3 pb-1 px-3 sm:px-4 border-b border-orange-100/70 sticky top-0 z-30 shadow-xs">
      <div className="max-w-lg mx-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo & Greeting */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0 flex-1"
            onClick={() => setActiveTopTab('accounts')}
          >
            <div className="relative shrink-0">
              <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-100 shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src={zpLogo}
                  alt={society?.name ?? memberShares.societyName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // if the logo fails to load, fall back to the "सह" glyph
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="font-serif font-black hidden">सह</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight text-[#E6390A] truncate">
                  {society?.name ?? memberShares.societyName}
                </span>
                {/* <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  #{memberShares.memberNumber}
                </span> */}
              </div>
              {greetingName && (
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight whitespace-normal break-words">
                  नमस्ते, {greetingName}
                </p>
              )}
            </div>
          </div>

          {/* Right Tools: Notification & Avatar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* <button
              onClick={onOpenNotifications}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/90 hover:bg-orange-50 text-slate-700 hover:text-[#E6390A] flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 shadow-2xs relative active:scale-95"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E6390A] ring-2 ring-white" />
              )}
            </button> */}

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen((open) => !open)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-900 border-2 border-white shadow-xs flex items-center justify-center text-white hover:ring-2 hover:ring-orange-400 transition-all cursor-pointer active:scale-95 shrink-0 ml-0.5"
                title={profile.name}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                <UserRound className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50" role="menu">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{profile.name}</p>
                    {memberShares.memberNumber && (
                      <p className="text-xs text-slate-500">Member #{memberShares.memberNumber}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    role="menuitem"
                  >
                    View profile
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Nav Tabs */}
        <nav className="mt-2.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 pb-1">
          {topTabs.map((tab) => {
            const isActive = activeTopTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center cursor-pointer select-none active:scale-95 shrink-0 ${
                  isActive
                    ? 'bg-[#E6390A] text-white shadow-xs shadow-orange-600/30 font-bold'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-orange-50 hover:text-[#E6390A]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

