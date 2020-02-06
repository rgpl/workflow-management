import React from 'react';
import {
    EuiPage,
    EuiPageBody,
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiIcon
} from '@elastic/eui';

export default class Draftbench extends React.Component {

    render(){
        return(
            <EuiPage>
                <EuiPageBody>
                    <EuiHeader>
                        <EuiHeaderSection grow={false}>
                            <EuiHeaderSectionItem>
                            <EuiIcon type="arrowLeft" size="xl" />
                            </EuiHeaderSectionItem>
                        </EuiHeaderSection>
                    </EuiHeader>
                </EuiPageBody>
            </EuiPage>
        )
    }
}