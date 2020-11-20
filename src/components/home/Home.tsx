import React, {Fragment, useContext, useEffect, useState} from 'react';
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

import HeaderAppMenu from './header/HeaderAppMenu';
import HeaderUserMenu from './header/HeaderUserMenu';
import HeaderSpacesMenu from './header/HeaderSpacesMenu';
import { EuiPageHeader } from '@elastic/eui';
import { EuiPageHeaderSection } from '@elastic/eui';
import { Observer } from 'mobx-react-lite';
import { useJourneyStore } from "../../store/JourneyStore";
import axios, {AxiosResponse} from "axios";

function Home() {
  const journeyStore = useJourneyStore();

  useEffect(() => {
    axios.get('http://localhost:4000/journeys')
      .then((response: AxiosResponse<Array<any>>) => {
        console.log("login-response->", response);
        journeyStore.setJourneyList(response.data);
      })
      .catch((error) => console.log("login->", error))
      .finally(() => {
        // always executed
      });
  });

  const renderLogo = () => {
    return (
      <EuiHeaderLogo
        iconType="logoKibana"
        href="#"
        aria-label="Go to home page"
      />
    );
  }

  const renderBreadcrumbs = () => {
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
        onClick: (e: any) => {
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

  const renderSearch = () => {
    return (
      <EuiHeaderSectionItemButton aria-label="Search">
        <EuiIcon type="search" size="m" />
      </EuiHeaderSectionItemButton>
    );
  }

  const handleLogout = () =>  {
    console.log('logout-click-state-lift');
  }

  return (
    <Observer>{() => (
      <Fragment>
        <EuiHeader>
          <EuiHeaderSection grow={false}>
            <EuiHeaderSectionItem border="right">
              {renderLogo()}
            </EuiHeaderSectionItem>
            <EuiHeaderSectionItem border="right">
              <HeaderSpacesMenu/>
            </EuiHeaderSectionItem>
          </EuiHeaderSection>

          {renderBreadcrumbs()}

          <EuiHeaderSection side="right">
            <EuiHeaderSectionItem>{renderSearch()}</EuiHeaderSectionItem>
            <EuiHeaderSectionItem>
              <HeaderUserMenu onLogoutClick={handleLogout}/>
            </EuiHeaderSectionItem>
            <EuiHeaderSectionItem>
              <HeaderAppMenu/>
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
                    <EuiPageContentHeaderSection>
                      <EuiButton
                        href={"/journey/#/sketchpad/"}
                        fill
                      >
                        Create Journey
                      </EuiButton>
                    </EuiPageContentHeaderSection>
                  </EuiPageContentHeader>
                  <EuiPageContentBody>
                    {journeyStore.journeyList.map((value: { id: string|undefined; }) => (
                      <EuiPanel paddingSize="m" hasShadow={true} style={{marginBottom: 10}} key={value.id}>
                        <EuiFlexGroup justifyContent="spaceBetween">
                          <EuiFlexItem>
                            <EuiText>{value.id}</EuiText>
                          </EuiFlexItem>
                          <EuiFlexItem grow={false}>
                            <EuiButton
                              href={"/journey/#/sketchpad/" + value.id}
                              color="secondary"
                              fill
                              size="s"
                            >
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
    )}</Observer>
  );
}

export default Home;
