import MapView = require("esri/views/MapView");

import SceneView = require("esri/views/SceneView");

import Collection = require("esri/core/Collection");

import Expand = require("esri/widgets/Expand");

import ShareFeatures = require("./Share/Share/ShareFeatures");

export interface ShareItem {
  id: string;
  name: string;
  className: string;
  urlTemplate: string;
}

export interface ShareViewModel {
  view: MapView | SceneView;
  shareItems?: Collection<ShareItem>;
  shareFeatures?: ShareFeatures;
  shareUrl?: string;
}

export interface Share {
  view: MapView | SceneView;
  shareModelOpened?: boolean;
  shareItems?: Collection<ShareItem>;
  shareFeatures?: ShareFeatures;
  shareUrl?: string;
  label?: string;
  iconClass?: string;
  viewModel?: ShareViewModel;
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

export interface ScreenshotViewModel {
  view: MapView | SceneView;
  previewIsVisible?: boolean;
  screenshotModeIsActive?: boolean;
  includeLegendInScreenshot?: boolean;
  includePopupInScreenshot?: boolean;
  enableLegendOption?: boolean;
  enablePopupOption?: boolean;
  dragHandler?: any;
}

export interface Screenshot {
  view: MapView | SceneView;
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

export interface InfoViewModel {
  view: MapView | SceneView;
  selectedItemIndex?: number;
  expandWidget: Expand;
  infoContent?: Collection<InfoItem>;
}

export interface Info {
  view: MapView | SceneView;
  infoContent: Collection<InfoItem>;
  expandWidget: Expand;
  selectedItemIndex?: number;
  iconClass?: string;
  label?: string;
  viewModel?: InfoViewModel;
}

type InfoItemType = "list" | "explanation";

export interface InfoItem {
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
