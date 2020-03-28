import React, { Fragment } from 'react';
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
    EuiFlexGroup,
    EuiPageContent,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiPageContentBody,
    EuiPageContentHeader,
	EuiPanel,
	EuiText
} from '@elastic/eui';
import { Redirect } from 'react-router-dom';

import HeaderAppMenu from './header/header_app_menu';
import HeaderUserMenu from './header/header_user_menu';
import HeaderSpacesMenu from './header/header_spaces_menu';
import { EuiPageHeader } from '@elastic/eui';
import { EuiPageHeaderSection } from '@elastic/eui';
import { JourneyStore } from '../store/journeyStore';
import { inject, observer } from 'mobx-react';

type JourneyProps = {
  journeyStore:JourneyStore;
}

@inject('journeyStore')
@observer
export default class Home extends React.Component<JourneyProps> {

    componentDidMount(){
        const { getExistingJourneys } = this.props.journeyStore;
        getExistingJourneys();
    }

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
            onClick: (e:any) => {
              e.preventDefault();
              console.log('You clicked management');
            },
            'data-test-subj': 'breadcrumbsAnimals',
            className: 'customClass',
          },
          {
            text: 'Truncation test is here for a really long item',
            href: '#',
            onClick: (e:any) => {
              e.preventDefault();
              console.log('You clicked truncation test');
            },
          },
          {
            text: 'hidden',
            href: '#',
            onClick: (e:any) => {
              e.preventDefault();
              console.log('You clicked hidden');
            },
          },
          {
            text: 'Users',
            href: '#',
            onClick: (e:any) => {
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

    handleLogout = (e:any) =>  {
        console.log('logout-click-state-lift');
    }

    openSketchPad = (e:any,create?:boolean) => {
        const {setJourneyEdit,setEditMode} = this.props.journeyStore;
        if(create){
            setEditMode(true);
        }
        setJourneyEdit(true);
    }

    render() {
        const {editJourney,journeyList} = this.props.journeyStore;
        if(editJourney){
            return (
                <Redirect to="/sketchpad" />
            )
        }

        return (
          <Fragment>
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
                  <HeaderUserMenu onLogoutClick = {this.handleLogout}/>
              </EuiHeaderSectionItem>

              <EuiHeaderSectionItem>
                  <HeaderAppMenu />
              </EuiHeaderSectionItem>
              </EuiHeaderSection>
          </EuiHeader>
			{/* cut here*/}
          <EuiPage>
                <EuiPageBody>
                <EuiPageHeader>
                  <EuiPageHeaderSection>
                  <EuiTitle size="l">
                        <h1>Journeys</h1>
                  </EuiTitle>
                  </EuiPageHeaderSection>
                </EuiPageHeader>
                    <EuiFlexGroup>
                        
                        <EuiFlexItem>
                        <EuiPageContent>

                        <EuiPageContentHeader>
                        <EuiPageContentHeaderSection >
                            <EuiButton fill onClick={ (event:any) => {this.openSketchPad(event,true)}}>
                            Create Journey
                            </EuiButton>
                        </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        <EuiPageContentBody>
                            { journeyList.map((value)=>(
                                <EuiPanel paddingSize="m" hasShadow={true} style={{marginBottom:10}} key={value.id}>
                                    <EuiFlexGroup justifyContent="spaceBetween">
                                        <EuiFlexItem>
                                            <EuiText>{value.displayLabel}</EuiText>
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={false}>
                                            <EuiButton
                                            color="secondary"
                                            fill
                                            size="s"
                                            onClick={this.openSketchPad}>
                                            View
                                            </EuiButton>
                                        </EuiFlexItem>
                                    </EuiFlexGroup>
                                </EuiPanel>
                            ))
                            }
                        </EuiPageContentBody>
                    </EuiPageContent>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                </EuiPageBody>
            </EuiPage>

          </Fragment>
            

        );
    }

}
