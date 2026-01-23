import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import Routees from './Routees';
import { useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { AppContext } from './context/AppContext';
import Login from './components/Login';

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  // console.log(isSellerPath.pathname);
  const {showUserLogin}= useContext(AppContext);


  return (
    <div className='text-default min-h-screen text-gray-700 [bg-white]'>
 
       {isSellerPath ? null : <Navbar />}
       {showUserLogin ? <Login /> : null}
 


      <Toaster/>
      <div className= {`${isSellerPath ? "" :"px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routees/>
      </div>
     { !isSellerPath && <Footer />}
    </div>
  );
};

export default App;