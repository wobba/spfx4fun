import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { Guid } from '@microsoft/sp-core-library'
import { ClientSideWebPartManager, IWebPartManagerContext, IWebPartData } from '@microsoft/sp-webpart-base';
import { DisplayMode } from '@microsoft/sp-core-library';

import { IClientSideWebPartManifest } from '@microsoft/sp-module-interfaces';

let _webPartManager: ClientSideWebPartManager;
let _sampleIdOne = "mAdcOW" + Guid.newGuid().toString();
let _sampleIdTwo = "mAdcOW" + Guid.newGuid().toString();
export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {

    public async componentDidMount(): Promise<void> {
        _webPartManager = new ClientSideWebPartManager(this.props.context.host);
        await _webPartManager.fetchWebPartManifests(); // Ensure all manifests are available
        this.addData();
    }

    private async addData() {
        // local webpart properties - in this case props for the modern script editor webpart
        let props = {
            script: "<div>Foo</div>",
            title: "The Modern Script Editor web part!",
            removePadding: false,
            spPageContextInfo: false
        }
        await this.loadWebPart("ScriptEditorWebPart", document.getElementById(_sampleIdOne), props);
        await this.loadWebPart("ScriptEditorWebPart", document.getElementById(_sampleIdTwo), props);
    }

    private async loadWebPart(alias: string, domElement: HTMLElement, webPartProperties: any) {
        let manifests = _webPartManager.getWebPartManifests();
        for (let i = 0; i < manifests.length; i++) {
            const manifest = manifests[i];
            if (manifest.alias === alias) {
                let instanceId = Guid.newGuid().toString();
                let wpManifest: IClientSideWebPartManifest<any> = manifest as IClientSideWebPartManifest<any>;
                let wpData: IWebPartData = {
                    id: wpManifest.id,
                    instanceId: instanceId,
                    title: "",
                    dataVersion: "1.0",
                    properties: webPartProperties
                };

                // Specify any as webpartLoadExtraLogInfo is not defined on the interface and has to be present
                let initialize: IWebPartManagerContext & any = {
                    domElement: domElement,
                    instanceId: instanceId,
                    manifest: wpManifest,
                    displayMode: DisplayMode.Read,
                    webPartData: wpData,
                    webpartLoadExtraLogInfo: {
                    }
                };
                await _webPartManager.loadWebPart(initialize);
            }
        }
    }

    public render(): React.ReactElement<IHelloWorldProps> {
        
        return (
            <div className={styles.helloWorld} >
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <span className={styles.title}>Dynamic loading!</span>
                            <span id={_sampleIdOne}></span>
                            <span id={_sampleIdTwo}></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
