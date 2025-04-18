
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 gradient-text">
          Welcome to Your Dashboard
        </h1>
        <p className="mb-4">
          Welcome, {user?.email || 'User'}!
        </p>
        <Button onClick={signOut} variant="destructive">
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
