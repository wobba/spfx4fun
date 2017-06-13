import * as React from 'react';
import { IHelloWorldProps } from './IHelloWorldProps';
import { GraphHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export default class HelloWorld extends React.Component<IHelloWorldProps, any> {
  constructor() {
    super();
    this.state = {
      appointments: ""
    };
  }

  public componentDidMount(): void {

    //this.props.context.graphHttpClient.get("beta/reports/Office365GroupsActivity(view='Detail',period='D7')/content", GraphHttpClient.configurations.v1).then((response: HttpClientResponse) => {

    // Group ID is not directly available yet
    let groupId = this.props.context.pageContext.legacyPageContext.groupId;
    this.props.context.graphHttpClient.get(`v1.0/groups/${groupId}/events`, GraphHttpClient.configurations.v1).then((response: HttpClientResponse) => {
      if (response.ok) {
        response.json().then((result: any) => {
          debugger;
          let appointments: string = '';
          for (var i = 0; i < result.value.length; i++) {
            var element = result.value[i];
            appointments += element.subject + "|";
          }
          this.setState({ appointments: appointments });
        });
      } else {
        console.warn(response.statusText);
      }
    });
  }

  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={"ms-Grid-row ms-bgColor-themeDark ms-fontColor-white"}>
        <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
          <p className="ms-font-l ms-fontColor-white">{this.state.appointments}</p>
        </div>
      </div>
    );
  }
}
