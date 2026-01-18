/**
 * Main App Component
 */


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components';
import { Dashboard, DailyEntry, Timeline, Standup, Weekly, Review } from './pages';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entry/:date" element={<DailyEntry />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/standup" element={<Standup />} />
            <Route path="/weekly" element={<Weekly />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
