import React from "react";
import { useControls } from "../../store/useControls";
import OtherLink from "./OtherLink";
import SocialLink from "./SocialLink";

const Card = () => {
  const avatarStyle = useControls((e)=>e.avatarStyle)
  const userTheme = useControls((e)=>e.userTheme)

  return (
    <div style={userTheme&&{backgroundColor:userTheme.c4}} className={`max-w-sm w-full shadow-2xl shadow-black/60 p-4 rounded-lg ease-linear duration-150 bg-gray-800/50 `}>
      {/*Cover and Avatar */}
      <div className='relative mb-10 flex items-center justify-center select-none'>
        <div className=' h-40 rounded-md w-full  bg-fixed shadow-2xl'>
          <img
            src={
              "https://blog.pixlr.com/wp-content/uploads/2021/09/Pixlr-NFT-Art-Glitched-Vaporwave-3-1536x888.png"
            }
            className='h-full w-full rounded-md -z-10'
            alt='Cover'
          />
          <div className=' absolute top-0 w-full h-full rounded-md bg-gradient-to-t from-gray-900/80 via-gray-900/0 to-gray-900/0'></div>
        </div>
        <div className={`h-24 w-24 absolute ${avatarStyle} -bottom-6 bg-gray-700 shadow-xl`}>
          <img
            src={"https://avatarfiles.alphacoders.com/169/thumb-169513.png"}
            className={`h-full w-full  ${avatarStyle}`}
            alt='Cover'
          />
        </div>
      </div>
      {/*Name / user id / Des */}
      <div style={userTheme && {backgroundColor:userTheme.c3}} className={`flex flex-col rounded-md w-full bg-gray-800/50 p-4 ease-linear duration-150`}>
        {/*Display Name */}
        <div className='text-gray-50 text-2xl font-semibold text-center leading-5'>
          Pavitra Behara
        </div>
        {/*User Name */}
        <div style={userTheme && {color:userTheme.c2}} className='text-gray-400 text-base text-center'>@pavitra554</div>
        {/*Description */}
        <div style={userTheme && {color:userTheme.c1}} className='text-gray-300 text-base text-center pt-2'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam
          aliquam enim itaque.
        </div>
      </div>
      {/*Social Links*/}
      <div className='flex flex-row flex-wrap justify-between mt-2'>
        <SocialLink title='Twitter' link='#' />
        <SocialLink title='Github' link='#' />
        <SocialLink title='Linkedin' link='#' />
        <SocialLink title='Instagram' link='#' />
        <SocialLink title='Youtube' link='#' />
        <SocialLink title='Gmail' link='#' />
      </div>
      {/*Other Links */}
      <div className='flex flex-col'>
        <OtherLink title="Link 1" link="#"/>
        <OtherLink title="Link 2" link="#"/>
        <OtherLink title="Link 3" link="#"/>
      </div>
    </div>
  );
};

export default Card;
