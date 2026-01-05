import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DoctorPortal from "./pages/DoctorPortal";
import Finance from "./pages/Finance";
import Chat from "./pages/Chat";
import Pharmacy from "./pages/Pharmacy";
import Laboratory from "./pages/Laboratory";
import Diagnostics from "./pages/Diagnostics";
import PharmacyIO from "./pages/PharmacyIO";
import EResults from "./pages/EResults";
import Backup from "./pages/Backup";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/doctor-portal" element={<DoctorPortal />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/laboratory" element={<Laboratory />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/pharmacy-io" element={<PharmacyIO />} />
          <Route path="/e-results" element={<EResults />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
