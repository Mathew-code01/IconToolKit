// src/App.tsx

// src/App.tsx

// src/App.tsx

import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/Home/HomePage";
import GeneratorPage from "./pages/Generator/GeneratorPage";

function App() {
  const path = window.location.pathname;

  let page;

  switch (path) {
    case "/generator":
      page = <GeneratorPage />;
      break;

    case "/":
    default:
      page = <HomePage />;
      break;
  }

  return <AppShell>{page}</AppShell>;
}

export default App;