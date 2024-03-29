"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
  const currentLink = usePathname();
  return (
    <header className="header">
      <Link href={"/"} className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-svg.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>
      <nav className="flex gap-2 ">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <Image
                src="/assets/icons/menu.svg"
                alt="menu-mobile"
                width={32}
                height={32}
              />
            </SheetTrigger>

            {/* custom sheet content 
            - side=left | right | bottom | top
            */}
            <SheetContent className="sheett-content sm:w-64">
              <>
                <Image
                  src="/assets/images/logo-svg.svg"
                  alt="logo"
                  width={152}
                  height={23}
                />
                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    // check current link user is on and active class if it matches
                    const isActive = link.route === currentLink;
                    return (
                      <li
                        key={link.route}
                        className={`sidebar-nav_element group ${
                          isActive && "gradient-text"
                        } p-18 flex whitespace-nowrap text-dark-700`}
                      >
                        <SheetClose asChild>
                          <Link
                            href={link.route}
                            className="sidebar-link cursor-pointer"
                          >
                            <Image
                              src={link.icon}
                              alt="log"
                              width={24}
                              height={24}
                            />
                            {link.label}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        {/* When user logout */}
        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href={"/sign-in"}>Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
