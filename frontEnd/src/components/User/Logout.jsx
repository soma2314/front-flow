import { useDispatch } from "react-redux";
import { removeEmail } from "../../app/Slice/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const baseurl = import.meta.env.VITE_BASE_URL; 
async function handleLogout(dispatch) {
    try {
        const response = await axios.get(`${baseurl}/logout`, {
            withCredentials: true,
        });
        
        // Only proceed if the server confirms logout
        if (response.status === 200) {
            dispatch(removeEmail());
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
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
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
        return <div>Logout failed. Please try again.</div>;
    }

    return <div>Logging out...</div>;
}

export default Logout;