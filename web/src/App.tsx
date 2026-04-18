import { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { StatsStrip } from "./components/StatsStrip";
import { Emotional } from "./components/Emotional";
import { HowItWorks } from "./components/HowItWorks";
import { Testimonials } from "./components/Testimonials";
import { Product } from "./components/Product";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserProtectedRoute } from "./components/UserProtectedRoute";
import { ConsoleLogin } from "./pages/ConsoleLogin";
import { Login } from "./pages/Login";
import { MyPet } from "./pages/MyPet";
import { Messages } from "./pages/Messages";
import { PetDetails } from "./pages/PetDetails";
import { ConsoleDashboard } from "./pages/ConsoleDashboard";
import { ConsoleOverview, OverviewRedirect } from "./pages/Overview";
import { ConsoleUsers } from "./pages/ConsoleUsers";
import { ConsoleTags } from "./pages/ConsoleTags";

const Landing: FC = () => (
  <>
    <Navbar />
    <Hero />
    <StatsStrip />
    <Emotional />
    <HowItWorks />
    <Testimonials />
    <Product />
    <CTA />
    <Footer />
  </>
);

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pet" element={<Navigate to="/" replace />} />
        <Route path="/tag" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pet/:tagId" element={<PetDetails />} />
        <Route path="/tag/:tagId" element={<PetDetails />} />
        <Route element={<UserProtectedRoute />}>
          <Route path="/my-pet" element={<MyPet />} />
          <Route path="/my-pet/messages" element={<Messages />} />
        </Route>
        <Route path="/console-root" element={<ConsoleLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/console-root/dashboard" element={<ConsoleDashboard />}>
            <Route index element={<OverviewRedirect />} />
            <Route path="overview" element={<ConsoleOverview />} />
            <Route path="users" element={<ConsoleUsers />} />
            <Route path="tags" element={<ConsoleTags />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
