// Hash routing keeps the address at "/" for Wails, which only injects its
// runtime into pages served at "/" or "/index.html". With BrowserRouter, a
// reload on e.g. /manage lost the runtime and left a blank page.
import { HashRouter as Router } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
  return (
    <Router>
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
