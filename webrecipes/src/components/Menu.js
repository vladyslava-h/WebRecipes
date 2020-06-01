import React from 'react'
import Loader from './Loader';
import '../style/index-sidebar.css';
import { NavLink } from 'react-router-dom';

function Menu() {
    return (
        <aside>
            <div className="site-title">
                <img src={require('../style/content/Images/Icons/logo-black.png')} />
            </div>
            <NavLink className="menu-section glow-on-hover" name="create" category="createrecipe" activeClassName="menu-section-active menu-section-active-create" exact to='/create'>
                <img src={require('../style/content/Images/Icons/create.png')} id="create_icon" />
                <p>Create</p>
            </NavLink>
            <p className="menu-section-title">DISCOVER</p>
            <NavLink className="menu-section glow-on-hover" name="browse" category="recipes" activeClassName="menu-section-active menu-section-active-browse" exact to='/browse'>
                <img src={require('../style/content/Images/Icons/browse.png')} id="browse_icon" />
                <p>Browse</p>
            </NavLink>
            <NavLink className="menu-section glow-on-hover" name="home" category="recipes" activeClassName="menu-section-active menu-section-active-home" exact to='/'>
                <img src={require('../style/content/Images/Icons/home.png')} id="home_icon" />
                <p>Home</p>
            </NavLink>
            <p className="menu-section-title">LIBRARY</p>
            <NavLink className="menu-section glow-on-hover" name="subscriptions" category="subscriptions" activeClassName="menu-section-active menu-section-active-subscriptions" exact to='/subscriptions'>
                <img src={require('../style/content/Images/Icons/subscriptions.png')} id="subscriptions_icon" />
                <p>Chefs</p>
            </NavLink>
            <NavLink className="menu-section glow-on-hover" name="favourites" category="recipes" activeClassName="menu-section-active menu-section-active-favourites" exact to='/favourites'>
                <img src={require('../style/content/Images/Icons/favourites.png')} id="favourites_icon" />
                <p>Favourites</p>
            </NavLink>
            <NavLink className="menu-section glow-on-hover" name="recipes" category="recipes" activeClassName="menu-section-active menu-section-active-recipes" exact to='/recipes'>
                <img src={require('../style/content/Images/Icons/recipes.png')} id="recipes_icon" />
                <p>My Recipes</p>
            </NavLink>
            <div id="adminSection" class="d-none">
                <p className="menu-section-title">STATISTIC</p>
                <NavLink className="menu-section glow-on-hover" name="statistic" category="admin" activeClassName="menu-section-active menu-section-active-statistic" exact to='/statistic'>
                    <img src={require('../style/content/Images/Icons/statistic.png')} id="statistic_icon"/>
                    <p>Users</p>
                </NavLink>
            </div>
        </aside>
    );
}

export default Menu;