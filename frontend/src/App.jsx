import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from 'react-toastify';
import HomePage from "./taskComponents/HomePage";
import Create from "./taskComponents/Create";
import Update from "./taskComponents/Update";
import Total from "./taskComponents/Total";
import Pending from "./taskComponents/Pending";
import Completed from "./taskComponents/Completed";
import Inprogress from "./taskComponents/Inprogress";

function App() {
  return (
   <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <Routes>
      <Route path="/" element={<Home/>}/>
      {/* <Route path="/login" element={<Login/>}/> */}
        <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Login />} />

      <Route path="/email-verify" element={<EmailVerify/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
       <Route path='/home' element={<HomePage />} />
        <Route path='/create' element={<Create />} />
        <Route path='/update/:id' element={<Update />} />
        <Route path='/total' element={<Total />} />
        <Route path='/pending' element={<Pending/>} />
        <Route path='/completed' element={<Completed />} />
        <Route path='/inprogress' element={<Inprogress/>} />
    </Routes>
  
   </div>
  );
}

export default App;
