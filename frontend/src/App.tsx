import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import BugOverviewPage from './pages/BugOverview'
import UserManagementPage from './pages/UserManagementPage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/overview" element={<BugOverviewPage />} />
            <Route path="/users" element={<UserManagementPage />}
            />
        </Routes>
    )
}

export default App