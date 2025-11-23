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
import CartPage from "./pages/carts/CartPage";
import VoucherPage from "./pages/vouchers/VoucherPage";

const LayoutWithHeaderSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

  return (
<div className="min-h-screen min-w-screen">
  <Header />
  <div className="w-full flex mt-16 relative">
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
   <main
  className={`w-full  transition-all duration-300 p-6 ${
    isOpen ? "ml-[256px]" : "ml-[80px]"
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
          <Route path="dashboard/carts" element={<CartPage/>} />
          <Route path="/dashboard/vouchers" element={<VoucherPage />}></Route>
          <Route path="/" element={<Dashboard />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
