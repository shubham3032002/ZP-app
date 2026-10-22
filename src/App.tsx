import React, { useState } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { BobWorldHeader } from './components/BobWorldHeader';
import { LoginPage } from './components/LoginPage';
import { MemberSharesCard } from './components/MemberSharesCard';
import { DepositSchemesCard } from './components/DepositSchemesCard';
import { MultipleLoansCard } from './components/MultipleLoansCard';
import { MemberSharesHub } from './components/MemberSharesHub';
import { DepositSchemesHub } from './components/DepositSchemesHub';
import { LoanHub } from './components/LoanHub';
import { StatementHub } from './components/StatementHub';
import { KYCModal } from './components/KYCModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { Award, PiggyBank, Landmark, Building2, Phone, MapPin } from 'lucide-react';

const BankAppContent: React.FC = () => {
  const { memberShares, society, isAuthenticated, isCheckingAuth } = useBank();
  // Top tabs: accounts (overview), shares, save, borrow, statements, society
  const [activeTopTab, setActiveTopTab] = useState<string>('accounts');

  // Modals state
  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Render Login Page if user is unauthenticated
    // While we're checking whether an existing session cookie is still valid,
  // show a simple loading state instead of flashing the login screen.
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E6390A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render Login Page if user is unauthenticated
  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setActiveTopTab('accounts')} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-900 font-sans selection:bg-[#E6390A] selection:text-white flex flex-col pb-8">
      
      {/* 1. Header (Logo, Member #, Search, Profile, Category Nav Tabs) */}
      <BobWorldHeader
        activeTopTab={activeTopTab}
        setActiveTopTab={setActiveTopTab}
        onOpenProfile={() => setIsKYCOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSearch={() => setActiveTopTab('statements')}
      />

      {/* 2. Main Body Content */}
      <main className="flex-1 w-full max-w-lg mx-auto pb-6 space-y-4">
        
        {/* TAB 1: ACCOUNTS / OVERVIEW (MEMBER SHARES, DEPOSIT SCHEMES & MULTIPLE LOANS) */}
        {activeTopTab === 'accounts' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            
            {/* 1. Member Share Capital Card (Emerald-Gold) */}
            <MemberSharesCard
              onOpenShareDetails={() => setActiveTopTab('shares')}
              onOpenDividendHistory={() => setActiveTopTab('shares')}
            />

            {/* 2. Deposit Schemes Card (Sapphire Blue: Savings, Pigmy, RD, 2 FDs) */}
            <DepositSchemesCard
              onOpenDepositHub={() => setActiveTopTab('save')}
              onOpenPassbook={() => setActiveTopTab('statements')}
            />

            {/* 3. Multiple Loans Card (Deep Purple: Personal, Gold, Home, Festival) */}
            <MultipleLoansCard
              onOpenLoansHub={() => setActiveTopTab('borrow')}
              onOpenLoanSchedule={() => setActiveTopTab('borrow')}
            />
          </div>
        )}

        {/* TAB 2: SHARES (MEMBER SHARE CERTIFICATE & DIVIDENDS) */}
        {activeTopTab === 'shares' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <MemberSharesHub />
          </div>
        )}

        {/* TAB 3: SAVE (PIGMY, RD, FD DEPOSIT SCHEMES) */}
        {activeTopTab === 'save' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <DepositSchemesHub />
          </div>
        )}

        {/* TAB 4: BORROW (MULTIPLE LOAN ACCOUNTS: PERSONAL, GOLD, PROPERTY, FESTIVAL) */}
        {activeTopTab === 'borrow' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <LoanHub />
          </div>
        )}

        {/* TAB 5: PASSBOOK & STATEMENTS */}
        {activeTopTab === 'statements' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <StatementHub />
          </div>
        )}

        {/* TAB 6: SOCIETY INFO & BYE-LAWS */}
        {activeTopTab === 'society' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-white border border-orange-100 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#E6390A] flex items-center justify-center font-bold text-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{society?.name ?? memberShares.societyName}</h3>
                  {(society?.regNo || memberShares.societyRegNo) && (
                    <p className="text-[11px] text-slate-500">Reg No: {society?.regNo || memberShares.societyRegNo}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1">
                  <span className="font-bold text-slate-900 text-xs block">Head Office & Main Branch</span>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#E6390A] shrink-0" />
                    {society?.address && <span>{society.address}</span>}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-[#E6390A] shrink-0" />
                    {society?.contactNo && <span>Helpdesk: {society.contactNo}</span>}
                  </p>
                </div>

                {/* <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                  <span className="font-bold text-slate-900 block">Key Society Member Privileges:</span>
                  <div>• 12.0% Annual Dividend declared on Member Shares for FY 2025-26.</div>
                  <div>• Daily Pigmy collection facility directly at your shop/residence.</div>
                  <div>• Instant Gold Loan sanction within 15 minutes at attractive 9.50% interest.</div>
                  <div>• Surety Personal loans for members with fast documentation.</div>
                </div> */}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* KYC / Member Profile Modal */}
      <KYCModal isOpen={isKYCOpen} onClose={() => setIsKYCOpen(false)} />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <BankProvider>
      <BankAppContent />
    </BankProvider>
  );
}

export default App;
