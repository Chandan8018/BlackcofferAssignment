import {
  Avatar,
  Dropdown,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSignOutAlt, FaSun, FaUserCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { Button } from "../ui/moving-border";
import { ImProfile } from "react-icons/im";
import { signoutSuccess } from "../../redux/user/userSlice";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

function Header() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Navbar
      fluid
      className='bg-gray-400 sticky md:top-3 md:mx-14 md:rounded-full opacity-85 z-40'
    >
      <NavbarBrand>
        <Link to='/'>
          <span className='flex justify-start items-center whitespace-nowrap text-xl font-semibold dark:text-white pl-7'>
            <span className='bg-black text-white rounded-xl rounded-tr-none rounded-br-none py-1 pl-2'>
              Black
            </span>{" "}
            <span className='bg-[#6F4E37] text-white rounded-xl rounded-tl-none rounded-bl-none py-1 pr-2'>
              coffer
            </span>
          </span>
        </Link>
      </NavbarBrand>
      <PlaceholdersAndVanishInput
        placeholders={[
          "What's the first rule of Fight Club?",
          "Who is Tyler Durden?",
          "Where is Andrew Laeddis Hiding?",
          "Write a Javascript method to reverse a string",
          "How to assemble your own PC?",
        ]}
      />
      <div className='flex gap-5 md:order-2 md:pr-10'>
        <Button
          borderRadius='1.75rem'
          className='bg-tansparent text-black dark:text-white border-neutral-200 dark:border-slate-800 w-full h-10 mr-10'
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaSun className='w-5 h-5' />
          ) : (
            <FaMoon className='w-5 h-5' />
          )}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='user'
                img={currentUser.profilePicture}
                rounded
                className='h-8 w-10'
              />
            }
          >
            <Dropdown.Header>
              <FaUserCheck className='w-10 h-10' color='navy' />

              <span className='block text-md font-bold text-black truncate'>
                @{currentUser.username}
              </span>
              <span className='block text-sm font-medium text-black truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Link to='/dashboard?tab=dash'>
              <Dropdown.Item className='text-blue-500 font-semibold'>
                <ImProfile className='w-4 h-4 mr-2' color='blue' />
                Dashboard
              </Dropdown.Item>
            </Link>

            <Dropdown.Divider />

            <Dropdown.Item
              className='text-red-500 font-semibold'
              onClick={() => {
                dispatch(signoutSuccess());
                navigate("/");
              }}
            >
              <FaSignOutAlt className='w-4 h-4 mr-2' color='red' />
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Button
            borderRadius='1.75rem'
            className='bg-transparent border-slate-800 mr-4 text-sm font-semibold text-black dark:text-white'
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </Button>
        )}

        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink active={path === "/"} as={"div"}>
          <Link to='/'>Home</Link>
        </NavbarLink>

        <NavbarLink active={path === "/about"} as={"div"}>
          <Link to='/about'>About Us</Link>
        </NavbarLink>

        <NavbarLink active={path === "/contact"} as={"div"}>
          <Link to='/contact'>Contact Us</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Header;
