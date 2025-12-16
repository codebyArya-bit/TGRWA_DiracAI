
import PreAppSecond from './PreAppSecond';
import AdminDashboard from './Admin1/Dashboard';
import { Route, Switch } from 'react-router-dom';


//import Register from './CommonApps/Register';
import Website from './WebSite/Website';

import ViewAllRegistrants from './WebSite/OnlineRegistration/ViewAllRegistrants';



const PreAppFirst = () => {



  return (<div>


    <Switch>
      <Route path='/admin1/dashboard'>
        <AdminDashboard />
      </Route>



      <Route exact path='/tgrwamembers123' >

        <ViewAllRegistrants />
      </Route>
      {/*
  
  <Route path='/createaccount/' element={<Register/>} />

   <Route exact path='/tgrwamembers123'>
     <ViewAllRegistrants />	
   </Route>		
   <Route path='/'>
      <Website/>	
   </Route>	
   <Route path='/app/'>
      <PreAppSecond/>
   </Route>   
   <Route path='/' element={<Website />}/>
   <Route path='/news' element = {<div> news page </div>}/>
    

   <Route path='/' element ={<Website/>} >
   </Route>
  */}

      <Route path='/app/'>
        <PreAppSecond />
      </Route>

      <Route path="/" >
        <Website />
      </Route>


    </Switch>



  </div>
  );
}

export default PreAppFirst;
