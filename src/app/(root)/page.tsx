import React from "react";
import { UserButton } from "@clerk/nextjs";
import { navLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/components/shared/Collection";
import { getAllImage } from "@/lib/actions/image.actions";

const Home = async ({searchParams}: SearchParamProps) => {
  
  // current page 
  const page = Number(searchParams?.page) || 1;

  const searchQuery = (searchParams?.query as string) || '';

  const images = await getAllImage({page, searchQuery});
  
  return (
    <>
      <section className="home">
        <h1 className="home-heading">Giải Phóng Sự Sáng Tạo Cùng Smart Image</h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1,5).map((links) => (
            <Link key={links.route} href={links.route} className="flex-center flex-col gap-2">
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={links.icon} alt="image" width={24} height={24}/>
              </li>
              <p className="p-14-medium text-center text-white">{links.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.total}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
