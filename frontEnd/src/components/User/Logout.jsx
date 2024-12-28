import { useDispatch } from "react-redux";
import { removeEmail } from "../../app/Slice/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const baseurl = import.meta.env.VITE_BASE_URL; 
async function handleLogout(dispatch) {
    try {
        await axios.get(`${baseurl}/logout`, {
            withCredentials: true, 
        });
        dispatch(removeEmail());
        toast.success("Logout successful");
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        toast.error(error.response?.data?.message || "Logout failed");
        return false;
    }
}

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        (async () => {
            await handleLogout(dispatch);
            navigate("/");
        })();
    }, []);

    return <div>Logging out...</div>;
}

export default Logout;