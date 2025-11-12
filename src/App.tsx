import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./layouts/Header";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Sidebar from "./layouts/SideBar";
import Dashboard from "./pages/Dashboard";
import User from "./pages/Users";
import { ToastContainer } from "react-toastify";
import ProductsPage from "./pages/ProductPage";

const LayoutWithHeaderSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

  return (
<div className="flex flex-col min-h-screen w-full">
  <Header />
  <div className="flex w-full mt-16 relative">
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
   <main
  className={`flex-grow transition-all duration-300 p-6 ${
    isOpen ? "ml-58 w-[40%]" : "ml-20"
  }`}
>

      <Outlet />
    </main>
  </div>
</div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<LayoutWithHeaderSidebar />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/users" element={<User />} /> 
          <Route path="/dashboard/products" element={<ProductsPage />}></Route>
          <Route path="/" element={<Dashboard />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
