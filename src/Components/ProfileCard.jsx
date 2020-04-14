import React, { Component, useState } from 'react';
import { Button } from 'react-bootstrap';
import '../Css/ProfileCard.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Card, CardBody, CardText, CardImg, CardTitle, CardLink, ListGroupItem, ListGroup } from 'shards-react';
import StarRatings from 'react-star-ratings';
import pic from '../Img/Default-welcomer.png';
import ImageUploader from 'react-images-upload';
import FileUpload from '../Components/fileUpload';
class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.GuideDetails,
            languages: this.props.languages,
            areas: this.props.areas,
            sum: 0,
            rating: this.props.GuideDetails.Rank,
            pictures: [],
            hobbies:this.props.guideListHobbies,
            expertise:this.props.GuideExpertises
        }
        this.onDrop = this.onDrop.bind(this);
        let local = false;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }
    onDrop(picture) {
        let newPic = "";
        for (let index = 0; index < picture.length; index++) {
            const element = picture[index];
            newPic = element;
        }
        console.log(newPic);
        this.UploadPicture(newPic);
        this.setState({
            pictures: newPic,
        });
        console.log(this.state.pictures)
    }
    UploadPicture = (pic) => {
        const data= new FormData();
        data.append("UploadedFile",pic);
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + '/Guide/PostPic', {
            method: 'POST',
            contentType: false,
            processData: false,
            body: data,
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    componentDidMount() {
        console.log(this.props.GuideLinks)
        console.log(this.props.GuideDetails);

        const areas = JSON.parse(localStorage.getItem('areas'));
        const languages = JSON.parse(localStorage.getItem('languages'));
        const links = JSON.parse(localStorage.getItem('links'));
        console.log(links)

        if (this.state.areas.length === 0) {
            this.setState({
                areas: areas
            })
        }
        if (this.state.languages.length === 0) {
            this.setState({
                languages: languages
            })
        }
        let tempSum = 10;
        let userBirth = this.state.user.BirthDay;
        let userPhone = this.state.user.Phone;
        let userDescription = this.state.user.DescriptionGuide
        let userPicture = this.state.user.ProfilePic;
        let userAreas = this.state.areas;
        let userLanguages = this.state.languages;
        if (userBirth !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userPhone !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userDescription !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userPicture !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if(this.state.hobbies.length>0)
        {
            tempSum = parseInt(tempSum) + 10;
        }
        if(this.state.expertise.length>0)
        {
            tempSum = parseInt(tempSum) + 10;
        }



        this.setState({
            sum: tempSum
        })
    }

    picExsist = () => {
        if (this.state.user.ProfilePic !== "") {
            return <CardImg variant="top" src={this.state.user.ProfilePic} style={{ height: '50', width: '50' }} />
        }
        else {
            return <CardImg variant="top" src={pic} style={{ height: '50', width: '50' }} />
        }
    }


    funcPic = () => {
        return <div className="imageClass">
            {this.picExsist()}
            <span className="uploadPicIcon">
                <i class="far fa-image"></i>
            </span>

        </div>
    }

    funcName = () => {
        return <h2>{this.state.user.FirstName} {this.state.user.LastName}</h2>
    }
    render() {
        return (
            <Card className="CardBodyDiv">
                {this.funcPic()}

                <CardBody>
                    <ImageUploader
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif', 'jpeg']}
                        maxFileSize={5242880}
                    />
                    <FileUpload/>
                    <CardTitle>{this.funcName()}</CardTitle>
                    <CardText>
                        <h1>{this.state.sum}%</h1>
                    </CardText>
                    <p>your current rating :</p>
                    <StarRatings
                        rating={this.state.rating}
                        starRatedColor="blue"
                        changeRating={this.changeRating}
                        numberOfStars={5}
                        name='rating'
                        starDimension="20px"
                    />
                </CardBody>

                <CardBody>
                    <CardLink href="/">Logout</CardLink>
                </CardBody>
            </Card>
        );
    }
}

export default ProfileCard;