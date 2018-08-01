import React from 'react'
import { Rating } from 'semantic-ui-react'

class StarRating extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            rating: this.props.rating
        }
    }
    render(){
        
        return(

        <Rating rating={this.state.rating} maxRating={5} disabled />
        
        )    
    }    
}

export default StarRating