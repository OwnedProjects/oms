import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import Link from "next/link";

const Header = () => {
  return (
    <>
      <Navbar className="dark py-4 bg-slate-100 mb-1" shouldHideOnScroll>
        <NavbarBrand>
          <p className="text-primary font-bold text-inherit">
            OMS - Order Management System
          </p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link color="foreground" href="/pages/kitchen-display">
              Kitchen
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent as="div" justify="end"></NavbarContent>
        {/* <NavbarContent justify="end">
          <NavbarItem className="hidden xs:flex">
            <Link href="#">Checkout</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="#" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent> */}
      </Navbar>
    </>
  );
};

export default Header;
