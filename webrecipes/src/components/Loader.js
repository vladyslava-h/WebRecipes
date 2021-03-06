import React from 'react';
import '../style/index-home.css';
import loading from '../style/content/Images/Icons/loader.gif';

class Loader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            render: false //Set render state to false
        }
    }

    componentDidMount() {
        setTimeout(function() { //Start the timer
            this.setState({render: true}) //After 1 second, set render to true
        }.bind(this), 500)
      }

    render() {
        let renderContainer = false;
        if(this.state.render) {
            return (
                <div id="loading">
                    <img src={loading} alt=""/>
                </div>
            )
        }
        else{
            return (<div></div>)
        }
    }
}

export default Loader;