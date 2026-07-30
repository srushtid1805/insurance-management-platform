import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomerPage from "./pages/CustomerPage";
import PolicyPage from "./pages/PolicyPage";
import UserPolicyPage from "./pages/UserPolicyPage";
import PaymentPage from "./pages/PaymentPage";
import ClaimPage from "./pages/ClaimPage";
import DocumentPage from "./pages/DocumentPage";

import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <>

    <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/customers" element={<CustomerPage />} />
      <Route path="/policies" element={<PolicyPage/>} />
      <Route path="/user-policies" element={<UserPolicyPage/>} />
      <Route path="/payments" element={<PaymentPage />} />
      <Route path="/claims" element={<ClaimPage />} />
      <Route path="/documents" element={<DocumentPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
    
    </>
  );
}

export default App;