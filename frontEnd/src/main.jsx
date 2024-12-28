import React, { useEffect } from 'react'; 
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, useLocation   } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import AboutTeam from './components/AboutTeam/AboutTeam.jsx';
import ApiEndpoints from './components/ApiEndpoints/ApiEndpoints.jsx';
import AdminSection from './components/AdminSection/AdminSection.jsx';
import Register from './components/User/Register.jsx';
import Login from './components/User/Login.jsx';
import Docs from './components/Docs/Docs.jsx';
import Layout from './Layout.jsx';  
import Logout from './components/User/Logout.jsx'
import { Provider, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { store } from './app/store.js';
import { addEmail } from './app/Slice/userSlice.js';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import './index.css';

const baseurl = import.meta.env.VITE_BASE_URL

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="docs" element={<Docs />} />
            <Route path="about-team" element={<AboutTeam />} />
            <Route path="api-endpoints" element={<ApiEndpoints />} />
            <Route path="admin-section" element={<AdminSection />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
        </Route>
    ),
    {
        basename: '/',
    }
);

const Main = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.user.isAuthenticated);
    const [loading, setLoading] = useState(true); // Handle loading state for fetching user details

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseurl}/getUserDetails`, {
                    withCredentials: true, // Include the cookie in the request
                });
                const { email, role, name } = response.data;``
                dispatch(addEmail({ email, role, name })); // Dispatch user details to Redux store
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false); // Stop loading once the data is fetched
            }
        };

        if (!isAuth) {
            fetchUserDetails(); // Fetch user details only if not authenticated
        } else {
            setLoading(false); // Skip loading if already authenticated
        }
    }, [dispatch, isAuth]);

    if (loading) {
        return <p>Loading...</p>; // Show loading spinner or message while fetching data
    }

    return (
        <>
            <ToastContainer
  position="bottom-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
  limit={3}
  style={{
    zIndex: 9999
  }}
  toastStyle={{
    backgroundColor: '#333',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  }}
/>
            <RouterProvider router={router} />
        </>
    );
};


ReactDOM.createRoot(document.getElementById('root')).render( 
        <Provider store={store}>
            <Main />
        </Provider> 
);
