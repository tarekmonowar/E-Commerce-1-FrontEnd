// src/routes/PrivateRoute.jsx
import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  isAdmin?: boolean;
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  isAuthenticated,
  adminOnly,
  isAdmin,
  redirectPath = "/",
}: PrivateRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}

//* return children ? children : <Outlet />;
// ato normally //!return children
//  but problem aita hole protita route a protectedrout components call kor LiaGrinTongue,,,ati na kore sobgulare wrap kore aktite bebohar kore return kora hoyeche atake outlet bole r children takle children return korbe

// * children: If you pass JSX/components inside <ProtectedRoute>...</ProtectedRoute>, those components are available as children.

//*  <Outlet />: This is a React Router component that renders the matched child route inside a nested route setup.
