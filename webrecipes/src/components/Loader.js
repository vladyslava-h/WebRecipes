import React from 'react';
import '../style/index-home.css';
import loading from '../style/content/Images/Icons/loader.gif';

function Loader() {
    return (
        <div id="loading">
           <img src={loading} alt=""/>
        </div>
    )
}

export default Loader;