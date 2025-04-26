import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Auth from './component/Auth';
import AdminDashboard from './component/Admin/AdminDashboard';
import AddBook from './component/Admin/AddBook';
import BookInfo from './component/Admin/BookInfo';
import UserDashboard from './component/User/UserDashboard';
import Home from './component/User/Home';
import Liked from './component/User/Liked';
import Purchased from './component/User/Purchased';
import Profile from './component/User/Profile';
import Following from './component/User/Following';
import Notification from './component/User/Notification';
import Wishlist from './component/User/Wishlist';
import ShowDetails from './component/User/ShowDetails';
import ShowUser from './component/User/ShowUser';
import AddEventBooks from './component/CEO/AddEventBooks';
import Event from './component/User/Event';
import EventInfo from './component/CEO/EventInfo';
import UpdateEvent from './component/CEO/UpdateEvent';
import Advatise from './component/User/Advatise';
import AdLaunch from './component/Admin/AdLaunch';
import Myads from './component/Admin/Myads';
import UpdateBook from './component/Admin/UpdateBook';
import Payment from './component/CEO/Payment';
import BookViewer from './component/User/BookViewer';
import CommonPage from './component/User/CommonPAge';
import Withdraw from './component/Admin/Withdraw';
import CeoDashborad from './component/CEO/CeoDashborad';


const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <CommonPage/>,
  },

  {path:'/login',element:<Auth/>},

  {path:'/ceo',element:<CeoDashborad/>,children:[
    {path:'',element:<EventInfo/>},
    {path:'addevent',element:<AddEventBooks/>},
    {path:'eventinfo',element:<EventInfo/>},
    {path:'updateEvent',element:<UpdateEvent/>},
  ]},
  
  
  {
    path: "/store",
    element: <AdminDashboard/>,
    children:([
      {path:'',element:<BookInfo/>},
      {path:'sellbook',element:<AddBook/>},
      {path:'bookinfo',element:<BookInfo/>},
      {path:'updatebook',element:<UpdateBook/>},
      {path:'advatice',element:<Myads/>},
      {path:'addlaunch',element:<AdLaunch/>},
      {path:'payment',element:<Payment/>},
      {path:'withdraw',element:<Withdraw/>},

    

    ])
  },



  {
    path:'/dashboard',
    element:<UserDashboard/>,
    children:([
      {path:'',element:<Home/>},
      {path:'book-viewer',element:<BookViewer/>},
      {path:'liked',element:<Liked/>},
      {path:'purchased',element:<Purchased/>},
      {path:'profile',element:<Profile/>},
      {path:'notifi',element:<Notification/>},
      {path:':opt',element:<Following/>},
      {path:'wishlist',element:<Wishlist/>},
      {path:'showAd/:bid',element:<Advatise/>},
      {path:'showbook/:bid',element:<ShowDetails/>},
      {path:'showuser/:uid',element:<ShowUser/>},
      {path:'event',element:<Event/>},
      {path:'payment',element:<Payment/>}
    ])
  }

]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
