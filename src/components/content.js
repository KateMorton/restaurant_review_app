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
              coords: {
                  lat: "",
                  long: ""
              },
              filter: 0,              
              showForm: false, //determines restaurant form visibility
              newMarker: false, //determines temp marker visibility
              restaurantTitle: ''
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

  //displays restaurant in sidebar on marker click
  showRestaurant = title => {
    this.setState({
      restaurantTitle: ''
    });
    this.setState({
      restaurantTitle: title,
      visible: true });    
  };

  // closes individual restaurant listing
  closeRest = display => this.setState(display);

  //filter function for display individual listing
  restFilter(item) {
      return item.restaurantName === this.state.restaurantTitle;   
  }
  
  
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

    //filters restaurants based on latitude and longitdue
    let displayRestaurants = this.state.restaurants.filter(item => (item.long > this.state.bounds.west && 
            item.long < this.state.bounds.east) && (item.lat < this.state.bounds.north && item.lat > this.state.bounds.south));

    // filters restaurants dependent on if a marker has been clicked or not
    let filteredRestaurants;

    if(this.state.restaurantTitle !== '') {
        filteredRestaurants =  displayRestaurants.filter(item => this.restFilter(item))
    } else if(this.state.restaurantTitle === '') {
       filteredRestaurants = displayRestaurants;
    }

    //maps thought filtered list and creates a Restaurants component for each restaurant
    let filterList = filteredRestaurants.map(item => {
          let rating = item.ratings;
          let stars = 0;
          rating.forEach(rate => {
            stars = stars + rate.stars;
          })  
          let averageRating = Math.round(stars / rating.length); 

          if(isNaN(averageRating)){
            averageRating = 0;
          }          
                     
          return <Restaurants key={uuid.v4()} 
                              item={item} 
                              average={averageRating} 
                              filter={this.state.filter} 
                              close={this.closeRest}
                              title={this.state.restaurantTitle}/>;                
    })

    const { visible } = this.state
    
    return (
      <div>
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
                {filterList}                            
              </ul>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic style={{padding : "0px", marginTop: "105px", height: "600px"}}>
              <div style={{height: "100%"}}> 
                <Embed active={true} placeholder=''>
                    <GoogleMaps restaurants={this.state.restaurants}
                                addMarker={this.state.newMarker}
                                showMarker={this.toggleMarker}
                                newBounds={this.updateBounds}
                                addRest={this.userRest} 
                                listingCoords={this.restCoords}
                                addRestaurants={this.googlePlaces}
                                openRestaurant={this.showRestaurant}
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