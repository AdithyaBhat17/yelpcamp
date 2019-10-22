import React from 'react';
import Campgrounds from './Campgrounds'
import { useFetch } from '../hooks/useFetch';

const App: React.FC = () => {

  const [campgrounds, loading] = useFetch('http://localhost:8080/campgrounds')
  console.log(campgrounds, loading)

  return (
    <div className="App">
      <div className="unsplash_background">
        <h1 className="welcome-h1">
          Welcome to Yelpcamp!
        </h1>
        <input className="form-control search" type="text" placeholder="Search campgrounds..."/>
        {/* {loading ? 'loading...' : <Campgrounds campgrounds={campgrounds}/>} */}
      </div>
    </div>
  );
}

export default App;
