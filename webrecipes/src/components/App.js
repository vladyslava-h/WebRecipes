import React from 'react';
import '../style/index-home.css';
import '../style/index-sidebar.css';
import Menu from './Menu';
import MainContent from './MainContent';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';

function App() {
  return (
    <div>
      <div id="logout">
        <p id="logoutBtn">Log Out</p>
      </div>
      <Router>
        <div class="page-container">
          <Menu />
          <MainContent />
        </div>
      </Router>
    </div>
  );
}

export default App;
