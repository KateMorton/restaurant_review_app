import React from 'react'
import StarRating from './starrating'
import UserRating from './userrating'
import AddReview from './addreview'
import './restaurants.css'
import uuid from 'uuid'

let defaultStyle = {
    listStyle: "none",
    textAlign: "left",
    background: "#f1f1f1",
    padding : "0",
    transition: "color 1s ease-out"
}

let fancyFont = {
    fontFamily: "'Special Elite', cursive",
}

class Restaurants extends React.Component {
    constructor(props){
        super(props);
        this.state={
            style: {
                display: "none"
            },
            item: this.props.item,
            reviews: true
        }
    }

    //Reveals restaurant reviews and triggers google places details api
    onReviewClick = () => {
       this.setState({
            style: {
                display: this.state.style.display === "none" ? "block" : "none"
            }
        })

        //bring in reviews from google places details api
        if(this.state.item.id != null){
            this.setState((prevState) => {
                            let item = prevState.item;
                            item.ratings.shift();
                            return{item};                                
                        })
            let id = this.state.item.id;
            fetch("https://cors.io/?https://maps.googleapis.com/maps/api/place/details/json?placeid=" + id 
                         + "&fields=reviews&key=AIzaSyC5XhGNOZ-bMb3yiHQLH265VmUaDbirxsA")
                 .then(res => res.json())
                 .then(
                   (res) => {
                    try {
                      res.result.reviews.forEach(item => {
                        let review = {
                          stars: item.rating,
                          comment: item.text,
                          author_name: item.author_name
                        };

                        this.setState((prevState) => {
                              let item = prevState.item;
                              let dup = false;
                                item.ratings.forEach(entry => {
                                      if(entry.comment === review.comment){
                                          dup = true;
                                      }
                                })
                                  if(!dup){
                                          item.ratings.push(review);
                                  }
                              return{item}                                
                          })                                                                   
                      });
                    } catch (error) {
                      this.setState({
                        reviews: false
                      });
                    }             
                      
                })                    
        }       
    }
    
    //updates listing state with new user review    
    saveRating = (review) => {
           this.setState((prevState) => {
           let listing = prevState.item;
           listing.ratings.push(review);
           return{listing}});         
    }  

    //displays or hides text alerting user of no reviews available
    reviewText = display => this.setState(display);  
    
    render(){
        let listStyle = {
            display: "block"
        }
        
        //updates display value to "none" if average rating less than filter value
        if(this.props.average < this.props.filter){
            listStyle = {
                display: "none"
            }
        }

        //displays text if restaurant has no reviews
        let noReviews = {
            display: "none"
        }

        if(this.state.reviews === false){
          noReviews = {
            display: "block"
          }
        }
           
        //Streetview api for listing image
        let lat = this.state.item.lat;
        let long = this.state.item.long;
        let streetView = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + lat + 
        "," + long + "&fov=90&heading=235&pitch=10&key=AIzaSyBhfuJwofJL6RBl-zxUc7vcVrgFiwpbyHw"

        //display customer reviews
        let review = this.state.item.ratings;
        let reviews = [];
        let j = 0;
        while(j < review.length){
            let rating = review[j].stars;
            let comment = review[j].comment;
            let restReviews = 
                <div style={{...defaultStyle, 
                            display: this.state.style.display, 
                            paddingLeft: "20px", 
                            paddingBottom: "20px"}} 
                            key={uuid.v4()}>
                    <UserRating rating={rating} />
                    <p>{comment}</p>                                      
                 </div>
            reviews.push(restReviews);
            j++;
        };

    return(<li style={{...defaultStyle,
               ...listStyle,
               textAlign: "center", 
               borderBottom:"2px solid #228360", 
               paddingTop: "30px"}}>
                <h3 
                   style={{...fancyFont, 
                           fontSize: "1.5rem",
                           color: "#cb2029"}}>
                   {this.state.item.restaurantName}
                </h3>
                <h4 
                   style={{marginTop: "10px", fontSize: "1rem"}}>
                   {this.state.item.address}
                </h4>
                <StarRating rating={this.props.average} />
                <div>
                    <img src={streetView} 
                         style={{width: "100%", 
                                 height: "250px",
                                 padding: "0px 10px",
                                 backgroundColor: "#e1e1df"
                                 }}
                          alt={this.props.item.restaurantName}/>
                    <h4 className="review" 
                        onClick={this.onReviewClick} 
                        style={{...defaultStyle,
                                ...fancyFont,
                                paddingLeft: "20px", 
                                }} >
                        User Reviews
                   </h4>
                    {reviews}
                    <p style={{...defaultStyle, ...noReviews, paddingLeft: "20px"}}>No user reviews added</p> 
                    <AddReview onSave={this.saveRating} hideText={this.reviewText}/>
                </div>
           </li>)                                                                                    
    }
}

export default Restaurants