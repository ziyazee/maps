import { useState } from 'react'
import './App.css'

function App() {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { role, email, password, remember })
    setIsLoggedIn(true)
  }

  if (isLoggedIn) {
    return (
      <div className="dashboard-container">
        {/* SideNavBar */}
        <nav className="sidebar">
          {/* Header */}
          <div className="sidebar-header">
            <div className="logo-icon">P</div>
            <div>
              <h1 className="brand-name">Porter</h1>
              <p className="brand-subtitle">Logistics Ops</p>
            </div>
          </div>

          {/* CTA */}
          <button className="new-dispatch-btn">
            <span className="material-symbols-outlined">add</span>
            New Dispatch
          </button>

          {/* Navigation Tabs */}
          <ul className="nav-tabs">
            <li>
              <a className="nav-item active" href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a className="nav-item" href="#">
                <span className="material-symbols-outlined">group</span>
                <span>Customers</span>
              </a>
            </li>
            <li>
              <a className="nav-item" href="#">
                <span className="material-symbols-outlined">local_shipping</span>
                <span>Orders</span>
              </a>
            </li>
            <li>
              <a className="nav-item" href="#">
                <span className="material-symbols-outlined">link</span>
                <span>Tracking Links</span>
              </a>
            </li>
            <li>
              <a className="nav-item" href="#">
                <span className="material-symbols-outlined">assessment</span>
                <span>Reports</span>
              </a>
            </li>
          </ul>

          {/* Footer Tabs */}
          <ul className="footer-tabs">
            <li>
              <a className="nav-item" href="#">
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a className="nav-item" href="#" onClick={() => setIsLoggedIn(false)}>
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content Area Wrapper */}
        <div className="main-content">
          {/* TopNavBar */}
          <header className="top-navbar">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-wrapper">
                <span className="material-symbols-outlined search-icon">search</span>
                <input 
                  type="text" 
                  placeholder="Search orders, customers, or tracking IDs..." 
                  className="search-input"
                />
              </div>
            </div>

            {/* Trailing Actions */}
            <div className="header-actions">
              <span className="team-name">Operations Team</span>
              <div className="action-buttons">
                <button className="icon-btn notification-btn">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="notification-dot"></span>
                </button>
                <button className="icon-btn account-btn">
                  <span className="material-symbols-outlined">account_circle</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Canvas */}
          <main className="content-canvas">
            <div className="content-wrapper">
              {/* Welcome Section */}
              <div className="welcome-section">
                <h2>Hello, Operations Team</h2>
                <p>Here is the overview for today's logistics activity.</p>
              </div>

              {/* Quick Actions Grid */}
              <div className="quick-actions-grid">
                {/* Create Customer Card */}
                <button className="action-card">
                  <div className="action-icon">
                    <span className="material-symbols-outlined">person_add</span>
                  </div>
                  <div className="action-content">
                    <h3>Create Customer Account</h3>
                    <p>Onboard a new enterprise or individual client.</p>
                  </div>
                  <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
                </button>

                {/* Create Order Card */}
                <button className="action-card">
                  <div className="action-icon">
                    <span className="material-symbols-outlined">add_box</span>
                  </div>
                  <div className="action-content">
                    <h3>Create Order</h3>
                    <p>Initiate a new delivery or dispatch request.</p>
                  </div>
                  <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
                </button>
              </div>

              {/* Quick Stats Row */}
              <div className="stats-grid">
                {/* Stat Card 1 */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Today's Orders</span>
                    <span className="material-symbols-outlined stat-icon">trending_up</span>
                  </div>
                  <span className="stat-value">1,248</span>
                  <div className="stat-change positive">
                    <span className="material-symbols-outlined">arrow_upward</span>
                    <span>12% from yesterday</span>
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Pending Orders</span>
                    <span className="material-symbols-outlined stat-icon">pending_actions</span>
                  </div>
                  <span className="stat-value">432</span>
                  <div className="stat-change neutral">
                    <span className="material-symbols-outlined">horizontal_rule</span>
                    <span>No change</span>
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Active Deliveries</span>
                    <span className="material-symbols-outlined stat-icon">local_shipping</span>
                  </div>
                  <span className="stat-value">156</span>
                  <div className="stat-change positive">
                    <span className="material-symbols-outlined">arrow_upward</span>
                    <span>5% from last hour</span>
                  </div>
                </div>

                {/* Stat Card 4 */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Completed Deliveries</span>
                    <span className="material-symbols-outlined stat-icon">task_alt</span>
                  </div>
                  <span className="stat-value">892</span>
                  <div className="stat-change positive">
                    <span className="material-symbols-outlined">arrow_upward</span>
                    <span>18% from yesterday</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Tables Grid */}
              <div className="tables-grid">
                {/* Recently Created Orders Table */}
                <div className="table-card">
                  <div className="table-header">
                    <h3>Recently Created Orders</h3>
                    <button className="view-all-btn">View All</button>
                  </div>
                  <div className="table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="mono-text">#ORD-9932</td>
                          <td>Acme Corp</td>
                          <td><span className="status-badge processing">Processing</span></td>
                          <td className="text-right">10 mins ago</td>
                        </tr>
                        <tr>
                          <td className="mono-text">#ORD-9931</td>
                          <td>Global Tech LLC</td>
                          <td><span className="status-badge pending">Pending</span></td>
                          <td className="text-right">25 mins ago</td>
                        </tr>
                        <tr>
                          <td className="mono-text">#ORD-9930</td>
                          <td>Stark Industries</td>
                          <td><span className="status-badge processing">Processing</span></td>
                          <td className="text-right">1 hour ago</td>
                        </tr>
                        <tr>
                          <td className="mono-text">#ORD-9929</td>
                          <td>Wayne Enterprises</td>
                          <td><span className="status-badge dispatched">Dispatched</span></td>
                          <td className="text-right">2 hours ago</td>
                        </tr>
                        <tr>
                          <td className="mono-text">#ORD-9928</td>
                          <td>Daily Planet</td>
                          <td><span className="status-badge pending">Pending</span></td>
                          <td className="text-right">3 hours ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recently Created Customers Table */}
                <div className="table-card">
                  <div className="table-header">
                    <h3>Recently Created Customers</h3>
                    <button className="view-all-btn">View All</button>
                  </div>
                  <div className="table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Region</th>
                          <th>Date Added</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-medium">Cyberdyne Systems</td>
                          <td>North America</td>
                          <td className="text-right">Today</td>
                        </tr>
                        <tr>
                          <td className="font-medium">Massive Dynamic</td>
                          <td>Europe</td>
                          <td className="text-right">Yesterday</td>
                        </tr>
                        <tr>
                          <td className="font-medium">InGen</td>
                          <td>South America</td>
                          <td className="text-right">Yesterday</td>
                        </tr>
                        <tr>
                          <td className="font-medium">Umbrella Corp</td>
                          <td>Asia Pacific</td>
                          <td className="text-right">Oct 12</td>
                        </tr>
                        <tr>
                          <td className="font-medium">LexCorp</td>
                          <td>North America</td>
                          <td className="text-right">Oct 10</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      {/* Left Section (Illustration & Value Prop) */}
      <div className="left-section">
        <div className="left-content">
          <div className="value-prop">
            <h1>Manage Logistics Operations From One Platform</h1>
            <p>Create orders, manage deliveries, track vehicles, generate reports, and streamline transportation operations.</p>
          </div>
          
          <div className="features">
            <div className="feature-item">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Real-time vehicle tracking</span>
            </div>
            <div className="feature-item">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Order management</span>
            </div>
            <div className="feature-item">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Delivery visibility</span>
            </div>
            <div className="feature-item">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Reporting and analytics</span>
            </div>
            <div className="feature-item">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Secure access</span>
            </div>
          </div>

          <div className="illustration">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuauxoVz5BFFv85jkvMq0COBdhGoQVQeDVEiOvtwO5PKdswAbNP6NAwBfyR-XSvLo6ojGoMtFeZpjChq5HPx9rcRQLfyyZGidGQsi-NCKEojWcS2OnD6zOJvqtm0NzTx6E-A41dqO6eWY81b4SO7yrTKvvhBzywGNFMLlywaHC6TuaNXW3e_9Nw9uTKE-vgx0Bj04BiTR3c-nqHZJrhFi9tcOM13D0anxlYpM3LO--U-A5m3eZODLA06zjfThC2jrAy7XrVFtrwFAd" alt="Dashboard illustration" />
          </div>
        </div>
      </div>

      {/* Right Section (Login Form) */}
      <div className="right-section">
        <div className="form-container">
          {/* Brand */}
          <div className="brand">
            <div className="brand-logo">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="brand-name">Porter</span>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your dashboard.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div className="role-selector">
              <div className="role-option">
                <input
                  type="radio"
                  id="role-admin"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-radio"
                />
                <label htmlFor="role-admin" className={role === 'admin' ? 'active' : ''}>
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin
                </label>
              </div>
              <div className="role-option">
                <input
                  type="radio"
                  id="role-ops"
                  name="role"
                  value="ops"
                  checked={role === 'ops'}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-radio"
                />
                <label htmlFor="role-ops" className={role === 'ops' ? 'active' : ''}>
                  <span className="material-symbols-outlined">engineering</span>
                  Operations
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <a href="#">Forgot Password?</a>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me */}
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember Me</label>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn">
              Sign In
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          {/* Security Note */}
          <div className="security-note">
            <span className="material-symbols-outlined">lock</span>
            <p>Protected internal system. Authorized personnel only. All activities are monitored and logged.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
