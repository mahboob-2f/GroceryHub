import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useLocation } from 'react-router';
import { useEffect } from 'react';

const Loading = () => {
    const {navigate}= useContext(AppContext);
    let {search}= useLocation();  //  this will return a string of query from url after ? all will be in a string
    const query= new URLSearchParams(search); // create a structured obj better for us to read,find etc
    const nextURL= query.get('next');  // will return next to it like will return url_next fromt this next=url_next .

    useEffect(()=>{
        setTimeout(()=>{
            navigate(`/${nextURL}`);
        },4000)
    },[nextURL])

  return (
    <div className="flex items-center justify-center min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[33vh]">
      <div className="spinner w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"></div>
    </div>
  );
};

export default Loading;

