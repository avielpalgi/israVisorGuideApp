import React, { Component } from 'react'
import '../Css/signUpNavBar.css';
import { Link, withRouter } from 'react-router-dom';
import ProfileDetails from "../Screens/ProfileDetails.jsx";
import Area from '../Screens/Area';
import ProfileCard from '../Components/ProfileCard.jsx';
import NavbarProfile from '../Components/NavbarProfile';
import Languages from '../Screens/Languages';
import '../Css/Home.css';
import Hobbies from '../Screens/Hobbies';
import Expertise from '../Screens/Expertise';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import facebook from '../Img/facebook.png';
import twitter from '../Img/twitter.png';
import website from '../Img/website.png';
import linkdin from '../Img/linkedin.png';
import instegram from '../Img/The_Instagram_Logo.jpg';
import MainFooter from '../Components/MainFooter';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Container, Row, Col } from "shards-react";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                IsraVisor
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namePage: 'Profile Details',
            local: this.props.local,
            navbar: this.props.navbarOpenCheck,
            //allUsers: this.props.Allusers,
            Guide: '',
            GuideLanguages: [],
            GuideAreas: [],
            GuideHobbies: [],
            GuideExpertises: [],
            AllAreas: this.props.AllAreas,
            AllHobbies: this.props.AllHobbies,
            AllExpertises: this.props.AllExpertises,
            GuideLinks: [],
            fulllink: [],
            options: [
                {
                    id: 0,
                    name: 'Select…',
                    value: null,
                    label: null
                },
                {
                    id: 1,
                    name: 'Instegram',
                    value: 'Instegram',
                    label: <div><img className="imageicons" src={instegram} /><span>Instegram</span></div>
                },
                {
                    id: 2,
                    name: 'Facebook',
                    value: 'Facebook',
                    label: <div><img className="imageicons" src={facebook} /><span>Facebook</span></div>
                },
                {
                    id: 3,
                    name: 'Twitter',
                    value: 'Twitter',
                    label: <div><img className="imageicons" src={twitter} /><span>Twitter</span></div>
                },
                {
                    id: 4,
                    name: 'Linkdin',
                    value: 'Linkdin',
                    label: <div><img className="imageicons" src={linkdin} /><span>Linkdin</span></div>
                },
                {
                    id: 5,
                    name: 'Website',
                    value: 'Website',
                    label: <div><img className="imageicons" src={website} /><span>Website</span></div>
                },
            ],
        };
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/';
        }
    }
    componentDidUpdate(PrevProps, state) {
        if (PrevProps.AllExpertises !== this.props.AllExpertises) {
            this.props.ReloadHobbies();
            this.setState({
                AllExpertises: this.props.AllExpertises
            })
        }
        if (PrevProps.AllHobbies !== this.props.AllHobbies) {
            this.setState({
                AllHobbies: this.props.AllHobbies
            })
        }
        if (PrevProps.AllAreas !== this.props.AllAreas) {
            this.setState({
                AllAreas: this.props.AllAreas
            })
        }
    }
    componentWillMount() {
        const Guidetemp = JSON.parse(localStorage.getItem('Guide'));
        if (this.props.location.state === undefined) {
            this.setState({
                Guide: Guidetemp
            })
        }
        else {
            this.setState({
                Guide: this.props.location.state.GuideTemp
            })
        }
        this.getLinksFromSQL(Guidetemp);
    }
    componentDidMount() {
        this.GetHobbiesGuideList(this.state.Guide);
        this.GetLanguagesGuideList(this.state.Guide);
        this.GetAreasGuideList(this.state.Guide);
        this.GetExpertisesGuides(this.state.Guide);
        //this.getLinksFromSQL(this.state.Guide);
    }

    //מביא את הלינקים של המדריך הספציפי
    getLinksFromSQL = (TempGuide) => {
        fetch(this.apiUrl + "Link/" + TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({
                        GuideLinks: result
                    })
                    //שולח את הרשימה לפונקציה שמסדרת את כל הלינקים
                    this.orgenzie(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //יוצר מערך חדש הכולל את שם הלינק(אינסטגרם למשל) ואת הכתובת של הלינק
    orgenzie = (links) => {
        let templink = "";
        let temparraylinks = [];
        for (let j = 0; j < links.length; j++) {
            const link = links[j].LinksCategoryLCode;
            for (let i = 0; i < this.state.options.length; i++) {
                const element = this.state.options[i];
                if (element.id == link) {
                    temparraylinks.push(element.value + " - " + links[j].linkPath)
                }
            }
        }
        this.setState({
            fulllink: temparraylinks
        })
        localStorage.setItem('links', JSON.stringify(temparraylinks));
    }

    updateAreasGuides = (areas) => {
        //מביא את רשימת האזורים של המדריך 
        this.GetAreasGuideList(this.state.Guide);

    }
    updateLanguageGuides = () => {
        //מביא את רשימת השפות של המדריך 
        this.GetLanguagesGuideList(this.state.Guide);
    }
    updateHobbiesGuides = () => {
        //מביא את רשימת התחביבים של המדריך 
        this.GetHobbiesGuideList(this.state.Guide);
    }
    updateExpertisesGuides = () => {
        //מביא את רשימת ההתמחויות של המדריך 
        this.GetExpertisesGuides(this.state.Guide);
    }

    //שינוי עמוד
    ClickPage2 = (e) => {
        this.setState({
            namePage: e
        });
    }
    funcGoogleFacebook = () => {
        return <ProfileCard local={this.state.local} GuideDetails={this.state.Guide} GuideExpertises={this.state.GuideExpertises} guideListHobbies={this.state.GuideHobbies} languages={this.state.GuideLanguages} areas={this.state.GuideAreas} GuideLinks={this.state.fulllink} />
    }

    //רינדור החלק המרכזי במסך לפי ה name page
    renderMainPage = () => {
        const namePage2 = this.state.namePage;
        if (namePage2 === "Profile Details") {
            return <ProfileDetails local={this.state.local} GuideDetails={this.state.Guide} GuideLinks={this.state.fulllink} />
        }
        // else if (namePage2 === "Area Knowledge") {
        //     return <Area updateArea={this.updateAreasGuides} guideListAreas={this.state.GuideAreas} GuideDetails={this.state.Guide} AreasArray={this.state.AllAreas} />
        // }
        else if (namePage2 === "Languages") {
            return <Languages local={this.state.local} updateLanguage={this.updateLanguageGuides} guideListLanguages={this.state.GuideLanguages} GuideDetails={this.state.Guide} />
        }
        else if (namePage2 === "Hobbies") {
            return <Hobbies local={this.state.local} GuideDetails={this.state.Guide} AllHobbies={this.state.AllHobbies} guideListHobbies={this.state.GuideHobbies} updateHobbies={this.updateHobbiesGuides} />
        }
        else if (namePage2 === "Expertise") {
            return <Expertise local={this.state.local} GuideDetails={this.state.Guide} AllExpertises={this.state.AllExpertises} GuideExpertises={this.state.GuideExpertises} updateExpertises={this.updateExpertisesGuides} />
        }
    }

    //מביא את רשימת האזורים של המדריך 
    GetAreasGuideList = (TempGuide) => {
        fetch(this.apiUrl + "Area/" + TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ GuideAreas: result })
                    localStorage.setItem('areas', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //מביא את רשימת התחביבים של המדריך
    GetHobbiesGuideList = (TempGuide) => {
        fetch(this.apiUrl + "Hobby/" + TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ GuideHobbies: result })
                    localStorage.setItem('Hobby', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //מביא את רשימת ההתמחויות של המדריך
    GetExpertisesGuides = (TempGuide) => {
        fetch(this.apiUrl + "Expertise/" + TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ GuideExpertises: result })
                    localStorage.setItem('Expertise', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }


    //מביא את כל השפות של המדריך
    GetLanguagesGuideList = (TempGuide) => {
        fetch(this.apiUrl + "Language/" + TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ GuideLanguages: result })
                    localStorage.setItem('languages', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

//אם העמוד הנוכחי הוא עדכון פרופיל אז יופיע כרטיס הפרופיל של המדריך, אם לא אז לא
    showProfileCard = () => {
        if (this.state.namePage === "Profile Details") {
            return <Row className="homePage">
                <Col className="cardDiv col-lg-3 col-md-2 hidden-xs hidden-sm ">
                    {this.funcGoogleFacebook()}
                </Col>
                <Col className="col-lg-9 col-md-10 col-sm-12 main-content p-0 centerDiv">
                    {this.renderMainPage()}
                </Col>
            </Row>
        }
        else {
            return <Row className="homePage">
                <Col className="cardDiv col-12">
                    {this.renderMainPage()}
                </Col>
            </Row>
        }
    }

    render() {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer">
                <NavbarProfile ClickPage2={this.ClickPage2} />
                {this.showProfileCard()}
            </Container>
        )
    }
}

export default withRouter(Home)