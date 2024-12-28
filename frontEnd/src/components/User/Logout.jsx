// Frontend Logout Component
import { useDispatch } from "react-redux";
import { removeEmail } from "../../app/Slice/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const baseurl = import.meta.env.VITE_BASE_URL;

async function handleLogout(dispatch) {
    try {
        // Make sure the baseurl matches exactly with your CLIENT_URL env variable
        const response = await axios.get(`${baseurl}/logout`, {
            withCredentials: true,
            credentials: 'include',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            // Clear any local storage or session storage if you're using any
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear Redux state
            dispatch(removeEmail());

            // Manually clear cookies from client side as backup
            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
            });
            
            toast.success("Logout successful");
            return true;
        }
        return false;
    } catch (error) {
        console.error("Logout error:", error);
        toast.error(error.response?.data?.message || "Logout failed");
        return false;
    }
}

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState(false);
    
    useEffect(() => {
        const performLogout = async () => {
            try {
                const success = await handleLogout(dispatch);
                if (success) {
                    // Increased timeout to ensure all cleanup is complete
                    setTimeout(() => {
                        // Force reload after navigation to ensure clean state
                        navigate("/");
                        window.location.reload();
                    }, 1500);
                } else {
                    setLogoutError(true);
                }
            } catch (error) {
                console.error("Logout failed:", error);
                setLogoutError(true);
            }
        };

        performLogout();
    }, [dispatch, navigate]);

    if (logoutError) {
        return <div className="text-center text-red-500">
            Logout failed. Please try again or refresh the page.
        </div>;
    }

    return <div className="text-center">Logging out...</div>;
}

export default Logout;