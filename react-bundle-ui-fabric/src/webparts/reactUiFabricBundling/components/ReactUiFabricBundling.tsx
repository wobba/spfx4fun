import * as React from 'react';
import styles from './ReactUiFabricBundling.module.scss';
import { IReactUiFabricBundlingProps } from './IReactUiFabricBundlingProps';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { loadStyles } from '@microsoft/load-themed-styles';

export default class ReactUiFabricBundling extends React.Component<IReactUiFabricBundlingProps, void> {
  // Added constructor to load and process CSS async
  constructor() {
    super();
    this.loadCss();
  }

  public async loadCss() {
    // Check if custom Fabric CSS is loaded
    if (window["UIFabricLoaded"]) {
      return;
    }
    window["UIFabricLoaded"] = true;

    // Load Fabric CSS from CDN
    let fabricCSSUrl = 'https://publiccdn.sharepointonline.com/techmikael.sharepoint.com/11510075fe4212d19d3e6d07c91981263dd697bf111cb1e5f0efb15de0ec08b382cde399/5.0.1/office-ui-fabric.min.css';
    const response = await fetch(fabricCSSUrl, { mode: 'cors' });
    if (response.ok) {
      response.text().then((data: string) => {
        // Process theme tokens
        loadStyles(data);
        // Reload webpart
        this.forceUpdate();
      });
    }
  }

  public render(): React.ReactElement<IReactUiFabricBundlingProps> {
    // Don't render until CSS is loaded
    if (!window["UIFabricLoaded"]) {
      return <span></span>;
    }

    return (
      <div className={styles.reactUiFabricBundling}>
        <div className={styles.container}>
          {/* Site theme */}
          <div className={`pzl-Grid-row pzl-bgColor-themeDarkAlt pzl-fontColor-white ${styles.row}`}>
            <div className="pzl-Grid-col pzl-u-lg10 pzl-u-xl8 pzl-u-xlPush2 pzl-u-lgPush1">
              <DefaultButton text="This block is Site themed" />
            </div>
          </div>
          {/* Tenant theme */}
          <div className={`ms-Grid-row ms-bgColor-themeDarkAlt ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <DefaultButton text="This block is Tenant themed" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}