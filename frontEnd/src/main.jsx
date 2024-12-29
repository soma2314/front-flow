import React, { useEffect, Suspense } from 'react'; 
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import AboutTeam from './components/AboutTeam/AboutTeam.jsx';
import ApiEndpoints from './components/ApiEndpoints/ApiEndpoints.jsx';
import AdminSection from './components/AdminSection/AdminSection.jsx';
import Register from './components/User/Register.jsx';
import Login from './components/User/Login.jsx';
import Docs from './components/Docs/Docs.jsx';
import Layout from './Layout.jsx';  
import Logout from './components/User/Logout.jsx';
import { Provider, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { store } from './app/store.js';
import { addEmail } from './app/Slice/userSlice.js';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import CustomLoading from './components/CustomLoading/CustomLoading.jsx';
import './index.css';

const baseurl = import.meta.env.VITE_BASE_URL;

// Wrap each route component with Suspense and lazy loading
const lazyLoad = (Component) => (props) => (
    <Suspense fallback={<CustomLoading />}>
        <Component {...props} />
    </Suspense>
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={lazyLoad(Home)()} />
            <Route path="home" element={lazyLoad(Home)()} />
            <Route path="docs" element={lazyLoad(Docs)()} />
            <Route path="about-team" element={lazyLoad(AboutTeam)()} />
            <Route path="api-endpoints" element={lazyLoad(ApiEndpoints)()} />
            <Route path="admin-section" element={lazyLoad(AdminSection)()} />
            <Route path="register" element={lazyLoad(Register)()} />
            <Route path="login" element={lazyLoad(Login)()} />
            <Route path="logout" element={lazyLoad(Logout)()} />
        </Route>
    ),
    {
        basename: '/',
    }
);

const Main = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.user.isAuthenticated);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseurl}/getUserDetails`, {
                    withCredentials: true,
                });
                const { email, role, name } = response.data;
                dispatch(addEmail({ email, role, name }));
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        const initializeApp = async () => {
            if (!isAuth) {
                await fetchUserDetails();
            } else {
                setLoading(false);
            }
        };

        initializeApp();
    }, [dispatch, isAuth]);

    if (loading) {
        return <CustomLoading />;
    }

    return (
        <Suspense fallback={<CustomLoading />}>
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
        </Suspense>
    );
};

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Application Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
                        <button 
                            className="rounded bg-blue-500 px-4 py-2 hover:bg-blue-600"
                            onClick={() => window.location.reload()}
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
        <Provider store={store}>
            <Main />
        </Provider>
    </ErrorBoundary>
);