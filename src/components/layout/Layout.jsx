import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Home,
  Dumbbell,
  Apple,
  TrendingUp,
  BarChart3,
  FileBarChart,
  User,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

import { logout } from '../../redux/slices/authSlice';
import { authDialog } from '../../utils/authDialog';
import BrandMark from '../common/BrandMark';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { ToastContainer } from '../../utils/toast';
import { ThemeToggle } from '../theme';


/* ============================================================
   Main app sections
   ============================================================ */

const navItems = [
  {
    name: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    name: 'Workouts',
    icon: Dumbbell,
    path: '/workouts',
  },
  {
    name: 'Nutrition',
    icon: Apple,
    path: '/nutrition',
  },
  {
    name: 'Progress',
    icon: TrendingUp,
    path: '/progress',
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
  },
];


/* ============================================================
   Secondary navigation
   ============================================================ */

const secondaryNavItems = [
  {
    name: 'Reports',
    icon: FileBarChart,
    path: '/reports',
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
  },
  {
    name: 'Support',
    icon: LifeBuoy,
    path: '/support',
  },
];


/* ============================================================
   Shared easing
   ============================================================ */

const SLIDE_EASE =
  'ease-[cubic-bezier(0.22,1,0.36,1)]';


/* ============================================================
   Route matching
   ============================================================ */

const isRouteActive = (pathname, itemPath) => {
  const current =
    pathname.length > 1
      ? pathname.replace(/\/+$/, '')
      : pathname;

  return (
    current === itemPath ||
    current.startsWith(`${itemPath}/`)
  );
};


/* ============================================================
   User Avatar
   ============================================================ */

