import React from 'react'
import './restaurants.css'

let formStyle = {
    fontFamily: "'News Cycle', sans-serif",
    textAlign: "left",
    fontSize:  "1rem",
    width: "250px",
    marginBottom: "10px",
    padding: "0",
    border: "0",
    transition: "color 500ms ease-out"    
}

let inputStyle = {
    ...formStyle,
    fontFamily: "'News Cycle', sans-serif",
    borderBottom: "1px solid #6888a1",
    outline: "none"
}

let buttonStyle = {
    borderWidth: "0",
    float: "right",
    fontFamily: "'Special Elite', cursive",
    color: "#f1f1f1",
    backgroundColor: "#228360",
    height: "20px",
    width: "60px",
    marginRight: "50px"
}

const RESET_VALUES = {stars: '', comment: ' comment'};

class AddReview extends React.Component {
    constructor(props){
        super(props);
        this.state={
            style: {
                display: "none"
            },
            rating: Object.assign({}, RESET_VALUES)            
        }
    }
    
    onAddReviewClick = () => {
        this.setState({
            style: {
                display: this.state.style.display === "none" ? "block" : "none"
            }
        })       
    }
    
    handleChange = (e) => {
        const target = e.target;
        let value;
        target.name === "stars" ? (value = Number(target.value)) : (value = target.value);
        const name = target.name;
        
        this.setState((prevState) => {
          prevState.rating[name] = value;
          return { rating: prevState.rating };
        });
    }

    handleSave = (e) => {
        e.preventDefault();
        this.props.onSave(this.state.rating);
        this.props.hideText({reviews: true});
        this.setState({
            style: this.state.style,    
            rating: Object.assign({}, RESET_VALUES),
        });        
    }
    
    render(){
         return(
             <div>
                 <h5 className="addReview"
                     onClick={this.onAddReviewClick}
                     style={{...formStyle,
                             paddingLeft: "20px", 
                             fontFamily: "'Special Elite', cursive", borderBottom: "0"}} >Add Review</h5>
                 <form style={{display: this.state.style.display, marginTop: "20px", marginBottom: "30px", borderBottom:"0"}} 
                       onSubmit={this.handleSave}>
                    <label style={{...formStyle, marginBottom: "0", borderBottom: "0"}}>Stars: </label><br/>
                    <input style={{...inputStyle, height: "30px"}} type="text" name="stars" onChange={this.handleChange} 
                           value={this.state.rating.stars} required/><br/>
                    <textarea style={{...inputStyle}} name="comment" rows="4" onChange={this.handleChange} 
                           value={this.state.rating.comment}/><br/>
                    <input type="submit" style={{...buttonStyle}}/>
                </form>
             </div>
         )                                            
    }
}


export default AddReview