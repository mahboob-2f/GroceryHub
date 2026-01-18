import React, { use, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router';

const MainBanner = () => {
    return (
        <div className="mt-10 relative w-full">
            <img src={assets.main_banner_bg} alt="banner image" 
                className="w-full hidden md:block  " loading="lazy" />
            <img src={assets.main_banner_bg_sm} alt="banner image small screnn" 
                className={`w-full md:hidden`} />

            <div className="absolute inset-0 flex flex-col justify-center items-center px-4 md:top-10 md:left-5
                md:items-start md:justify-start md:w-1/2 md:px-0 translate-8">
                <div className="pb-4 lg:mt-12 text-center md:text-left  ">
                    <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold w-3/5">
                        Freshness You Can Trust, Savings You Will Love!
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4  ">
                    <Link to="/products" 
                        className="flex items-center bg-primary hover:bg-primary-dull px-4 py-3 rounded-md text-white">
                        Shop now
                        <img src={assets.white_arrow_icon} alt="arrow" loading="lazy" className="ml-2" />
                    </Link>

                    <Link to="/products" 
                        className="flex items-center px-3 py-3 rounded-md text-black text-lg">
                        Explore deals
                        <img src={assets.black_arrow_icon} alt="arrow" loading="lazy" 
                            className="pl-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MainBanner;
