import React from 'react';
import { HeaderNavigationBase } from '../common/HeaderNavigationBase';

function Nav({ toggleTheme, isDark, searchQuery, setSearchQuery, isHomePage }) {
  const adminItems = [
    { label: "Home", href: "/home" },
    {
      label: "Menu Management",
      href: "#",
      items: [
        { label: "Add Food Item", href: "/addfood" },
        { label: "View Menu List", href: "/foodlist" },
        { label: "Update Menu Item", href: "/updatefood" },
        { label: "Delete Menu Item", href: "/deletefood" },
      ],
    },
    {
      label: "Merchant Orders",
      href: "#",
      items: [
        { label: "Manage Orders & Status",  href: "/adminorderdtls" },
      ],
    },
  ];

  return (
    <HeaderNavigationBase 
      brandName="MERCHANT PORTAL"
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