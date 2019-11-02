import React from 'react';
import Campgrounds from './Campgrounds'
import { Link } from 'react-router-dom';

interface State {
  search: string
}

const App: React.FC<State> = () => {

  const [search, setSearch] = React.useState('')

  const handleInputChange = (search: string) => {
    setSearch(search.toLowerCase())
  }

  return (
    <div className="App">
      <div className="unsplash_background">
        <h1 className="welcome-h1">
          Welcome to Yelpcamp!
        </h1>
        <input
         className="form-control search" 
         type="text" 
         placeholder="Search campgrounds..."
         onChange={(event) => handleInputChange(event.target.value)}
        />
      </div>
      <Campgrounds search={search}/>
      <button className="add-btn-widget">
        <Link to="/add"><i className="fas fa-plus"></i></Link>
      </button>
    </div>
  );
}

export default App;
