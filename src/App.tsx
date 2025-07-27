import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import IssueDetailPage from './pages/IssueDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/board" element={<BoardPage />} />
        <Route path="/issue/:id" element={<IssueDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
