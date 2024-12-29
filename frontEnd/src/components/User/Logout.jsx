import { useDispatch } from "react-redux";
import { removeEmail } from "../../app/Slice/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const baseurl = import.meta.env.VITE_BASE_URL;

const handleLogout = async (dispatch) => {
    try {
        const response = await axios.get(`${baseurl}/logout`, {
            withCredentials: true,
            credentials: 'include',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            dispatch(removeEmail());
            
            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/;secure;samesite=none`);
            });
            
            toast.success("Logout successful");
            return true;
        }
        return false;
    } catch (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed");
        return false;
    }
}

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const performLogout = async () => {
            try {
                const success = await handleLogout(dispatch);
                if (success) {
                    setIsLoading(false);
                    navigate("/");
                } else {
                    setLogoutError(true);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Logout failed:", error);
                setLogoutError(true);
                setIsLoading(false);
            }
        };

        performLogout();
    }, [dispatch, navigate]);

    if (logoutError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-red-500/20 p-8 max-w-md w-full">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                            <i className="fas fa-exclamation-circle text-3xl text-red-500"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-red-500">Logout Failed</h3>
                        <p className="text-gray-400">Unable to complete the logout process.</p>
                        <div className="flex gap-3 justify-center mt-6">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 p-8 max-w-md w-full">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                        {isLoading ? (
                            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <i className="fas fa-check-circle text-3xl text-blue-500"></i>
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200">
                        {isLoading ? "Signing Out..." : "Successfully Signed Out"}
                    </h3>
                    <p className="text-gray-400">
                        {isLoading ? "Please wait while we securely log you out." : "You have been safely logged out of your account."}
                    </p>
                    {!isLoading && (
                        <button
                            onClick={() => navigate("/login")}
                            className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                            Sign In Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Logout;