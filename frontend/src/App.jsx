import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import FooterComp from "./components/footer/FooterComp";
import Home from "./pages/Home";
import Service from "./pages/Service";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/privateroute/PrivateRoute";
import DashboardComp from "./components/dash/DashboardComp";
import Profile from "./components/dash/Profile";
import SideBarComp from "./components/dash/SideBarComp";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path='/service' element={<Service />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/test' element={<SideBarComp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
      <FooterComp />
    </BrowserRouter>
  );
}

export default App;
