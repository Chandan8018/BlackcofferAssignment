import { Drawer, Sidebar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { HiSearch } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../../redux/user/userSlice";
import { CiCircleChevRight } from "react-icons/ci";
import SidebarIcons from "./SidebarIcons";
import { Button } from "../ui/moving-border";

function SideBarComp() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { DashboardIcon, ProfileIcon, BarGraphIcon, TableGraphIcon } =
    SidebarIcons();

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const urlPharse = new URLSearchParams(location.search);
    const tabFromUrl = urlPharse.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    currentUser && (
      <>
        <div className='flex items-center h-full ml-0 md:ml-2 '>
          <Button
            borderRadius='1.75rem'
            className='bg-transparent text-black dark:text-white border-neutral-200 dark:border-slate-800 h-8 w-8'
            onClick={() => setIsOpen(true)}
          >
            <CiCircleChevRight className='h-7 w-7' />
          </Button>
        </div>
        <Drawer
          open={isOpen}
          onClose={handleClose}
          className='w-[225px] h-screen'
        >
          <Drawer.Header title='MENU' titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar
              aria-label='Sidebar with multi-level dropdown example'
              className='[&>div]:bg-transparent [&>div]:p-0'
            >
              <div className='flex h-full flex-col justify-between py-2'>
                <div>
                  <form className='pb-3 md:hidden'>
                    <TextInput
                      icon={HiSearch}
                      type='search'
                      placeholder='Search'
                      required
                      className='w-48'
                    />
                  </form>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <Link to='/dashboard?tab=dash'>
                        <Sidebar.Item
                          active={tab === "dash"}
                          icon={DashboardIcon}
                          className='cursor-pointer  hover:bg-[#6F4E37] hover:dark:bg-[#6F4E37] hover:text-white hover:text-md hover:opacity-85 rounded-lg w-48 mb-4'
                          as='div'
                        >
                          Dashboard
                        </Sidebar.Item>
                      </Link>
                      <Link to='/dashboard?tab=race-bar'>
                        <Sidebar.Item
                          active={tab === "race-bar"}
                          icon={BarGraphIcon}
                          className='cursor-pointer  hover:bg-[#6F4E37] hover:dark:bg-[#6F4E37] hover:text-white hover:text-md hover:opacity-85 rounded-lg w-48 mb-4'
                          as='div'
                        >
                          Race Bar Chart
                        </Sidebar.Item>
                      </Link>
                      <Link to='/dashboard?tab=table-data'>
                        <Sidebar.Item
                          active={tab === "table-data"}
                          icon={TableGraphIcon}
                          className='cursor-pointer  hover:bg-[#6F4E37] hover:dark:bg-[#6F4E37] hover:text-white hover:text-md hover:opacity-85 rounded-lg w-48 mb-4'
                          as='div'
                        >
                          Table Data
                        </Sidebar.Item>
                      </Link>
                      <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item
                          active={tab === "profile"}
                          icon={ProfileIcon}
                          className='cursor-pointer  hover:bg-[#6F4E37] hover:dark:bg-[#6F4E37] hover:text-white hover:text-md hover:opacity-85 rounded-lg w-48 mb-4'
                          as='div'
                        >
                          Profile
                        </Sidebar.Item>
                      </Link>
                      <Sidebar.Item
                        icon={FaSignOutAlt}
                        className='cursor-pointer  hover:bg-[#ff5555] hover:dark:bg-[#ff5555] hover:text-white hover:text-md hover:opacity-85 rounded-lg w-48 mb-4'
                        onClick={() => {
                          handleSignout();
                          dispatch(signoutSuccess());
                          navigate("/");
                        }}
                      >
                        Sign Out
                      </Sidebar.Item>
                    </Sidebar.ItemGroup>
                  </Sidebar.Items>
                </div>
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>
      </>
    )
  );
}

export default SideBarComp;
