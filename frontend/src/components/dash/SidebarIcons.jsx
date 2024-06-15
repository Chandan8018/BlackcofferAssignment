import React, { useEffect, useState } from "react";
import { HiUser } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { ImParagraphLeft } from "react-icons/im";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/moving-border";
import { FaTableCells } from "react-icons/fa6";

const SidebarIcons = () => {
  const [tab, setTab] = useState("");
  const location = useLocation();

  useEffect(() => {
    const urlPharse = new URLSearchParams(location.search);
    const tabFromUrl = urlPharse.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const DashboardIcon = () =>
    tab === "dash" ? (
      <div className=''>
        <Button
          borderRadius='1.75rem'
          className='bg-transparent text-black dark:text-white border-neutral-200 dark:border-slate-800 h-8 w-8'
        >
          <MdDashboard className='w-5 h-5 text-[#46C5F0]' />
        </Button>
      </div>
    ) : (
      <MdDashboard className='w-5 h-5' />
    );

  const ProfileIcon = () =>
    tab === "profile" ? (
      <div className=''>
        <Button
          borderRadius='1.75rem'
          className='bg-transparent text-black dark:text-white border-neutral-200 dark:border-slate-800 h-8 w-8'
        >
          <HiUser className='w-5 h-5 text-[#46C5F0]' />
        </Button>
      </div>
    ) : (
      <HiUser className='w-5 h-5' />
    );
  const BarGraphIcon = () =>
    tab === "race-bar" ? (
      <div className=''>
        <Button
          borderRadius='1.75rem'
          className='bg-transparent text-black dark:text-white border-neutral-200 dark:border-slate-800 h-8 w-8'
        >
          <ImParagraphLeft className='w-5 h-5 text-[#46C5F0]' />
        </Button>
      </div>
    ) : (
      <ImParagraphLeft className='w-5 h-5' />
    );
  const TableGraphIcon = () =>
    tab === "table-data" ? (
      <div className=''>
        <Button
          borderRadius='1.75rem'
          className='bg-transparent text-black dark:text-white border-neutral-200 dark:border-slate-800 h-8 w-8'
        >
          <FaTableCells className='w-5 h-5 text-[#46C5F0]' />
        </Button>
      </div>
    ) : (
      <FaTableCells className='w-5 h-5' />
    );

  return { DashboardIcon, ProfileIcon, BarGraphIcon, TableGraphIcon };
};

export default SidebarIcons;
