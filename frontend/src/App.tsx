import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import BugOverviewPage from './pages/BugOverview'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/overview" element={<BugOverviewPage />} />
        </Routes>
    )
}

export default App