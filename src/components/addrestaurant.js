import React from 'react'
import './restaurants.css'

let formStyle = {
    fontFamily: "'News Cycle', sans-serif",
    marginTop: "10px", 
    marginBottom: "30px", 
    borderBottom: "0"
}

let textStyle = {
    ...formStyle,
    textAlign: "left",
    fontSize: ".75rem",
    paddingLeft: "20px", 
    marginBottom: "10px"   
}

let inputStyle = {
    fontSize:  "1rem",
    width: "300px",
    height: "30px",
    marginBottom: "10px" ,
    padding: "0",
    border: "0",
    borderBottom: "1px solid #6888a1",
    backgroundColor: "white",
    outline: "none"
}

let buttonStyle = {
    display: "block",
    borderWidth: "0",
    float: "right",
    fontFamily: "'Special Elite', cursive",
    color: "#f1f1f1",
    backgroundColor: "#228360",
    height: "20px",
    width: "40%",
    marginRight: "30px",
    marginBottom: "10px"
}

class AddRestaurant extends React.Component {
    constructor(props){
        super(props);
        this.state={
            restaurant: {
                restaurantName: '',
                address: '',
                lat: '',
                long: '',
                ratings: []
            }      
        }
     }

   handleInput = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;        
        this.setState((prevState) => {
          prevState.restaurant[name] = value;
          return { restaurant: prevState.restaurant };
        });
    }
    
    handleInputSave = (e) => {
         e.preventDefault();
         this.props.onSave(this.state.restaurant);
         // this.props.hideForm({showForm: false});
         this.props.hideMarker({
              showForm: false, 
              newMarker: false
          });
         this.setState({
             restaurant: {
                 restaurantName: '',
                 address: '',
                 lat: '',
                 long: '',
                 ratings: []
             }              
         });
   }

   cancel = () => {
    this.props.cancelAdd({
        showForm: false,
        newMarker: false,
        visible: this.state.visible 
    })
   }

   render(){

     let showForm = this.props.form;
     
     let formDisplay = {
        display: "none"
      }

      if(showForm === true){ 
       formDisplay = {
         display: "block"
       } 
      }

        return(
             <div style={{borderBottom: "1px solid #e1e1df"}}>
                <div>
                     <h5 style={{...textStyle,
                         fontFamily: "'Special Elite', cursive",
                         fontSize: "1rem", 
                         marginBottom: "10px"}}>Click on Map to Add New Restaurant Marker
                     </h5>                    
                 </div>    
                 <form style={{...formStyle, ...formDisplay}} onSubmit={this.handleInputSave}>
                    <input style={{...inputStyle}} type="text" name="restaurantName" placeholder=" name" 
                    onChange={this.handleInput} value={this.state.restaurant.restaurantName} required/><br/>
                    <input style={{...inputStyle}} type="text" name="address" placeholder=" address" 
                    onChange={this.handleInput} value={this.state.restaurant.address} required/><br/>
                    <button type="button" style={{...buttonStyle, float: "left", marginLeft: "30px", marginRight: "5px"}} onClick={this.cancel}>cancel</button>
                    <input type="submit" style={{...buttonStyle}} />
                </form>
             </div>
         )                                            
    }
}


export default AddRestaurant