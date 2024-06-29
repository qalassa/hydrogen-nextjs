import menu from "@config/menu.json";
import { useHeaderContext } from "context/state";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const { categories } = useHeaderContext();
  const [openMenu, setOpenMenu] = useState(false);
  const [navMenu, setNavMenu] = useState(menu.main); // Directly use Arabic names from the adjusted menu.json

  useEffect(() => {
    // Assuming categories are dynamic and need to be included in Arabic
    let dynamicItems = categories.map(cat => ({
      name: cat.arabicName, // Assuming you have an Arabic name field
      url: `/categories/${cat.slug}`,
      type: 'category'
    }));

        // Set the combined menu
        setNavMenu([...menu.main, ...dynamicItems]); // Combines static and dynamic menu items
      }, [router.asPath, categories]);

    return (
      <header className="header mt-8 pt-12 pb-3">
        <nav className="navbar container text-center md:text-left">
          <button className="btn btn-primary inline-flex items-center md:hidden" onClick={() => setOpenMenu(!openMenu)}>
            {/* Toggle SVG icons omitted for brevity */}
            Menu
          </button>
          <ul className={`navbar-nav order-3 ${!openMenu && "hidden"} w-full justify-center md:flex md:w-auto md:space-x-2 md:order-1`}>
            {navMenu.map((item, index) => (
              <li key={`menu-item-${index}`} className="nav-item">
                <Link onClick={() => setOpenMenu(false)} href={item.url} className={`nav-link inline-block ${router.asPath === item.url && "nav-link-active"}`}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  };
  
  export default Header;
