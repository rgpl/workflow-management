import React from 'react';
import {
    EuiPage,
    EuiPageBody,
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiIcon,
    EuiFlexItem,
    EuiFlexGroup,
    EuiSideNav,
    EuiPageContent,
    EuiPageContentHeader,
    EuiTitle,
    EuiPageContentBody,
    EuiPageContentHeaderSection
} from '@elastic/eui';
import './draftbench.css';

export default class Draftbench extends React.Component {

    

    render(){
        

        return(
            <EuiPage>
                <EuiPageBody>
                    <EuiHeader>
                        <EuiHeaderSection grow={false}>
                            <EuiHeaderSectionItem>
                                <EuiFlexItem className="db-back-icon">
                                    <EuiIcon type="arrowLeft" size="l" />
                                </EuiFlexItem>
                            </EuiHeaderSectionItem>
                        </EuiHeaderSection>
                    </EuiHeader>
                    <EuiFlexGroup>
                        <EuiFlexItem grow={false}>
                            <EuiSideNav
                                
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
                </EuiPageBody>
            </EuiPage>
        )
    }
}
