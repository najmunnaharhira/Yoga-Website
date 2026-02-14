import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Aos from 'aos';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Classes from './pages/Classes';
import ClassDetails from './pages/ClassDetails';
import Instructors from './pages/Instructors';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ApplyInstructor from './pages/ApplyInstructor';
import NotFound from './pages/NotFound';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import InstructorDashboard from './pages/Dashboard/InstructorDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'classes', element: <Classes /> },
      { path: 'class/:id', element: <ClassDetails /> },
      { path: 'instructors', element: <Instructors /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'apply-instructor', element: <ApplyInstructor /> },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <StudentDashboard /> },
          { path: 'instructor', element: <InstructorDashboard /> },
          { path: 'admin', element: <AdminDashboard /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

Aos.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  </QueryClientProvider>
);
