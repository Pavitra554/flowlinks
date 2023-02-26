import Link from "next/link";
import React from "react";
import { FiLink } from "react-icons/fi";


const Logo = () => {
  return (
    <Link href={"/"}>
      <div className='flex flex-row justify-center items-center group active:scale-95 ease-linear duration-150'>
        <div className='pr-2 !text-green-500 group-hover:scale-110 group-hover:text-green-400  ease-linear duration-150'>
          <FiLink size={30} />
        </div>
        <div className='text-2xl font-bold text-zinc-200 group-hover:text-white  ease-linear duration-150'>
          FlowLinks
        </div>
      </div>
    </Link>
  );
};

export default Logo;
