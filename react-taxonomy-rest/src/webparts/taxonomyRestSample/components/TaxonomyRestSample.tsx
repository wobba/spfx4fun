import * as React from 'react';
import styles from './TaxonomyRestSample.module.scss';
import { ITaxonomyRestSampleProps } from './ITaxonomyRestSampleProps';
import { SPHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import {
  SearchBox, DefaultButton
} from 'office-ui-fabric-react';

interface IGetSuggestionsRequest {
  start: string; // query
  lcid: number;
  sspList: string; // guid of term store
  termSetList: string; // guid of term set
  anchorId: string;
  isSpanTermStores: boolean; // search in all termstores
  isSpanTermSets: boolean;
  isIncludeUnavailable: boolean;
  isIncludeDeprecated: boolean;
  isAddTerms: boolean;
  isIncludePathData: boolean;
  excludeKeyword: boolean;
  excludedTermset: string;
}

interface IFindTermSetRequest {
  searchTerms: string;
  lcid: number;
}

interface IGetChildTermsInTermSetWithPagingRequest {
  sspId: string; // guid of term store
  lcid: number;
  guid: string; // guid of term set
  includeDeprecated: boolean;
  pageLimit: number;
  pagingForward: boolean;
  includeCurrentChild: boolean;
  currentChildId: string;
  webId: string;
  listId: string;
}

interface IGetChildTermsInTermWithPagingRequest {
  sspId: string; // guid of term store
  lcid: number;
  guid: string; // guid of term
  termsetId: string; // guid of term set
  includeDeprecated: boolean;
  pageLimit: number;
  pagingForward: boolean;
  includeCurrentChild: boolean;
  currentChildId: string;
  webId: string;
  listId: string;
}

interface IPickSspsRequest {
  webId: string;
  listId: string;
  lcid: number;
}

interface IGetGroupsRequest {
  sspId: string; // guid of term store
  webId: string;
  listId: string;
  includeSystemGroup: boolean;
  lcid: number;
}

interface IGetTermSetsRequest {
  sspId: string; // guid of term store
  guid: string; // guid of term group
  includeNoneTaggableTermset: boolean;
  webId: string;
  listId: string;
  lcid: number;
}


interface ITermSetInformation {
  Id: string;
  Nm: string; //name
  Ow: string; //owner
  It: boolean; //isTermSet
}

interface ITermSet {
  Id: string;
  Name: string;
  Owner: string;
}

interface ITerm {
  Id: string;
  Label: string;
  Paths: string[];
}

interface IFindTermSetResult {
  Error: string;
  Lm: number;
  Content: any[];
}

export default class TaxonomyRestSample extends React.Component<ITaxonomyRestSampleProps, any> {
  constructor() {
    super();
    this.updateQuery = this.updateQuery.bind(this);
    this.findTermSets = this.findTermSets.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getChildTermsInTermSetWithPaging = this.getChildTermsInTermSetWithPaging.bind(this);
    this.getChildTermsInTermWithPaging = this.getChildTermsInTermWithPaging.bind(this);
    this.pickSsps = this.pickSsps.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.state = {};
  }

  public componentDidMount(): void {
    this.setState({ query: "" });
    this.pickSsps();
  }

  public render(): React.ReactElement<ITaxonomyRestSampleProps> {
    let renderResult = "";
    if (this.state.results) {
      renderResult = JSON.stringify(this.state.results, null, 2);
    }
    return (
      <div className={styles.taxonomyRestSample}>
        <div className={`ms-Grid ${styles.container}`}>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <SearchBox
                onChange={(newValue) => this.updateQuery(newValue)}
                onSearch={(newValue) => this.updateQuery(newValue)}
              />
            </div>
          </div>
          <div className="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white">
            <div className="ms-Grid-col ms-u-sm12">
              <DefaultButton text="Find Termset (requires search)" onClick={this.findTermSets} />&nbsp;
              <DefaultButton text="Get Suggestions" onClick={this.getSuggestions} />&nbsp;
              <DefaultButton text="Get Child Terms In Term Set With Paging" onClick={this.getChildTermsInTermSetWithPaging} />&nbsp;
              <DefaultButton text="Get Child Terms In Term With Paging" onClick={this.getChildTermsInTermWithPaging} />&nbsp;
            </div>
          </div>
          <div className="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white">
            <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <pre>
                {renderResult}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private updateQuery(query: string) {
    this.setState({
      query: query
    });
  }

  /**
   * Method to find term sets having the search value, or having a term with the value
   */
  private findTermSets() {
    const url = this.props.context.pageContext.web.serverRelativeUrl + '/_vti_bin/TaxonomyInternalService.json/FindTermSet';
    const query: IFindTermSetRequest = { 'searchTerms': this.state.query, 'lcid': 1033 };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      body: JSON.stringify(query)
    }).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          let termSetResult: IFindTermSetResult = result.d;
          let returnResults: ITermSet[] = [];
          if (termSetResult.Content) {
            for (var i = 0; i < termSetResult.Content.length; i++) {
              var termInfo = termSetResult.Content[i];
              if (termInfo.It) {
                returnResults.push({
                  Id: termInfo.Id,
                  Name: termInfo.Nm,
                  Owner: termInfo.Ow
                });
              }
            }
          }
          this.setState({
            results: returnResults
          });
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }

  /**
   * Method to query for terms in a termset
   */
  private getSuggestions() {
    const url = this.props.context.pageContext.web.serverRelativeUrl + '/_vti_bin/TaxonomyInternalService.json/GetSuggestions';
    const query: IGetSuggestionsRequest = {
      start: this.state.query,
      lcid: 1033,
      sspList: this.state.sspId, //id of termstore
      termSetList: "bcb8e186-25af-47f6-be91-bd5eda552410", //id of termset
      anchorId: "00000000-0000-0000-0000-000000000000",
      isSpanTermStores: false,
      isSpanTermSets: false,
      isIncludeUnavailable: false,
      isIncludeDeprecated: false,
      isAddTerms: false,
      isIncludePathData: false,
      excludeKeyword: false,
      excludedTermset: "00000000-0000-0000-0000-000000000000"
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      body: JSON.stringify(query)
    }).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          let returnResults: ITerm[] = [];
          let groups: any[] = result.d.Groups;
          for (var i = 0; i < groups.length; i++) {
            var suggestions: any[] = groups[i].Suggestions;
            for (var j = 0; j < suggestions.length; j++) {
              var term: any = suggestions[j];
              returnResults.push({
                Id: term.Id,
                Label: term.DefaultLabel,
                Paths: term.Paths
              });
            }
          }

          this.setState({
            results: returnResults
          });
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }

  /**
   * Method to list all level one terms in a term set
   */
  private getChildTermsInTermSetWithPaging() {
    const url = this.props.context.pageContext.web.serverRelativeUrl + '/_vti_bin/TaxonomyInternalService.json/GetChildTermsInTermSetWithPaging';
    const query: IGetChildTermsInTermSetWithPagingRequest = {
      lcid: 1033,
      sspId: this.state.sspId, //id of termstore
      guid: "bcb8e186-25af-47f6-be91-bd5eda552410", //id of termset
      includeDeprecated: false,
      pageLimit: 1000,
      pagingForward: false,
      includeCurrentChild: false,
      currentChildId: "00000000-0000-0000-0000-000000000000",
      webId: "00000000-0000-0000-0000-000000000000",
      listId: "00000000-0000-0000-0000-000000000000"
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      body: JSON.stringify(query)
    }).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          let returnResults: ITerm[] = [];
          this.setState({
            //results: returnResults
            results: result.d
          });
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }

  /**
   * Method to list all child terms of a term
   */
  private getChildTermsInTermWithPaging() {
    const url = this.props.context.pageContext.web.serverRelativeUrl + '/_vti_bin/TaxonomyInternalService.json/GetChildTermsInTermWithPaging';
    const query: IGetChildTermsInTermWithPagingRequest = {
      lcid: 1033,
      sspId: this.state.sspId, //id of termstore
      guid: "17219077-0abf-4eec-803d-eab938dc2a57", //id of term
      termsetId: "bcb8e186-25af-47f6-be91-bd5eda552410", //id of termset
      includeDeprecated: false,
      pageLimit: 1000,
      pagingForward: false,
      includeCurrentChild: true,
      currentChildId: "00000000-0000-0000-0000-000000000000",
      webId: "00000000-0000-0000-0000-000000000000",
      listId: "00000000-0000-0000-0000-000000000000"
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      body: JSON.stringify(query)
    }).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          let returnResults: ITerm[] = [];
          this.setState({
            //results: returnResults
            results: result.d
          });
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }

  /**
   * Method to list all term stores 
   */
  private pickSsps() {
    const url = this.props.context.pageContext.web.serverRelativeUrl + '/_vti_bin/TaxonomyInternalService.json/PickSsps';
    const query: IPickSspsRequest = {
      lcid: 1033,
      webId: "00000000-0000-0000-0000-000000000000",
      listId: "00000000-0000-0000-0000-000000000000"
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      body: JSON.stringify(query)
    }).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          this.setState({
            results: result.d,
            sspId: result.d.Content[0].Id
          });
          this.getGroups();
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }

  /**
   * Method to list all term groups for a term store
   */
  private getGroups() {
    const url = this.props.context.pageContext.web.serverRelativeUrl + '/_vti_bin/TaxonomyInternalService.json/GetGroups';
    const query: IGetGroupsRequest = {
      sspId: this.state.sspId,
      webId: this.props.context.pageContext.web.id.toString(),
      listId: "00000000-0000-0000-0000-000000000000",
      includeSystemGroup: false,
      lcid: 1033
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      body: JSON.stringify(query)
    }).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          this.setState({
            results: result.d
          });
          this.getTermSets(result.d.Content[0].Id);
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }

  /**
   * Method to list all term sets in a term group
   */
  private getTermSets(termGroupId: string) {
    const url = this.props.context.pageContext.web.serverRelativeUrl + '/_vti_bin/TaxonomyInternalService.json/GetTermSets';
    const query: IGetTermSetsRequest = {
      sspId: this.state.sspId,
      guid: termGroupId,
      webId: this.props.context.pageContext.web.id.toString(),
      listId: "00000000-0000-0000-0000-000000000000",
      includeNoneTaggableTermset: true,
      lcid: 1033
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      body: JSON.stringify(query)
    }).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          this.setState({
            results: result.d
          });
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }
}
