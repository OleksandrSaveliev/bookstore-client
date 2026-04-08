import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const finalizeLogin = async () => {
      try {
        // This triggers the /me call, which populates state AND localStorage
        await refreshUser();
        navigate("/", { replace: true });
      } catch (error) {
        console.error("OAuth2 Initialization failed", error);
        navigate("/login");
      }
    };

    finalizeLogin();
  }, [refreshUser, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Finalizing your secure login...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
