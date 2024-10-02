import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // This effect can be used to check if the user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log(10, isAuthenticated)
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to Your Dashboard</h2>
      <p>This is your personalized dashboard. Here you can view your data and manage your account.</p>
      <button
        onClick={() => {
          localStorage.removeItem('isAuthenticated'); // Log out user
          navigate('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
