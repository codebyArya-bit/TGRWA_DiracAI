import { useState } from 'react';
import classes from "./Website.module.css";
import { Route, Switch, useHistory } from "react-router-dom";
import Header from "./Header";
import HeaderAddressBar from './HeaderAddressBar';
import Footer from "./Footer";
import Home from "./Home/Home";
import About from "./About/About";
import News from "./News/News";
import Gallery from "./Gallery/Gallery";
import ContactUs from "./Contactus/ContactUs";


import Notices from "./ClientPage1/Notices";
import RulesAndRegulations from "./ClientPage1/MemberRegistration";

import Blogs from "./ClientPage1/Blogs/BlogAndNewsBlock";

import Projects from "./ClientPage1/Projects/Projects";
import Booking from "./ClientPage1/Booking";
import SaleDeed from "./ClientPage1/SaleDeed";
import Possession from "./ClientPage1/Posession";
import Association from "./ClientPage1/Association";
import Maintenance from "./ClientPage1/Maintenance";
import Products from "./Products/Products";


const Website = () => {
  const registerHandler = () => {
    window.open("createaccount", "_blank");
  };

  const loginHandler = () => {
    window.open("app/dashboard/general/exams", "_blank");
  };

  const history = useHistory();

  //const [showHome, setShowHome] = useState(true);
  //const [showAbout, setShowAbout] = useState(false);
  //const [showNews, setShowNews] = useState(false);
  // const [showHomeBuyer, setShowHomeBuyer] = useState(false);
  // const [showContactUs, setShowContactUs] = useState(false);



  const [homeMounted, setHomeMounted] = useState(false);
  const [aboutMounted, setAboutMounted] = useState(false);
  const [newsMounted, setNewsMounted] = useState(false);
  const [homeBuyerMounted, setHomeBuyerMounted] = useState(false);
  const [contactUsMounted, setContactUsMounted] = useState(false);
  const [galleryMounted, setGalleryMounted] = useState(false);

  const [noticesMounted, setNoticesMounted] = useState(false);
  const [rulesAndRegulationsMounted, setRulesAndRegulationsMounted] = useState(false);
  const [blogsMounted, setBlogsMounted] = useState(false);
  const [projectsMounted, setProjectsMounted] = useState(false);
  const [bookingMounted, setBookingMounted] = useState(false);
  const [saleDeedMounted, setSaleDeedMounted] = useState(false);
  const [possessionMounted, setPossessionMounted] = useState(false);
  const [associationMounted, setAssociationMounted] = useState(false);
  const [maintenanceMounted, setMaintenanceMounted] = useState(false);
  const [productsMounted, setProductsMounted] = useState(false);





  const homeBuyerNoticeMountHandler = () => {
    setHomeBuyerMounted(true);
    setNoticesMounted(true);
  }



  const homeHandler = () => {
    history.push('/');

  }

  const aboutHandler = () => {
    history.push('/about');
  }

  const newsHandler = () => {
    history.push('/news');
  }

  const homeBuyerHandler = () => {

  }

  const contactUsHandler = () => {
    history.push('/contactus');
  }

  const productsHandler = () => {
    history.push('/products');
  }

  const galleryHandler = () => {
    history.push('/gallery');
  }


  const noticesHandler = () => {

    history.push('/homebuyer/notices');

  }


  const isAnyVariableTrue = (...variables) => {
    return variables.some((variable) => !!variable);
  }




  //console.log("notice mounted: ", noticesMounted);



  return (
    <div className={classes.website}>


      <HeaderAddressBar />


      <div className={classes.innerDiv}>
        <Header homeHandler={homeHandler}
          homeMounted={homeMounted}
          aboutHandler={aboutHandler}
          aboutMounted={aboutMounted}
          newsHandler={newsHandler}
          newsMounted={newsMounted}
          homeBuyerHandler={homeBuyerHandler}
          homeBuyerMounted={isAnyVariableTrue(noticesMounted, rulesAndRegulationsMounted, blogsMounted, projectsMounted, bookingMounted, saleDeedMounted, possessionMounted, associationMounted, maintenanceMounted)}
          noticesMounted={noticesMounted}
          contactUsHandler={contactUsHandler}
          contactUsMounted={contactUsMounted}
          galleryHandler={galleryHandler}
          galleryMounted={galleryMounted}

        />

      </div>

      <Route exact path='/' >

        <Home passMountInfo={setHomeMounted} />

      </Route>


      <div className={classes.innerDiv}>


        <Switch>
          <Route exact path='/about' >
            <About passMountInfo={setAboutMounted} />
          </Route>




          <Route exact path='/news' >
            <News passMountInfo={setNewsMounted} />
          </Route>



          <Route exact path='/contactus' >
            <ContactUs passMountInfo={setContactUsMounted} />
          </Route>


          <Route exact path='/resident/notices' >
            <Notices passMountInfo={setNoticesMounted} />
          </Route>


          <Route exact path='/resident/memberregistration' >
            <RulesAndRegulations passMountInfo={setRulesAndRegulationsMounted} />
          </Route>






          <Route exact path='/resident/blogs' >
            <Blogs passMountInfo={setBlogsMounted} />
          </Route>




          <Route exact path='/resident/lifecycle/projects' >
            <Projects passMountInfo={setProjectsMounted} />
          </Route>

          <Route exact path='/resident/health/doctors' >
            <Booking passMountInfo={setBookingMounted} />
          </Route>


          <Route exact path='/resident/health/blooddonors' >
            <Booking passMountInfo={setBookingMounted} />
          </Route>


          <Route exact path='/resident/lifecycle/saledeed' >
            <SaleDeed passMountInfo={setSaleDeedMounted} />
          </Route>

          <Route exact path='/resident/lifecycle/possession' >
            <Possession passMountInfo={setPossessionMounted} />
          </Route>

          <Route exact path='/resident/lifecycle/association' >
            <Association passMountInfo={setAssociationMounted} />
          </Route>

          <Route exact path='/resident/lifecycle/maintenance' >
            <Maintenance passMountInfo={setMaintenanceMounted} />
          </Route>


          <Route exact path='/products' >
            <Products passMountInfo={setProductsMounted} />
          </Route>

          <Route exact path='/projects' >
            <Projects passMountInfo={setProjectsMounted} />
          </Route>

          <Route exact path='/gallery' >
            <Gallery passMountInfo={setGalleryMounted} />
          </Route>

        </Switch>

      </div>


      <Footer />


    </div>
  );
};

export default Website;
