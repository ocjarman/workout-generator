import { useAuth0 } from "@auth0/auth0-react";
import "./auth-button.css";

const AuthButton = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  if (isLoading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          {user.picture && (
            <img src={user.picture} alt={user.name} className="user-avatar" />
          )}
          <span className="user-name">{user.name}</span>
        </div>
        <button
          className="auth-btn logout-btn"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button className="auth-btn login-btn" onClick={() => loginWithRedirect()}>
      Login / Sign Up
    </button>
  );
};

export default AuthButton;
