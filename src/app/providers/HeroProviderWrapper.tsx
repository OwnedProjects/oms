"use client"; // This makes it a client component

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { UserProvider } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";

export default function HeroUIProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <UserProvider>
        <CartProvider>
          <ToastProvider>{children}</ToastProvider>
        </CartProvider>
      </UserProvider>
    </HeroUIProvider>
  );
}
