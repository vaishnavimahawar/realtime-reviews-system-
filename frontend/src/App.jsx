import { Routes, Route } from 'react-router-dom';
import ReviewList from './pages/ReviewList';
import ReviewForm from './pages/ReviewForm';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Live Reviews</h1>
        <p className="app-subtitle">Real-time collaborative reviews</p>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ReviewList />} />
          <Route path="/new" element={<ReviewForm />} />
          <Route path="/:id" element={<ReviewForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
