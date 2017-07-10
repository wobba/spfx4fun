import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'taxonomyRestSampleStrings';
import TaxonomyRestSample from './components/TaxonomyRestSample';
import { ITaxonomyRestSampleProps } from './components/ITaxonomyRestSampleProps';
import { ITaxonomyRestSampleWebPartProps } from './ITaxonomyRestSampleWebPartProps';

export default class TaxonomyRestSampleWebPart extends BaseClientSideWebPart<ITaxonomyRestSampleWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITaxonomyRestSampleProps > = React.createElement(
      TaxonomyRestSample,
      {
        context: this.context
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
