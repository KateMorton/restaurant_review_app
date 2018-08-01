import React from 'react'
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react'
import uuid from 'uuid'
import RestIcon from './images/rest_icon.png'
import UserIcon from './images/user_icon.png'
import NewIcon from './images/new_icon.png'

export class GoogleMaps extends React.Component {
    constructor(props){
        super(props);
        this.state = {
              user: {
                  lat: 55.4958508,
                  long: -3.8902352,
                  title: "You are here!"
              },
              center:{
                  lat: 55.4958508,
                  long: -3.8902352
              },
              markerCoords: {
                  lat: "",
                  long: ""
              }
        }        
    }

    componentWillMount(){
       //get user position
       if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.mapMarkerData);
       } else {
           //if no geolocation use reverse lookup api
           fetch("http://api.ipstack.com/check?access_key=6a52e73f25cba88e5d9b0db8d8f0d520")
            .then(res => res.json())
            .then(
              (res) => {
                this.setState({
                     user: {
                        lat: res.latitude,
                        long: res.longitude,
                        title: "You are here!"
                     }
                });
              }
           );             
       }
    }

    //sets and retrieves data needed to place intial map markers based on geolocation and google places api
    mapMarkerData = (position) => {
        this.setState({
            user: {
              lat: position.coords.latitude,
              long: position.coords.longitude,
              title: "You are here!"
            },
            center: {
              lat: position.coords.latitude,
              long: position.coords.longitude,
            }
        }); 

        //retrieves places data from google places api using center location
        let latitude = this.state.center.lat;
        let longitude = this.state.center.long;
        let places = "https://cors.io/?https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" 
        + latitude + "," + longitude + "&radius=800&type=restaurant&key=AIzaSyC5XhGNOZ-bMb3yiHQLH265VmUaDbirxsA";         
         fetch(places)
           .then(res => res.json())
           .then(
             (res) => {
                this.props.addRestaurants(res);//updates resturants list in content component           
             }           
           ); 
    } 
    
    //Updates bounds of viewport and retrieves new center coords
    centerMoved = (mapProps, map) => {
        let bounds = JSON.stringify(map.getBounds()); 
        let center = JSON.stringify(map.getCenter());
        this.props.newBounds({bounds : JSON.parse(bounds)});//updates bounds state in content component
        this.setState({
            center: JSON.parse(center),            
        });

        //retrieves places data from google places api using center location
         let latitude = this.state.center.lat;
         let longitude = this.state.center.lng;
         let places = "https://cors.io/?https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" 
         + latitude + "," + longitude + "&radius=800&type=restaurant&key=AIzaSyC5XhGNOZ-bMb3yiHQLH265VmUaDbirxsA";
         fetch(places)
           .then(res => res.json())
           .then(
             (res) => {
               this.props.addRestaurants(res);//updates resturants list in content component
             }
           );
    } 
    
    //Retrieves coords of clicked point on map on click   
    getCoords = (mapProps, map, e) => {
        let lat = JSON.stringify(e.latLng.lat());
        let long = JSON.stringify(e.latLng.lng());        
        this.props.listingCoords({coords: {lat : lat, long: long}});//updates coords state in content component
        //updates coordinates to be used for marker indicating a new restaurant to be added
        if(this.props.addMarker === false){
          this.setState({
            markerCoords: {
                lat: lat,
                long: long
              },
            })
          //updates state in content component in order to display related elements when new marker added
          this.props.showMarker({
              showForm: true, 
              newMarker: true,
              visible: !this.state.visible 
          });
      }
    }
    
   render() {
     
     //map style
     const style = {
        width: '100%',
        height: '100%'
     }
     
     //set map center
     let center = {lat: this.state.center.lat, lng: this.state.center.long};
     
     //generate map restaurant markers
     let markers;
     if(this.props.restaurants){
       markers = this.props.restaurants.map(marker => {        
        return(<Marker 
                key={uuid.v4()}
                position={{lat: marker.lat, lng: marker.long}}
                title={marker.restaurantName}
                icon={RestIcon}
                />);
      });
    } 

    //generate user marker
    let userMarker = <Marker 
                        key={uuid.v4()}
                        position={{lat: this.state.user.lat, lng: this.state.user.long}}
                        title={this.state.user.title}
                        icon={UserIcon}
                        animation={this.props.google.maps.Animation.BOUNCE}/>;

    //adds marker to map when user adds new restaurant
    let showMarker = this.props.addMarker;
    let newMarker; 
    if(showMarker === true){      
      newMarker = <Marker 
                     key={uuid.v4()}
                     position={{lat: this.state.markerCoords.lat, lng: this.state.markerCoords.long}}
                     icon={NewIcon}
                     title="add new restaurant here"
                     />;        
   }
   else {
      newMarker = "";
   }

    return (
      <Map 
        google={this.props.google} 
        zoom={14}
        maxZoom={19}
        minZoom={12}
        style={style}
        center={center}
        onDragend = {this.centerMoved}
        onClick = {this.getCoords}
        styles = {[
                    {
                      "featureType": "administrative",
                      "elementType": "labels",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "landscape",
                      "elementType": "labels",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "landscape.natural",
                      "elementType": "geometry.fill",
                      "stylers": [
                        {
                          "color": "#68b587"
                        }
                      ]
                    },
                    {
                      "featureType": "poi",
                      "elementType": "labels",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "poi.park",
                      "elementType": "geometry.fill",
                      "stylers": [
                        {
                          "color": "#68b587"
                        }
                      ]
                    },
                    {
                      "featureType": "poi.sports_complex",
                      "elementType": "geometry.fill",
                      "stylers": [
                        {
                          "color": "#b0ad24"
                        }
                      ]
                    },
                    {
                      "featureType": "road",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        {
                          "color": "#221f00"
                        }
                      ]
                    },
                    {
                      "featureType": "road.highway",
                      "elementType": "geometry.fill",
                      "stylers": [
                        {
                          "color": "#b0ad24"
                        }
                      ]
                    },
                    {
                      "featureType": "road.highway",
                      "elementType": "labels",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "road.highway.controlled_access",
                      "elementType": "labels",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "transit",
                      "elementType": "labels",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "water",
                      "elementType": "geometry.fill",
                      "stylers": [
                        {
                          "color": "#787ad6"
                        }
                      ]
                    }
                  ]}
        >
          {userMarker}
          {markers} 
          {newMarker}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBhfuJwofJL6RBl-zxUc7vcVrgFiwpbyHw',
})(GoogleMaps)