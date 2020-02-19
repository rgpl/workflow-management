import React from 'react';
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiFieldText,
    EuiFieldPassword,
    EuiSpacer,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiBottomBar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiButton,
    EuiForm,
    EuiFormRow
  } from '@elastic/eui';
import './login.css';
import { Redirect} from 'react-router-dom';
import axios from 'axios';
import { userLogin } from '../store/actions';
import { connect } from 'react-redux'

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: '',
            authenticated: false,
            showErrors: false
        };
    }

    onNameChange = e => {
        this.setState({
          userName: e.target.value,
        });
    };

    onPasswordChange = e => {
        this.setState({
            password: e.target.value
        });
    }

    onLoginClick = e => {

        if(this.state.username !== "" && this.state.password !== "") {

            this.setState({
                showErrors: false
            });

            axios.get('http://localhost:4000/login', {
                params: {
                username: this.state.userName,
                password: this.state.password
                }
            },{ withCredentials: true })
            .then( (response)=> {
                console.log("login-response->",response);
                if(response.data.success){
                    this.setState({
                        authenticated:true
                    });
                }
            })
            .catch((error) =>{
                this.setState({
                    authenticated:true
                });
                this.props.userLogin(this.state.userName);
            })
            .finally(() => {
                // always executed
            });
        } else {
            this.setState({
                showErrors: true
            });
        }
    }

    enterPressed = e => {

        let code = e.keyCode || e.which;
        if(code === 13) {
            if(this.state.username !== "" && this.state.password !== "") {
                this.onLoginClick();
            }
        }
    }

    render() {
        if(this.state.authenticated){
            return <Redirect to='/' />
        }

        let errors;

        if (this.state.showErrors) {
            errors = [
                "Username / Password cannot be empty!!",
            ];
        }

        return (
            <EuiPage>
                <EuiPageBody>
                    <EuiPageHeader>
                        <EuiPageHeaderSection>
                        <EuiTitle size="l">
                            <h1>Elastic Sample</h1>
                        </EuiTitle>
                        </EuiPageHeaderSection>
                        <EuiPageHeaderSection>elastic sample</EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiSpacer size="xxl"></EuiSpacer>
                <EuiPageContent verticalPosition="center" horizontalPosition="center">
                    <EuiPageContentHeader>
                    <EuiPageContentHeaderSection>
                        <EuiTitle>
                        <h2>Sign-In</h2>
                        </EuiTitle>
                    </EuiPageContentHeaderSection>
                    </EuiPageContentHeader>
                    <EuiPageContentBody>
                        <EuiForm isInvalid={this.state.showErrors} error={errors}>
                            <EuiFormRow>
                                <EuiFieldText
                                placeholder="Username"
                                value={this.state.userName}
                                onChange={this.onNameChange}
                                icon="user"
                                aria-label="Use aria labels when no actual label is in use"
                                onKeyUp={this.enterPressed}
                                />
                            </EuiFormRow>

                            <EuiSpacer size="m"></EuiSpacer>

                            <EuiFormRow>
                                <EuiFieldPassword
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onPasswordChange}
                                aria-label="Use aria labels when no actual label is in use"
                                onKeyUp={this.enterPressed}
                                />
                            </EuiFormRow>

                            <EuiSpacer size="m"></EuiSpacer>
                            <EuiFlexItem grow={false}>
                                <EuiButton fill onClick={this.onLoginClick}>
                                    GO
                                </EuiButton>
                            </EuiFlexItem>
                        </EuiForm>

                    </EuiPageContentBody>
                </EuiPageContent>
                <EuiBottomBar>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem grow={false}>
                        <EuiFlexGroup gutterSize="s">
                            <EuiFlexItem grow={false}>
                            <EuiButton color="ghost" size="s" iconType="help">
                                Help
                            </EuiButton>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                            <EuiButton color="ghost" size="s" iconType="globe">
                                Sitemap
                            </EuiButton>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    </EuiBottomBar>
                </EuiPageBody>
            </EuiPage>
        );

    }
}

const mapStateToProps = ({ reducer }) => ({ reducer });
const actions = { userLogin };

export default connect(
  mapStateToProps,
  actions
)(Login);
