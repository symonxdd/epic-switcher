import { BrowserRouter as Router } from 'react-router-dom';
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
