import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser } from './useAuthUser';
import { useUserId } from './useUserId';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true for protected routes, false for auth routes (login/register)
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthUser();
  const location = useLocation();
  const userId = useUserId();

  if (isLoading) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  if (requireAuth) {
    // For protected routes (dashboard, profile, etc.)
    if (!user) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    // For auth routes (login, register)
    if (user && userId) {
      // Redirect to profile if already authenticated
      return <Navigate to={`/profile/${userId}`} replace />;
    }
  }

  return <>{children}</>;
} 