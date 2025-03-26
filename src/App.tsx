import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './pages/Dashboard';
import StrategyBuilder from './pages/StrategyBuilder';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<StrategyBuilder />} />
          <Route path="/builder/:strategyId" element={<StrategyBuilder />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;