import React from 'react'
import './filter.css'

class Filter extends React.Component {    
    handleForm = (e) => {
        const value = e.target.value;
        this.props.handleInput({filter: value});
    }
    
    render(){
          return(
              
            <form>
               <div className="radio-group">
               <input type="radio" name="stars" value="0" onChange={this.handleForm}/><label>0</label>
               <input type="radio" name="stars" value="1" onChange={this.handleForm}/><label>1</label>
               <input type="radio" name="stars" value="2" onChange={this.handleForm}/><label>2</label>
               <input type="radio" name="stars" value="3" onChange={this.handleForm}/><label>3</label>
               <input type="radio" name="stars" value="4" onChange={this.handleForm}/><label>4</label>
               <input type="radio" name="stars" value="5" onChange={this.handleForm}/><label>5</label> 
               </div>
              <label className="title" style={{fontFamily: "'Special Elite', cursive"}}>Minimum star rating</label>
            </form>
          );                                           
    }
}

export default Filter