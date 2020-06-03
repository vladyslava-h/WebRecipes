import React from 'react'
import { NavLink } from 'react-router-dom';

class MealMenu extends React.Component {
    constructor(props) {
        super(props);

        this.user = props.user;
        this.meals = props.meals;
    }

    render() {
        return (
            <div id="meals">
                {
                    this.meals.map(item =>
                        <NavLink className="meal"
                            activeClassName="meal-active"
                            key={item.id}
                            exact to={`/browse/${(item.name).toLowerCase()}`}>
                            <p>{item.name}</p>
                        </NavLink>
                    )
                }
            </div>
        );
    }
}

export default MealMenu;