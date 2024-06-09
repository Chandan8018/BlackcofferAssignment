import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBarComp from "../components/dash/SideBarComp";
import DashboardComp from "../components/dash/DashboardComp";
import Profile from "../components/dash/Profile";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlPharse = new URLSearchParams(location.search);
    const tabFromUrl = urlPharse.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <>
      <div className='min-h-screen flex flex-row'>
        <div className=''>
          {/* SideBar  */}
          <SideBarComp />
        </div>

        {tab === "dash" && <DashboardComp />}
        {tab === "profile" && <Profile />}
      </div>
    </>
  );
}