const UserAvatar = ({
  user,
  size = 'w-10 h-10',
  textSize = 'text-sm',
  ring = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const profilePicture = user?.profilePicture;

  const initial =
    user?.name?.charAt(0)?.toUpperCase() || 'U';

  // Reset image error when the profile picture changes
  useEffect(() => {
    setImageError(false);
  }, [profilePicture]);

  const showImage =
    profilePicture && !imageError;

  return (
    <div
      className={`
        ${size}
        rounded-full
        bg-lime-400
        flex
        items-center
        justify-center
        text-black
        font-bold
        ${textSize}
        flex-shrink-0
        overflow-hidden
        ${ring ? 'ring-2 ring-lime-400 ring-offset-2 ring-offset-black' : ''}
      `}
    >
      {showImage ? (
        <img
          src={profilePicture}
          alt={`${user?.name || 'User'} profile`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initial
      )}
    </div>
  );
};


/* ============================================================
   Desktop sidebar item
   ============================================================ */

const SidebarItem = ({
  item,
  active,
  collapsed,
  onClick,
}) => (
  <button
    onClick={onClick}
    data-active={active ? 'true' : 'false'}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? item.name : undefined}
    className={`
      relative
      z-10
      w-full
      flex
      items-center
      gap-3
      px-4
      py-3
      rounded-lg
      transition-colors
      duration-300
      group
      ${
        active
          ? 'text-black font-semibold'
          : 'text-white hover:bg-gray-900 hover:text-lime-400'
      }
      ${collapsed ? 'justify-center' : ''}
    `}
  >
    <item.icon
      size={20}
      className={`
        flex-shrink-0
        transition-colors
        duration-300
        ${
          active
            ? 'text-black'
            : 'group-hover:text-lime-400'
        }
      `}
      strokeWidth={active ? 2.5 : 2}
    />

    {!collapsed && (
      <span className="text-sm font-medium whitespace-nowrap truncate">
        {item.name}
      </span>
    )}
  </button>
);


/* ============================================================
   Desktop sidebar group
   ============================================================ */

const SidebarGroup = ({
  items,
  isActive,
  collapsed,
  onNavigate,
}) => {
  const groupRef = useRef(null);

  const [pill, setPill] = useState({
    top: 0,
    height: 0,
    visible: false,
  });

  const [ready, setReady] = useState(false);

  const activePath = items.find(
    (item) => isActive(item.path)
  )?.path;


  useLayoutEffect(() => {
    const group = groupRef.current;

    if (!group) {
      return undefined;
    }

    const measure = () => {
      const el = group.querySelector(
        '[data-active="true"]'
      );

      if (el) {
        setPill({
          top: el.offsetTop,
          height: el.offsetHeight,
          visible: true,
        });
      } else {
        setPill((prev) => ({
          ...prev,
          visible: false,
        }));
      }
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(group);

    return () => observer.disconnect();
  }, [activePath, collapsed]);


  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setReady(true)
    );

    return () => cancelAnimationFrame(id);
  }, []);


  return (
    <div
      ref={groupRef}
      className="relative space-y-2"
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          rounded-lg
          bg-lime-400
          ${
            ready
              ? `
                transition-[transform,height,opacity]
                duration-300
                ${SLIDE_EASE}
                motion-reduce:transition-none
              `
              : ''
          }
        `}
        style={{
          height: pill.height,
          transform: `translateY(${pill.top}px)`,
          opacity: pill.visible ? 1 : 0,
        }}
      />

      {items.map((item) => (
        <SidebarItem
          key={item.path}
          item={item}
          active={isActive(item.path)}
          collapsed={collapsed}
          onClick={() => onNavigate(item.path)}
        />
      ))}
    </div>
  );
};


/* ============================================================
   Layout
   ============================================================ */

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(
    () =>
      localStorage.getItem('fittrack:sidebar') !==
      'closed'
  );

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const userMenuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  /* ==========================================================
     Get current user
     ========================================================== */

  const authUser = useSelector(
    (state) => state.auth?.user
  );

  const profileUser = useSelector(
    (state) => state.user?.user
  );

  /*
    Prefer the user from userSlice because the profile-picture
    upload can update that user immediately.

    Fall back to authSlice if userSlice does not contain one.
  */
  const user = profileUser || authUser;


  /* ==========================================================
     User information
     ========================================================== */

  const initial =
    user?.name?.charAt(0)?.toUpperCase() || 'U';

  const firstName =
    user?.name?.split(' ')[0] || 'User';


  /* ==========================================================
     Logout
     ========================================================== */

  const handleLogout = async () => {
    // Read the name now — `user` is cleared once logout() runs
    const username =
      user?.username || user?.name || 'You';

    const confirmed = await authDialog.confirm({
      title: 'Log out?',
      message: `${username}, you'll need to log in again to keep tracking.`,
      confirmText: 'Log out',
      cancelText: 'Stay logged in',
      icon: LogOut,
    });

    if (!confirmed) {
      return;
    }

    dispatch(logout());

    localStorage.removeItem('token');

    navigate('/login');

    // Not awaited: it shows on the login page and closes itself
    authDialog.success({
      title: 'Logged out',
      message: `${username} successfully logged out.`,
    });
  };


  /* ==========================================================
     Sidebar toggle
     ========================================================== */

  const toggleSidebar = () => {
    setSidebarOpen((open) => {
      localStorage.setItem(
        'fittrack:sidebar',
        open ? 'closed' : 'open'
      );

      return !open;
    });
  };


  /* ==========================================================
     Route active
     ========================================================== */

  const isActive = (path) =>
    isRouteActive(location.pathname, path);

  const profileActive = isActive('/profile');


  /* ==========================================================
     Mobile bottom navigation
     ========================================================== */

  const activeIndex = navItems.findIndex(
    (item) => isActive(item.path)
  );

  const lastIndexRef = useRef(0);

  if (activeIndex >= 0) {
    lastIndexRef.current = activeIndex;
  }

  const pillIndex = lastIndexRef.current;


  /* ==========================================================
     Close user menu when clicking outside
     ========================================================== */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    document.addEventListener(
      'touchstart',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

      document.removeEventListener(
        'touchstart',
        handleClickOutside
      );
    };
  }, []);


  /* ==========================================================
     Close user menu on route change
     ========================================================== */

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);


  /* ==========================================================
     Render
     ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col lg:flex-row transition-colors duration-200">

      {/* ======================================================
          DESKTOP SIDEBAR
          ====================================================== */}

      <aside
        className={`
          hidden
          lg:flex
          fixed
          inset-y-0
          left-0
          z-40
          bg-black
          text-white
          flex-col
          border-r
          border-gray-800
          transition-all
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? 'w-64'
              : 'w-20'
          }
        `}
      >

        {/* Brand row */}

        <div
          className={`
            flex
            items-center
            h-16
            box-content
            border-b-2
            border-lime-400
            shrink-0
            ${
              sidebarOpen
                ? 'px-4'
                : 'justify-center px-2'
            }
          `}
        >
          <button
            onClick={() =>
              navigate('/dashboard')
            }
            aria-label="FitTrack home"
            className="
              flex
              items-center
              gap-3
              min-w-0
              rounded-lg
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-lime-400
            "
          >
            <BrandMark />

            {sidebarOpen && (
              <span className="
                text-xl
                font-bold
                text-lime-400
                whitespace-nowrap
                truncate
              ">
                Fitness Tracker 
              </span>
            )}
          </button>
        </div>


        {/* Collapse toggle */}

        <button
          onClick={toggleSidebar}
          title={
            sidebarOpen
              ? 'Collapse sidebar'
              : 'Expand sidebar'
          }
          aria-label={
            sidebarOpen
              ? 'Collapse sidebar'
              : 'Expand sidebar'
          }
          aria-expanded={sidebarOpen}
          className="
            absolute
            top-5
            -right-3
            z-50
            w-6
            h-6
            rounded-full
            bg-lime-400
            text-black
            shadow-md
            flex
            items-center
            justify-center
            hover:bg-lime-300
            transition-colors
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-white
          "
        >
          {sidebarOpen ? (
            <ChevronLeft
              size={14}
              strokeWidth={3}
            />
          ) : (
            <ChevronRight
              size={14}
              strokeWidth={3}
            />
          )}
        </button>


        {/* Main navigation */}

        <nav
          aria-label="Main"
          className="
            flex-1
            px-2
            py-6
            overflow-hidden
            hover:overflow-y-auto
            scroll-smooth
            custom-scrollbar
          "
        >
          <SidebarGroup
            items={navItems}
            isActive={isActive}
            collapsed={!sidebarOpen}
            onNavigate={navigate}
          />
        </nav>


        {/* Secondary navigation */}

        <nav
          aria-label="Secondary"
          className="
            px-2
            py-4
            border-t
            border-gray-800
          "
        >
          <SidebarGroup
            items={secondaryNavItems}
            isActive={isActive}
            collapsed={!sidebarOpen}
            onNavigate={navigate}
          />
        </nav>


        {/* ====================================================
            Account card
            ==================================================== */}

        <div
          className={`
            px-3
            py-4
            border-t
            border-gray-800
            flex
            gap-2
            ${
              sidebarOpen
                ? 'flex-row items-center'
                : 'flex-col items-center'
            }
          `}
        >

          {/* Profile button */}

          <button
            onClick={() =>
              navigate('/profile')
            }
            aria-label="Open profile"
            aria-current={
              profileActive
                ? 'page'
                : undefined
            }
            title={
              !sidebarOpen
                ? `${user?.name || 'Profile'}`
                : undefined
            }
            className={`
              flex
              items-center
              gap-3
              min-w-0
              rounded-lg
              p-2
              text-left
              transition-colors
              duration-200
              hover:bg-gray-900
              ${
                sidebarOpen
                  ? 'flex-1'
                  : ''
              }
              ${
                profileActive
                  ? 'bg-gray-900'
                  : ''
              }
            `}
          >

            {/* USER AVATAR */}

            <UserAvatar
              user={user}
              size="w-10 h-10"
              textSize="text-sm"
              ring={profileActive}
            />

            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="
                  text-sm
                  font-semibold
                  text-white
                  truncate
                ">
                  {firstName}
                </p>

                <p className="
                  text-xs
                  text-gray-400
                  truncate
                ">
                  {user?.email}
                </p>
              </div>
            )}
          </button>


          {/* Logout */}

          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="
              p-2
              rounded-lg
              text-gray-400
              hover:text-red-300
              hover:bg-red-900/20
              transition-colors
              duration-200
              flex-shrink-0
            "
          >
            <LogOut size={18} />
          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN AREA
          ====================================================== */}

      <div
        className={`
          flex-1
          flex
          flex-col
          min-w-0
          transition-all
          duration-300
          ${
            sidebarOpen
              ? 'lg:ml-64'
              : 'lg:ml-20'
          }
        `}
      >

        {/* ====================================================
            TOP HEADER
            ==================================================== */}

        <header
          className="
            bg-black
            border-b-2
            border-lime-400
            sticky
            top-0
            z-30
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              sm:px-6
              h-14
              sm:h-16
              gap-3
            "
          >

            {/* Mobile brand */}

            <button
              onClick={() =>
                navigate('/dashboard')
              }
              className="
                lg:hidden
                flex
                items-center
                justify-center
                gap-2
                min-w-0
              "
              aria-label="FitTrack home"
            >
              <BrandMark />

              <span className="
                text-lg
                font-bold
                text-white
                whitespace-nowrap
              ">
                Fitness
                <span className="text-lime-400">
                  Tracker
                </span>
              </span>
            </button>


            {/* Right side actions */}

            <div
              className="
                flex
                items-center
                gap-1
                sm:gap-3
                ml-auto
              "
            >

              {/* Search */}

              <button
                onClick={() =>
                  navigate('/search')
                }
                className="
                  p-2
                  rounded-lg
                  text-white
                  hover:text-lime-400
                  hover:bg-gray-900
                  transition-colors
                "
                title="Search"
                aria-label="Search"
              >
                <Search size={20} />
              </button>


              {/* Theme */}

              <ThemeToggle variant="icon" />


              {/* Notifications */}

              <NotificationDropdown />


              {/* =================================================
                  User menu
                  ================================================= */}

              <div
                className="relative"
                ref={userMenuRef}
              >
                <button
                  onClick={() =>
                    setUserMenuOpen(
                      !userMenuOpen
                    )
                  }
                  aria-label="Open user menu"
                  aria-expanded={
                    userMenuOpen
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    p-1
                    sm:pr-3
                    rounded-full
                    hover:bg-gray-900
                    transition-colors
                  "
                >

                  {/* HEADER AVATAR */}

                  <UserAvatar
                    user={user}
                    size="w-8 h-8"
                    textSize="text-sm"
                  />

                  <span
                    className="
                      hidden
                      lg:block
                      text-sm
                      font-medium
                      text-white
                    "
                  >
                    {firstName}
                  </span>

                </button>


                {/* User dropdown */}

                {userMenuOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      mt-2
                      w-52
                      bg-white
                      dark:bg-gray-900
                      rounded-lg
                      shadow-lg
                      border-2
                      border-lime-400
                      dark:border-lime-500
                      py-2
                      z-50
                    "
                  >

                    {/* User information */}

                    <div
                      className="
                        px-4
                        py-2
                        border-b
                        border-gray-200
                        dark:border-gray-800
                      "
                    >
                      <div className="
                        flex
                        items-center
                        gap-3
                        mb-2
                      ">
                        <UserAvatar
                          user={user}
                          size="w-9 h-9"
                          textSize="text-xs"
                        />

                        <div className="min-w-0">
                          <p className="
                            text-sm
                            font-semibold
                            text-black
                            dark:text-white
                            truncate
                          ">
                            {user?.name}
                          </p>

                          <p className="
                            text-xs
                            text-gray-600
                            dark:text-gray-400
                            truncate
                          ">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>


                    {/* Profile */}

                    <button
                      onClick={() => {
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        text-sm
                        text-black
                        dark:text-white
                        hover:bg-gray-100
                        dark:hover:bg-gray-800
                        transition-colors
                      "
                    >
                      <User size={16} />

                      Profile
                    </button>


                    {/* Settings */}

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setUserMenuOpen(false);
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        text-sm
                        text-black
                        dark:text-white
                        hover:bg-gray-100
                        dark:hover:bg-gray-800
                        transition-colors
                      "
                    >
                      <Settings size={16} />

                      Settings
                    </button>


                    {/* Reports */}

                    <button
                      onClick={() => {
                        navigate('/reports');
                        setUserMenuOpen(false);
                      }}
                      className="
                        lg:hidden
                        w-full
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        text-sm
                        text-black
                        dark:text-white
                        hover:bg-gray-100
                        dark:hover:bg-gray-800
                        transition-colors
                      "
                    >
                      <FileBarChart
                        size={16}
                      />

                      Reports
                    </button>


                    {/* Support */}

                    <button
                      onClick={() => {
                        navigate('/support');
                        setUserMenuOpen(false);
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        text-sm
                        text-black
                        dark:text-white
                        hover:bg-gray-100
                        dark:hover:bg-gray-800
                        transition-colors
                      "
                    >
                      <LifeBuoy size={16} />

                      Support
                    </button>


                    {/* Logout */}

                    <div
                      className="
                        border-t
                        border-gray-200
                        dark:border-gray-800
                        pt-1
                        mt-1
                      "
                    >
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="
                          w-full
                          flex
                          items-center
                          gap-2
                          px-4
                          py-2.5
                          text-sm
                          text-red-600
                          dark:text-red-400
                          hover:bg-red-50
                          dark:hover:bg-red-950/40
                          transition-colors
                        "
                      >
                        <LogOut size={16} />

                        Logout
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          </div>
        </header>


        {/* ====================================================
            PAGE CONTENT
            ==================================================== */}

        <main className="flex-1 pb-24 lg:pb-0">
          {children}
        </main>

      </div>


      {/* ======================================================
          MOBILE BOTTOM NAV
          ====================================================== */}

      <nav
        aria-label="Main"
        className="
          lg:hidden
          fixed
          bottom-0
          inset-x-0
          z-40
          bg-black
          border-t-2
          border-lime-400
          pb-[env(safe-area-inset-bottom)]
        "
      >
        <div
          className="
            max-w-xl
            mx-auto
            px-2
            py-2
          "
        >
          <ul
            className="
              relative
              flex
              items-center
              justify-around
            "
          >

            {/* Sliding highlight */}

            <li
              aria-hidden="true"
              className={`
                pointer-events-none
                absolute
                left-0
                top-0
                flex
                justify-center
                transition-[transform,opacity]
                duration-300
                ${SLIDE_EASE}
                motion-reduce:transition-none
              `}
              style={{
                width: `${100 / navItems.length}%`,
                transform: `translateX(${pillIndex * 100}%)`,
                opacity:
                  activeIndex >= 0 ? 1 : 0,
              }}
            >
              <span
                className="
                  block
                  w-12
                  h-12
                  rounded-xl
                  bg-lime-400
                "
              />
            </li>


            {navItems.map((item) => {
              const active = isActive(
                item.path
              );

              return (
                <li
                  key={item.path}
                  className="
                    relative
                    z-10
                    flex-1
                    flex
                    justify-center
                  "
                >
                  <button
                    onClick={() =>
                      navigate(item.path)
                    }
                    aria-label={item.name}
                    aria-current={
                      active
                        ? 'page'
                        : undefined
                    }
                    title={item.name}
                    className={`
                      flex
                      items-center
                      justify-center
                      w-12
                      h-12
                      rounded-xl
                      transition-colors
                      duration-300
                      active:scale-95
                      ${
                        active
                          ? 'text-black'
                          : `
                            text-gray-400
                            hover:text-lime-400
                            active:bg-gray-900
                          `
                      }
                    `}
                  >
                    <item.icon
                      size={24}
                      strokeWidth={
                        active ? 2.5 : 2
                      }
                    />
                  </button>
                </li>
              );
            })}

          </ul>
        </div>
      </nav>


      {/* Toasts */}

      <ToastContainer />


      {/* ======================================================
          Custom scrollbar
          ====================================================== */}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(204, 255, 0, 0.4);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(204, 255, 0, 0.6);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(204, 255, 0, 0.4) transparent;
        }

        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>

    </div>
  );
};


export default Layout;