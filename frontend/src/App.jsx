import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import ResidentRegister from './pages/ResidentRegister';

import MainAdminDashboard from './pages/MainAdminDashboard';
import BillingManagement from './pages/BillingManagement';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import CommunityAdminDetails from './pages/CommunityAdminDetails';
import MainAdminCommunities from './pages/MainAdminCommunities';
import Profile from './pages/Profile';
import HouseholdsConfig from './pages/HouseholdsConfig';
import MeterConfig from './pages/MeterConfig';
import BulkPurchases from './pages/BulkPurchases';
import MyBills from './pages/MyBills';
import UsageHistory from './pages/UsageHistory';
import WaterLeakagePage from './pages/WaterLeakagePage';
import ResidentReportsPage from './pages/ResidentReportsPage';
import CommunityAdminReportsPage from './pages/CommunityAdminReportsPage';

// Fully Implemented Module Pages
import ResidentSupportPage from './pages/ResidentSupportPage';
import CommunityAdminSupportPage from './pages/CommunityAdminSupportPage';
import TariffConfigPage from './pages/TariffConfigPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import MainAdminAnalyticsPage from './pages/MainAdminAnalyticsPage';
import MainAdminFinancialsPage from './pages/MainAdminFinancialsPage';
import MainAdminTariffsPage from './pages/MainAdminTariffsPage';
import MainAdminSupportPage from './pages/MainAdminSupportPage';
import MainAdminReportsPage from './pages/MainAdminReportsPage';

import SmartBotChat from './components/SmartBotChat';

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
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
          <SmartBotChat />
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
