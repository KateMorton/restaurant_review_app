import React, { Component } from 'react'
import './App.css'
import Content from './components/content'
import restaurants from './components/restaurants.json'

class App extends Component {
  constructor(){
      super();
      this.state = {
          restaurants,
      }
   }

  render() {
    return (
      <div className="App" style={{height: "100%"}} >
        <header className="App-header">
          <h1 className="App-title">RestaurantReview<span>Local</span></h1>
        </header>
        <Content restaurant={this.state.restaurants} />        
        </div>
    );
  }
}

export default App;
