import React from 'react';
import { HeaderNavigationBase } from '../common/HeaderNavigationBase';

function NavClient({ toggleTheme, isDark, searchQuery, setSearchQuery, isHomePage }) {
  const role = localStorage.getItem("role");
  const isDriver = role && role.toLowerCase() === "driver";

  const clientItems = [
    { label: "Home", href: "/" },
    ...(isDriver ? [{ label: "🛵 Fleet Dashboard", href: "/driver/dashboard" }] : [
      { label: "Cart", href: "/addorder" },
    ]),
    { label: "My Account", href: "/account" },
  ];

  return (
    <HeaderNavigationBase 
      brandName="FOOD APP"
      items={clientItems}
      toggleTheme={toggleTheme}
      isDark={isDark}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isHomePage={isHomePage}
    />
  );
}

export default NavClient;