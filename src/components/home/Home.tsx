import React, {Fragment, useContext, useEffect} from 'react';
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
import { Redirect } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';
import { useJourneyStore } from "../../store/JourneyStore";

function Home() {
  const journeyStore = useJourneyStore();

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

  const openSketchPad = (e: any, create?: boolean) => {
    if (create) {
      journeyStore.setEditMode(true);
    }

    journeyStore.setJourneyEdit(true);
  }

  return (
    <Observer>{() => (
      <Fragment>
        {journeyStore.editJourney ? <Redirect to="/sketchpad" /> : undefined }
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
                      <EuiButton fill onClick={(event: any) => {
                        openSketchPad(event, true)
                      }}>
                        Create Journey
                      </EuiButton>
                    </EuiPageContentHeaderSection>
                  </EuiPageContentHeader>
                  <EuiPageContentBody>
                    {journeyStore.journeyList.map((value: { id: string | number | undefined; displayLabel: React.ReactNode; }) => (
                      <EuiPanel paddingSize="m" hasShadow={true} style={{marginBottom: 10}} key={value.id}>
                        <EuiFlexGroup justifyContent="spaceBetween">
                          <EuiFlexItem>
                            <EuiText>{value.displayLabel}</EuiText>
                          </EuiFlexItem>
                          <EuiFlexItem grow={false}>
                            <EuiButton
                              color="secondary"
                              fill
                              size="s"
                              onClick={openSketchPad}>
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
