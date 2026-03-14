import React from 'react';
import { HeaderNavigationBase } from '../common/HeaderNavigationBase';

function NavClient({ toggleTheme, isDark, searchQuery, setSearchQuery, isHomePage }) {
  const clientItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/addorder" },
    { label: "Billing", href: "/billing" },
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