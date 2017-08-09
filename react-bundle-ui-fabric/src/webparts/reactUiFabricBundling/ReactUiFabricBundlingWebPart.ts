import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'reactUiFabricBundlingStrings';
import ReactUiFabricBundling from './components/ReactUiFabricBundling';
import { IReactUiFabricBundlingProps } from './components/IReactUiFabricBundlingProps';
import { IReactUiFabricBundlingWebPartProps } from './IReactUiFabricBundlingWebPartProps';

export default class ReactUiFabricBundlingWebPart extends BaseClientSideWebPart<IReactUiFabricBundlingWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReactUiFabricBundlingProps > = React.createElement(
      ReactUiFabricBundling,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
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
