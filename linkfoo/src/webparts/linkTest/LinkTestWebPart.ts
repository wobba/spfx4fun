import { Version } from '@microsoft/sp-core-library';
import {
    BaseClientSideWebPart,
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './LinkTestWebPart.module.scss';
import * as strings from 'LinkTestWebPartStrings';

export interface ILinkTestWebPartProps {
    description: string;
}

export default class LinkTestWebPart extends BaseClientSideWebPart<ILinkTestWebPartProps> {

    public render(): void {
        this.domElement.innerHTML = `
              <a target="_blank" href="/">Root site</a>
        `;
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
