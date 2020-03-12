import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '../Css/SignIn.css';
import logo from '../Img/logo.png';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import '../Css/passwordReset.css'
class ResetPassword extends Component {
    render() {
        return (
            <MDBContainer>
                <MDBRow className="RowDivSignIn">
                    <MDBCol md="6" className="LogoDiv"><img src={logo} /></MDBCol>
                    <MDBCol className="ColDivSignIn" md="6">
                        <MDBCard className="CardDivSignIn">
                            <MDBCardBody className="mx-4 CardBody cardReset">
                                <div>
                                    <Link to="/signIn"><i className="fa fa-undo" aria-hidden="true"></i></Link>
                                </div>
                                <div className="text-center">
                                    <h3 className="dark-grey-text mb-5">
                                        <strong>Reset Password</strong>
                                    </h3>
                                </div>
                                <Form.Group controlId="formBasicEmail">
    <Form.Label>Enter your email address to reset your password</Form.Label>
    <Form.Control type="email" placeholder="Enter email" />
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>
                                <MDBBtn
                                    type="button"
                                    gradient="blue"
                                    rounded
                                    className="btn-block z-depth-1a btnReset"
                                >Reset Password</MDBBtn>
                            </MDBCardBody>

                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        );
    }
}

export default ResetPassword;
