import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

import SmartBotChat from './components/SmartBotChat';
import PwaInstallModal from './components/PwaInstallModal';
import SkeletonLoader from './components/SkeletonLoader';

const Landing = lazy(() => import('./pages/Landing'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ResidentRegister = lazy(() => import('./pages/ResidentRegister'));
const WaterTipsPage = lazy(() => import('./pages/WaterTipsPage'));

const MainAdminDashboard = lazy(() => import('./pages/MainAdminDashboard'));
const BillingManagement = lazy(() => import('./pages/BillingManagement'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Notifications = lazy(() => import('./pages/Notifications'));
const CommunityAdminDetails = lazy(() => import('./pages/CommunityAdminDetails'));
const MainAdminCommunities = lazy(() => import('./pages/MainAdminCommunities'));
const Profile = lazy(() => import('./pages/Profile'));
const HouseholdsConfig = lazy(() => import('./pages/HouseholdsConfig'));
const MeterConfig = lazy(() => import('./pages/MeterConfig'));
const BulkPurchases = lazy(() => import('./pages/BulkPurchases'));
const MyBills = lazy(() => import('./pages/MyBills'));
const UsageHistory = lazy(() => import('./pages/UsageHistory'));
const WaterLeakagePage = lazy(() => import('./pages/WaterLeakagePage'));
const ResidentReportsPage = lazy(() => import('./pages/ResidentReportsPage'));
const CommunityAdminReportsPage = lazy(() => import('./pages/CommunityAdminReportsPage'));

const ResidentSupportPage = lazy(() => import('./pages/ResidentSupportPage'));
const CommunityAdminSupportPage = lazy(() => import('./pages/CommunityAdminSupportPage'));
const TariffConfigPage = lazy(() => import('./pages/TariffConfigPage'));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'));
const MainAdminAnalyticsPage = lazy(() => import('./pages/MainAdminAnalyticsPage'));
const MainAdminFinancialsPage = lazy(() => import('./pages/MainAdminFinancialsPage'));
const MainAdminTariffsPage = lazy(() => import('./pages/MainAdminTariffsPage'));
const MainAdminSupportPage = lazy(() => import('./pages/MainAdminSupportPage'));
const MainAdminReportsPage = lazy(() => import('./pages/MainAdminReportsPage'));
const MainAdminVerifications = lazy(() => import('./pages/MainAdminVerifications'));

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}><SkeletonLoader type="dashboard" /></div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/resident/:token" element={<ResidentRegister />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Dashboard Route (Resident) */}
              <Route path="/dashboard" element={<UserDashboard />} />
              
              {/* Resident Sidebar Modules */}
              <Route path="/usage" element={<UsageHistory />} />
              <Route path="/bills" element={<MyBills />} />
              <Route path="/reports" element={<ResidentReportsPage />} />
              <Route path="/water-tips" element={<WaterTipsPage />} />
              <Route path="/support" element={<ResidentSupportPage />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />

              {/* Protected Dashboard Route (Community Admin) */}
              <Route path="/admin-panel" element={<AdminPanel />} />

              {/* Community Admin Configurations */}
              <Route path="/community/households" element={<HouseholdsConfig />} />
              <Route path="/community/meter" element={<MeterConfig />} />
              <Route path="/community/billing" element={<BillingManagement />} />
              <Route path="/community/bulk-purchases" element={<BulkPurchases />} />
              <Route path="/community/reports" element={<CommunityAdminReportsPage />} />
              <Route path="/community/leakage" element={<WaterLeakagePage />} />
              <Route path="/community/support" element={<CommunityAdminSupportPage />} />
              <Route path="/community/tariffs" element={<TariffConfigPage />} />
              <Route path="/community/announcements" element={<AnnouncementsPage role="COMMUNITY_ADMIN" />} />
              <Route path="/community/profile" element={<Profile />} />

              {/* Protected Dashboard Route (Main Admin) */}
              <Route path="/main-admin-panel" element={<MainAdminDashboard />} />
                    <Route path="/main-admin/verifications" element={<MainAdminVerifications />} />
              <Route path="/admin/community-admin/:id" element={<CommunityAdminDetails />} />

              {/* Main Admin Sidebar Modules */}
              <Route path="/admin/communities" element={<MainAdminCommunities />} />
              <Route path="/admin/analytics" element={<MainAdminAnalyticsPage />} />
              <Route path="/admin/financials" element={<MainAdminFinancialsPage />} />
              <Route path="/admin/tariffs" element={<MainAdminTariffsPage />} />
              <Route path="/admin/support" element={<MainAdminSupportPage />} />
              <Route path="/admin/reports" element={<MainAdminReportsPage />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
          <SmartBotChat />
          <PwaInstallModal />
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;


