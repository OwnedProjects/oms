import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import Link from "next/link";

const Header = () => {
  return (
    <>
      <Navbar
        className="dark bg-slate-100"
        maxWidth="full"
        shouldHideOnScroll
        isBordered
      >
        <NavbarBrand>
          <Link href="/" className="text-primary font-bold text-inherit ">
            OMS - Order Management System
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link color="foreground" href="/pages/kitchen-display">
              Kitchen
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          <Link color="foreground" href="/">
            Login
          </Link>
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default Header;
