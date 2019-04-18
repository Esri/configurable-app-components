interface ShareItem {
  id: string;
  name: string;
  className: string;
  urlTemplate: string;
}

interface ShareViewModel {
  view: __esri.MapView | __esri.SceneView;
  shareItems?: __esri.Collection<ShareItem>;
  shareFeatures?: ShareFeatures;
  shareUrl?: string;
}

interface Share {
  view: __esri.MapView | __esri.SceneView;
  shareModelOpened?: boolean;
  shareItems?: __esri.Collection<ShareItem>;
  shareFeatures?: ShareFeatures;
  shareUrl?: string;
  label?: string;
  iconClass?: string;
  viewModel?: ShareViewModel;
}

interface ShareFeatures {
  copyToClipboard: boolean;
  shareServices: boolean;
  embedMap: boolean;
  shortenLink: boolean;
}

declare module "Components/Share/Share" {
  const Share: Share;
  export = Share;
}

declare module "Components/Share/Share/ShareViewModel" {
  const ShareViewModel: ShareViewModel;
  export = ShareViewModel;
}

declare module "Components/Share/Share/ShareFeatures" {
  const ShareFeatures: ShareFeatures;
  export = ShareFeatures;
}

declare module "Components/Share/Share/ShareItem" {
  const ShareItem: ShareItem;
  export = ShareItem;
}

interface ScreenshotViewModel {
  view: __esri.MapView | __esri.SceneView;
  previewIsVisible?: boolean;
  screenshotModeIsActive?: boolean;
  includeLegendInScreenshot?: boolean;
  includePopupInScreenshot?: boolean;
  enableLegendOption?: boolean;
  enablePopupOption?: boolean;
  dragHandler?: any;
}

interface Screenshot {
  view: __esri.MapView | __esri.SceneView;
  includeLegendInScreenshot?: boolean;
  includePopupInScreenshot?: boolean;
  enableLegendOption?: boolean;
  enablePopupOption?: boolean;
  screenshotModeIsActive?: boolean;
  iconClass?: string;
  label?: string;
  viewModel?: ScreenshotViewModel;
}

declare module "Components/Screenshot/Screenshot" {
  const Screenshot: Screenshot;
  export = Screenshot;
}

declare module "Components/Screenshot/Screenshot/ScreenshotViewModel" {
  const ScreenshotViewModel: ScreenshotViewModel;
  export = ScreenshotViewModel;
}

interface InfoViewModel {
  view: __esri.MapView | __esri.SceneView;
  selectedItemIndex?: number;
  expandWidget: __esri.Expand;
  infoContent?: __esri.Collection<InfoItem>;
}

interface Info {
  view: __esri.MapView | __esri.SceneView;
  infoContent: __esri.Collection<InfoItem>;
  expandWidget: __esri.Expand;
  selectedItemIndex?: number;
  iconClass?: string;
  label?: string;
  viewModel?: InfoViewModel;
}

type InfoItemType = "list" | "explanation";

interface InfoItem {
  type: InfoItemType;
  title: string;
  infoContentItems: string[];
}

declare module "Components/Info/Info" {
  const Info: Info;
  export = Info;
}

declare module "Components/Info/Info/InfoItem" {
  const InfoItem: InfoItem;
  export = InfoItem;
}

declare module "Components/Info/Info/InfoViewModel" {
  const InfoViewModel: InfoViewModel;
  export = InfoViewModel;
}
