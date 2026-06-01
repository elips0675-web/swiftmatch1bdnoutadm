import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/language-context";
import { FeatureFlagsProvider } from "@/context/feature-flags-context";
import { FirebaseClientProvider } from "@/shims/firebase";
import { AppContainer } from "@/components/layout/app-container";
import { AdminLayout } from "@/components/layout/admin-layout";
import { ClientOnly } from "@/components/shared/client-only";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { PwaInstallBanner } from "@/components/shared/pwa-install-banner";
import { useEffect } from "react";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/about";
import Activity from "./pages/activity";
import Admin from "./pages/admin";
import AdminAnalytics from "./pages/admin-analytics";
import AdminContent from "./pages/admin-content";
import AdminFeatures from "./pages/admin-features";
import AdminMessaging from "./pages/admin-messaging";
import AdminMonetization from "./pages/admin-monetization";
import AdminReports from "./pages/admin-reports";
import AdminUsers from "./pages/admin-users";
import Chats from "./pages/chats";
import ChatId from "./pages/_chats-chatId-adapter";
import Contest from "./pages/contest";
import Faq from "./pages/faq";
import Groups from "./pages/groups";
import GroupCategory from "./pages/groups-category";
import LegalDataProcessing from "./pages/legal-data-processing";
import LegalPrivacy from "./pages/legal-privacy";
import LegalTerms from "./pages/legal-terms";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import Profile from "./pages/profile";
import ProfileEdit from "./pages/profile-edit";
import ProfileAttachmentTest from "./pages/profile-attachment-test";
import Register from "./pages/register";
import Search from "./pages/search";
import SearchFilters from "./pages/search-filters";
import Settings from "./pages/settings";
import SupportChat from "./pages/support-chat";
import User from "./pages/user";

const queryClient = new QueryClient();

const PAGE_TITLES: Record<string, string> = {
  "/": "SwiftMatch",
  "/search": "Поиск — SwiftMatch",
  "/search/filters": "Фильтры — SwiftMatch",
  "/chats": "Чаты — SwiftMatch",
  "/profile": "Профиль — SwiftMatch",
  "/profile/edit": "Редактировать — SwiftMatch",
  "/profile/attachment-test": "Тест привязанности — SwiftMatch",
  "/activity": "Активность — SwiftMatch",
  "/groups": "Группы — SwiftMatch",
  "/contest": "Конкурс — SwiftMatch",
  "/settings": "Настройки — SwiftMatch",
  "/onboarding": "Добро пожаловать — SwiftMatch",
  "/login": "Вход — SwiftMatch",
  "/register": "Регистрация — SwiftMatch",
  "/about": "О приложении — SwiftMatch",
  "/faq": "Вопросы — SwiftMatch",
  "/support-chat": "Поддержка — SwiftMatch",
  "/legal/privacy": "Конфиденциальность — SwiftMatch",
  "/legal/terms": "Условия — SwiftMatch",
  "/legal/data-processing": "Обработка данных — SwiftMatch",
  "/admin": "Админ — SwiftMatch",
  "/admin/analytics": "Аналитика — SwiftMatch",
  "/admin/users": "Пользователи — SwiftMatch",
  "/admin/content": "Контент — SwiftMatch",
  "/admin/features": "Функции — SwiftMatch",
  "/admin/messaging": "Рассылки — SwiftMatch",
  "/admin/monetization": "Монетизация — SwiftMatch",
  "/admin/reports": "Жалобы — SwiftMatch",
};

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = PAGE_TITLES[pathname] || "SwiftMatch";
    document.title = title;
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <FirebaseClientProvider>
            <FeatureFlagsProvider>
              <DocumentTitle />
              <Routes>
                <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
                <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
                <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
                <Route path="/admin/features" element={<AdminLayout><AdminFeatures /></AdminLayout>} />
                <Route path="/admin/messaging" element={<AdminLayout><AdminMessaging /></AdminLayout>} />
                <Route path="/admin/monetization" element={<AdminLayout><AdminMonetization /></AdminLayout>} />
                <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
                <Route path="*" element={<>
                  <AppContainer>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/activity" element={<Activity />} />
                      <Route path="/chats" element={<Chats />} />
                      <Route path="/chats/:chatId" element={<ChatId />} />
                      <Route path="/contest" element={<Contest />} />
                      <Route path="/faq" element={<Faq />} />
                      <Route path="/groups" element={<Groups />} />
                      <Route path="/groups/:category" element={<GroupCategory />} />
                      <Route path="/legal/data-processing" element={<LegalDataProcessing />} />
                      <Route path="/legal/privacy" element={<LegalPrivacy />} />
                      <Route path="/legal/terms" element={<LegalTerms />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<ProfileEdit />} />
                      <Route path="/profile/attachment-test" element={<ProfileAttachmentTest />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/search/filters" element={<SearchFilters />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/support-chat" element={<SupportChat />} />
                      <Route path="/user" element={<User />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <ClientOnly>
                      <CookieConsent />
                      <PwaInstallBanner />
                    </ClientOnly>
                  </AppContainer>
                </>} />
              </Routes>
            </FeatureFlagsProvider>
          </FirebaseClientProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
