declare namespace __esriConfigApps {
  //----------------------------------
  //
  //  Info
  //
  //----------------------------------

  type InfoItemType = "list" | "explanation";

  interface Info extends __esri.Widget {
    new (widgetProperties: any);
  }

  interface InfoViewModel extends __esri.Accessor {
    new (widgetProperties: any);
  }

  interface InfoItem extends __esri.Accessor {
    new (widgetProperties: any);
  }

  export class Info extends __esri.Widget {
    constructor(value?: any);
    view: __esri.MapView | __esri.SceneView;
    infoContent: __esri.Collection<InfoItem>;
    expandWidget: __esri.Expand;
    selectedItemIndex?: number;
    iconClass?: string;
    label: string;
    viewModel?: InfoViewModel;
  }

  export class InfoViewModel extends __esri.Accessor {
    constructor(value?: any);
    view: __esri.MapView | __esri.SceneView;
    selectedItemIndex?: number;
    expandWidget: __esri.Expand;
    infoContent?: __esri.Collection<InfoItem>;
  }

  export class InfoItem extends __esri.Accessor {
    constructor(value?: any);
    type: string;
    title: string;
    infoContentItems: string[];
  }

  //----------------------------------
  //
  //  Screenshot
  //
  //----------------------------------

  interface Screenshot extends __esri.Widget {
    new (widgetProperties: any);
  }

  interface ScreenshotViewModel extends __esri.Accessor {
    new (widgetProperties: any);
  }

  export class Screenshot extends __esri.Widget {
    constructor(value?: any);
    view: __esri.MapView | __esri.SceneView;
    includeLegendInScreenshot?: boolean;
    includePopupInScreenshot?: boolean;
    enableLegendOption?: boolean;
    enablePopupOption?: boolean;
    screenshotModeIsActive?: boolean;
    iconClass?: string;
    label: string;
    viewModel?: ScreenshotViewModel;
  }

  export class ScreenshotViewModel extends __esri.Accessor {
    constructor(value?: any);
    view: __esri.MapView | __esri.SceneView;
    previewIsVisible?: boolean;
    screenshotModeIsActive?: boolean;
    includeLegendInScreenshot?: boolean;
    includePopupInScreenshot?: boolean;
    enableLegendOption?: boolean;
    enablePopupOption?: boolean;
    dragHandler?: any;
  }

  //----------------------------------
  //
  //  Share
  //
  //----------------------------------

  interface Share extends __esri.Widget {
    new (widgetProperties: any);
  }

  interface ShareViewModel extends __esri.Accessor {
    new (widgetProperties: any);
  }

  interface ShareFeatures extends __esri.Accessor {
    new (widgetProperties: any);
  }

  interface ShareItem extends __esri.Accessor {
    new (widgetProperties: any);
    id: string;
    name: string;
    className: string;
    urlTemplate: string;
  }

  export class Share extends __esri.Widget {
    constructor(value?: any);
    new(widgetProperties: any);
    view: __esri.MapView | __esri.SceneView;
    shareModelOpened?: boolean;
    shareItems?: __esri.Collection<ShareItem>;
    shareFeatures?: ShareFeatures;
    shareUrl?: string;
    label: string;
    iconClass?: string;
    viewModel?: ShareViewModel;
  }

  export class ShareViewModel extends __esri.Accessor {
    view: __esri.MapView | __esri.SceneView;
    shareItems?: __esri.Collection<ShareItem>;
    shareFeatures?: __esriConfigApps.ShareFeatures;
    shareUrl?: string;
  }

  export class ShareFeatures extends __esri.Widget {
    constructor(value?: any);
    copyToClipboard: boolean;
    shareServices: boolean;
    embedMap: boolean;
    shortenLink: boolean;
  }

  export class ShareItem extends __esri.Accessor {
    constructor(value?: any);
    id: string;
    name: string;
    className: string;
    urlTemplate: string;
  }
}

declare module "Components/Share/Share" {
  const Share: __esriConfigApps.Share;
  export = Share;
}

declare module "Components/Share/Share/ShareViewModel" {
  const ShareViewModel: __esriConfigApps.ShareViewModel;
  export = ShareViewModel;
}

declare module "Components/Share/Share/ShareFeatures" {
  const ShareFeatures: __esriConfigApps.ShareFeatures;
  export = ShareFeatures;
}

declare module "Components/Share/Share/ShareItem" {
  const ShareItem: __esriConfigApps.ShareItem;
  export = ShareItem;
}

declare module "Components/Screenshot/Screenshot" {
  const Screenshot: __esriConfigApps.Screenshot;
  export = Screenshot;
}

declare module "Components/Screenshot/Screenshot/ScreenshotViewModel" {
  const ScreenshotViewModel: __esriConfigApps.ScreenshotViewModel;
  export = ScreenshotViewModel;
}

declare module "Components/Info/Info" {
  const Info: __esriConfigApps.Info;
  export = Info;
}

declare module "Components/Info/Info/InfoItem" {
  const InfoItem: __esriConfigApps.InfoItem;
  export = InfoItem;
}

declare module "Components/Info/Info/InfoViewModel" {
  const InfoViewModel: __esriConfigApps.InfoViewModel;
  export = InfoViewModel;
}
