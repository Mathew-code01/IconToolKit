// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/layout/AppShell";

import HomePage from "./pages/Home/HomePage";
import CreatePage from "./pages/Create/CreatePage";
import EditPage from "./pages/Edit/EditPage";
import ConvertPage from "./pages/Convert/ConvertPage";
import OptimizePage from "./pages/Optimize/OptimizePage";
import InspectPage from "./pages/Inspect/InspectPage";
import DeveloperPage from "./pages/Developer/DeveloperPage";
import GeneratorPage from "./pages/Generator/GeneratorPage";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Main toolkit categories */}
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/optimize" element={<OptimizePage />} />
          <Route path="/inspect" element={<InspectPage />} />
          <Route path="/developer" element={<DeveloperPage />} />

          {/* Existing flagship generator */}
          <Route path="/generator" element={<GeneratorPage />} />

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;