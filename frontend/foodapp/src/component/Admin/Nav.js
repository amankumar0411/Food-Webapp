import React from 'react';
import { HeaderNavigationBase } from '../common/HeaderNavigationBase';

function Nav({ toggleTheme, isDark, searchQuery, setSearchQuery, isHomePage }) {
  const adminItems = [
    { label: "Home", href: "/home" },
    {
      label: "Food Management",
      href: "#",
      items: [
        { label: "Add Food", href: "/addfood" },
        { label: "Food List", href: "/foodlist" },
        { label: "Update Food", href: "/updatefood" },
        { label: "Delete Food", href: "/deletefood" },
      ],
    },
    {
      label: "Orders",
      href: "#",
      items: [
        { label: "All Orders",     href: "/adminorders" },
        { label: "Order Details",  href: "/adminorderdtls" },
      ],
    },
  ];

  return (
    <HeaderNavigationBase 
      brandName="FOOD APP ADMIN"
      items={adminItems}
      toggleTheme={toggleTheme}
      isDark={isDark}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isHomePage={isHomePage}
    />
  );
}

export default Nav;