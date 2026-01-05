import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/doctor-portal" element={<ProtectedRoute allowedRoles={["admin", "doctor"]}><DoctorPortal /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute allowedRoles={["admin", "receptionist"]}><Finance /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedRoles={["admin", "doctor"]}><Chat /></ProtectedRoute>} />
          <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={["admin", "pharmacist"]}><Pharmacy /></ProtectedRoute>} />
          <Route path="/laboratory" element={<ProtectedRoute allowedRoles={["admin", "lab_technician"]}><Laboratory /></ProtectedRoute>} />
          <Route path="/diagnostics" element={<ProtectedRoute allowedRoles={["admin", "doctor", "lab_technician"]}><Diagnostics /></ProtectedRoute>} />
          <Route path="/pharmacy-io" element={<ProtectedRoute allowedRoles={["admin", "pharmacist"]}><PharmacyIO /></ProtectedRoute>} />
          <Route path="/e-results" element={<ProtectedRoute allowedRoles={["admin", "doctor", "lab_technician"]}><EResults /></ProtectedRoute>} />
          <Route path="/backup" element={<ProtectedRoute allowedRoles={["admin"]}><Backup /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
