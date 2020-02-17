import React from 'react';
import {
    EuiPage,
    EuiPageBody,
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderLogo,
    EuiHeaderBreadcrumbs,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiButton,
    EuiFlexItem,
    EuiBottomBar,
    EuiFlexGroup,
    EuiButtonEmpty,
    EuiSideNav,
    EuiPageContent,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiPageContentBody,
    EuiPageContentHeader
} from '@elastic/eui';
import { Redirect } from 'react-router-dom';

import HeaderAppMenu from './header/header_app_menu';
import HeaderUserMenu from './header/header_user_menu';
import HeaderSpacesMenu from './header/header_spaces_menu';


export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSideNavOpenOnMobile: false,
            selectedItemName: 'Lion stuff',
            authenticated: true
        };
    }

    toggleOpenOnMobile = () => {
        this.setState({
            isSideNavOpenOnMobile: !this.state.isSideNavOpenOnMobile,
        });
    };

    selectItem = name => {
        this.setState({
            selectedItemName: name,
        });
    };

    createItem = (name, data = {}) => {
        // NOTE: Duplicate `name` values will cause `id` collisions.
        return {
            ...data,
            id: name,
            name,
            isSelected: this.state.selectedItemName === name,
            onClick: () => this.selectItem(name),
        };
    };

    renderLogo() {
        return (
          <EuiHeaderLogo
            iconType="logoKibana"
            href="#"
            aria-label="Go to home page"
          />
        );
    }

    renderBreadcrumbs() {
        const breadcrumbs = [
          {
            text: 'Management',
            href: '#',
            onClick: e => {
              e.preventDefault();
              console.log('You clicked management');
            },
            'data-test-subj': 'breadcrumbsAnimals',
            className: 'customClass',
          },
          {
            text: 'Truncation test is here for a really long item',
            href: '#',
            onClick: e => {
              e.preventDefault();
              console.log('You clicked truncation test');
            },
          },
          {
            text: 'hidden',
            href: '#',
            onClick: e => {
              e.preventDefault();
              console.log('You clicked hidden');
            },
          },
          {
            text: 'Users',
            href: '#',
            onClick: e => {
              e.preventDefault();
              console.log('You clicked users');
            },
          },
          {
            text: 'Create',
          },
        ];

        return <EuiHeaderBreadcrumbs breadcrumbs={breadcrumbs} />;
    }

    renderSearch() {
        return (
          <EuiHeaderSectionItemButton aria-label="Search">
            <EuiIcon type="search" size="m" />
          </EuiHeaderSectionItemButton>
        );
    }

    handleLogout = e =>  {
        console.log('logout-click-state-lift');
        this.setState({
            authenticated:false
        });
    }

    render() {
        if(!this.state.authenticated) {
            return(
                <Redirect to="/login" />
            )

        }
        const sideNav = [
            this.createItem('Elasticsearch', {
              icon: <EuiIcon type="logoElasticsearch" />,
              items: [
                this.createItem('Data sources'),
                this.createItem('Users'),
                this.createItem('Roles'),
                this.createItem('Watches'),
                this.createItem(
                  'Extremely long title will become truncated when the browser is narrow enough'
                ),
              ],
            }),
            this.createItem('Kibana', {
              icon: <EuiIcon type="logoKibana" />,
              items: [
                this.createItem('Advanced settings', {
                  items: [
                    this.createItem('General'),
                    this.createItem('Timelion', {
                      items: [
                        this.createItem('Time stuff', {
                          icon: <EuiIcon type="clock" />,
                        }),
                        this.createItem('Lion stuff', {
                          icon: <EuiIcon type="stats" />,
                        }),
                      ],
                    }),
                    this.createItem('Visualizations'),
                  ],
                }),
                this.createItem('Index Patterns'),
                this.createItem('Saved Objects'),
                this.createItem('Reporting'),
              ],
            }),
            this.createItem('Logstash', {
              icon: <EuiIcon type="logoLogstash" />,
              items: [this.createItem('Pipeline viewer')],
            }),
          ];

        return (
            <EuiPage style={{padding:'0px'}}>
                <EuiPageBody>
                    <EuiHeader>
                        <EuiHeaderSection grow={false}>
                        <EuiHeaderSectionItem border="right">
                            {this.renderLogo()}
                        </EuiHeaderSectionItem>
                        <EuiHeaderSectionItem border="right">
                            <HeaderSpacesMenu />
                        </EuiHeaderSectionItem>
                        </EuiHeaderSection>

                        {this.renderBreadcrumbs()}

                        <EuiHeaderSection side="right">
                        <EuiHeaderSectionItem>{this.renderSearch()}</EuiHeaderSectionItem>

                        <EuiHeaderSectionItem>
                            <HeaderUserMenu onLogoutClick = {() => this.handleLogout()}/>
                        </EuiHeaderSectionItem>

                        <EuiHeaderSectionItem>
                            <HeaderAppMenu />
                        </EuiHeaderSectionItem>
                        </EuiHeaderSection>
                    </EuiHeader>
                    <EuiFlexGroup>
                        <EuiFlexItem grow={false}>
                        <EuiSideNav
                                mobileTitle="Navigate within $APP_NAME"
                                toggleOpenOnMobile={this.toggleOpenOnMobile}
                                isOpenOnMobile={this.state.isSideNavOpenOnMobile}
                                items={sideNav}
                                style={{ width: 192 }}
                            />
                        </EuiFlexItem>
                        <EuiFlexItem>
                        <EuiPageContent>

                        <EuiPageContentHeader>
                        <EuiPageContentHeaderSection>
                            <EuiTitle>
                            <h2>Content title</h2>
                            </EuiTitle>
                        </EuiPageContentHeaderSection>
                        <EuiPageContentHeaderSection>
                            Content abilities
                        </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        <EuiPageContentBody>Content body</EuiPageContentBody>
                    </EuiPageContent>
                        </EuiFlexItem>
                    </EuiFlexGroup>


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
                                <EuiButton color="ghost" size="s" iconType="user">
                                    Add user
                                </EuiButton>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                            <EuiFlexGroup gutterSize="s">
                                <EuiFlexItem grow={false}>
                                <EuiButtonEmpty color="ghost" size="s" iconType="cross">
                                    Discard
                                </EuiButtonEmpty>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                <EuiButton color="primary" fill size="s" iconType="check">
                                    Save
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
