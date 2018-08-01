import React from 'react'
import { Embed, Sidebar, Segment, Button, Menu } from 'semantic-ui-react'
import uuid from 'uuid'
import GoogleMaps from './googlemaps'
import Restaurants from './restaurants'
import Filter from './filter'
import AddRestaurant from './addrestaurant'
import './content.css'


class Content extends React.Component {
    constructor(props){
        super(props);
        this.state = {
              restaurants: this.props.restaurant,
              bounds: {},
              zoom: 14,
              coords: {
                  lat: "",
                  long: ""
              },
              filter: 0,              
              showForm: false, //determines restaurant form visibility
              newMarker: false //determines temp marker visibility
            }    
    }

  state = { visible: false }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  //updates viewport bounds 
  updateBounds = bounds => this.setState(bounds);
  
  //updates states filter rating value provided by user
  handleFilter = filterInput => this.setState(filterInput);

  //updates state with new restaurant coordinates from google maps click event
  restCoords = coords => this.setState(coords);

  //hides new restaurant temp marker when new restaurant added
  toggleMarker = display => this.setState(display);

  //hides new marker and sidebar
  cancel = display => this.setState(display);
  
  
  //adds new restaurant details provided by user to state 
  newRest = (restaurant) => {
      restaurant["lat"] = Number(this.state.coords.lat);
      restaurant["long"] = Number(this.state.coords.long);
      this.setState((prevState) => {
           let restaurants = prevState.restaurants;
           restaurants.push(restaurant);
           return{restaurants}});
  }

    
  //add results from google places api to state.
  googlePlaces = (places) => {
      let results = places.results;
      let placesRestaurants = results.map(place => {
        let id = place.place_id;
        let googleListing =  {
            restaurantName: place.name,
            address: place.vicinity,
            lat: place.geometry.location.lat,
            long: place.geometry.location.lng,
              ratings : [{
              comment: "",
              stars: place.rating
            }],
             id: id //use this to retrieve details from google places details api
        }
        return(googleListing);        
      });
      
     this.setState((prevState) => {
        let dup = false;
        let restaurants = prevState.restaurants;
        placesRestaurants.forEach(item => {  
          restaurants.forEach(rest => {
            if(item.restaurantName === rest.restaurantName){
              dup = true;
            }
          })
          if(!dup){
            restaurants.push(item);
          }
        })
      return{restaurants}
     });
    }

  render() { 

    //filters restaurants based on latitude, longitude
    let displayRestaurants = this.state.restaurants.filter(item => (item.long > this.state.bounds.west && 
            item.long < this.state.bounds.east) && (item.lat < this.state.bounds.north && item.lat > this.state.bounds.south));

    //maps thought filtered list and creates a Restaurants component for each restaurant
    let restaurantList = displayRestaurants.map(item => {
          let rating = item.ratings;
          let stars = 0;
          rating.forEach(rate => {
            stars = stars + rate.stars;
          })  
          let averageRating = Math.round(stars / rating.length); 

          if(isNaN(averageRating)){
            averageRating = 0;
          }
        return <Restaurants key={uuid.v4()} item={item} average={averageRating} filter={this.state.filter}/>;
    })

    const { visible } = this.state
    
    return (
      <div style={{height: "100%"}}>
        <div className="button">
          <Button onClick={this.toggleVisibility}>List Restaurants</Button>
        </div>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='push'
            width='wide'
            direction='right'
            visible={visible}
            icon='labeled'
            vertical
            inverted
            >
              <Filter handleInput={this.handleFilter}/>
              <AddRestaurant coordinates={this.state.coords} 
                             onSave={this.newRest}
                             form={this.state.showForm}
                             hideMarker={this.toggleMarker}
                             cancelAdd={this.cancel}
                             />
              <ul style={{padding: "0px", margin: "0px"}}>              
                {restaurantList}              
              </ul>
          </Sidebar>
          <Sidebar.Pusher style={{height: "100%"}}>
            <Segment basic style={{padding : "0px", marginTop: "105px", height: "100%"}}>
              <div style={{height: "100%"}}> 
                <Embed active={true} placeholder='' style={{height: "100%"}}>
                    <GoogleMaps restaurants={this.state.restaurants}
                                addMarker={this.state.newMarker}
                                showMarker={this.toggleMarker}
                                newBounds={this.updateBounds}
                                addRest={this.userRest} 
                                listingCoords={this.restCoords}
                                zoom={this.mapZoom}
                                addRestaurants={this.googlePlaces}
                                />
                </Embed>
              </div>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>        
      </div>
    )
  }
}

export default Content;