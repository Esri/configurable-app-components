// esri.core
import Accessor = require("esri/core/Accessor");
import Collection = require("esri/core/Collection");

// esri.core.accessorSupport
import { subclass, property } from "esri/core/accessorSupport/decorators";

// esri.views
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

//esri.geometry
import Point = require("esri/geometry/Point");

// esri.request
import esriRequest = require("esri/request");

// Share Item
import ShareItem = require("./ShareItem");

// Share Feature
import ShareFeatures = require("./ShareFeatures");

// esri.geometry
import projection = require("esri/geometry/projection");
import SpatialReference = require("esri/geometry/SpatialReference");

//----------------------------------
//
//  Share Item Collection
//
//----------------------------------
const ShareItemCollection = Collection.ofType<ShareItem>(ShareItem);

//----------------------------------
//
//  Default Share Items
//
//----------------------------------
const FACEBOOK_ITEM = new ShareItem({
  id: "facebook",
  name: "Facebook",
  urlTemplate: "https://facebook.com/sharer/sharer.php?s=100&u={url}"
});
const TWITTER_ITEM = new ShareItem({
  id: "twitter",
  name: "Twitter",
  urlTemplate: "https://twitter.com/intent/tweet?text={title}&url={url}"
});
const LINKEDIN_ITEM = new ShareItem({
  id: "linkedin",
  name: "LinkedIn",
  urlTemplate:
    "https://linkedin.com/sharing/share-offsite/?url={url}&title={title}"
});
const EMAIL_ITEM = new ShareItem({
  id: "email",
  name: "E-mail",
  urlTemplate: "mailto:?subject={title}&body={summary}%20{url}"
});

//----------------------------------
//
//  Shorten URL API
//
//----------------------------------
const SHORTEN_API = "https://arcg.is/prod/shorten";

//----------------------------------
//
//  State
//
//----------------------------------
type State = "ready" | "loading" | "shortening" | "projecting" | "disabled";

@subclass("ShareViewModel")
class ShareViewModel extends Accessor {
  //----------------------------------
  //
  //  Lifecycle
  //
  //----------------------------------

  destroy() {
    this.shareItems.removeAll();
    this.view = null;
  }

  //----------------------------------
  //
  //  Private Variables
  //
  //----------------------------------

  // To keep track of widget state
  private _shortening = false;
  private _projecting = false;

  //----------------------------------
  //
  //  state - readOnly
  //
  //----------------------------------
  @property({
    dependsOn: ["view.ready"],
    readOnly: true
  })
  get state(): State {
    const ready = this.get("view.ready");
    return ready
      ? this._projecting
        ? "projecting"
        : this._shortening
        ? "shortening"
        : "ready"
      : this.view
      ? "loading"
      : "disabled";
  }

  //----------------------------------
  //
  //  embedCode - readOnly
  //
  //----------------------------------
  @property({
    dependsOn: ["shareUrl"],
    readOnly: true
  })
  get embedCode(): string {
    return `<iframe src="${this.shareUrl}" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>`;
  }

  //----------------------------------
  //
  //  Properties
  //
  //----------------------------------

  //----------------------------------
  //
  //  view
  //
  //----------------------------------
  @property() view: MapView | SceneView = null;

  //----------------------------------
  //
  // shareModalOpened
  //
  //----------------------------------
  @property() shareModalOpened: boolean = null;

  //----------------------------------
  //
  //  shareItems
  //
  //----------------------------------
  @property({
    type: ShareItemCollection
  })
  shareItems: Collection<ShareItem> = new ShareItemCollection([
    FACEBOOK_ITEM,
    TWITTER_ITEM,
    LINKEDIN_ITEM,
    EMAIL_ITEM
  ]);

  //----------------------------------
  //
  //  shareFeatures
  //
  //----------------------------------
  @property({
    type: ShareFeatures
  })
  shareFeatures = new ShareFeatures();

  //----------------------------------
  //
  //  shareUrl - readOnly
  //
  //----------------------------------
  @property({ readOnly: true })
  shareUrl: string = null;

  //----------------------------------
  //
  //  Public Methods
  //
  //----------------------------------
  async generateUrl(): Promise<string> {
    const url = await this._generateShareUrl();
    const { shortenLink } = this.shareFeatures;
    if (shortenLink) {
      const shortenedUrl = await this._shorten(url);
      this._set("shareUrl", shortenedUrl);
      return shortenedUrl;
    }
    this._set("shareUrl", url);
    return url;
  }

  //----------------------------------
  //
  //  Private Methods
  //
  //----------------------------------
  private async _generateShareUrl(): Promise<string> {
    const { href } = window.location;
    // If view is not ready
    if (!this.get("view.ready")) {
      return href;
    }
    // Use x/y values and the spatial reference of the view to instantiate a geometry point
    const { x, y } = this.view.center;
    const { spatialReference } = this.view;
    const centerPoint = new Point({
      x,
      y,
      spatialReference
    });
    // Use pointToConvert to project point. Once projected, pass point to generate the share URL parameters
    const point = await this._processPoint(centerPoint);
    return this._generateShareUrlParams(point);
  }

  private async _processPoint(point: Point): Promise<__esri.Point> {
    const { isWGS84, isWebMercator } = point.spatialReference;
    // If spatial reference is WGS84 or Web Mercator, use longitude/latitude values to generate the share URL parameters
    if (isWGS84 || isWebMercator) {
      return point;
    }
    // Check if client side projection is not supported
    if (!projection.isSupported()) {
      const point = new Point({
        x: null,
        y: null
      });
      return point;
    }
    const outputSpatialReference = new SpatialReference({
      wkid: 4326
    });
    this._projecting = true;
    this.notifyChange("state");
    await projection.load();
    const projectedPoint = projection.project(
      point,
      outputSpatialReference
    ) as __esri.Point;
    this._projecting = false;
    this.notifyChange("state");
    return projectedPoint;
  }

  private _generateShareUrlParams(point: Point): string {
    const { href } = window.location;
    const { longitude, latitude } = point;
    if (longitude === undefined || latitude === undefined) {
      return href;
    }
    const roundedLon = this._roundValue(longitude);
    const roundedLat = this._roundValue(latitude);
    const { zoom } = this.view;
    const roundedZoom = this._roundValue(zoom);
    const path = href.split("center")[0];
    // If no "?", then append "?". Otherwise, check for "?" and "="
    const sep =
      path.indexOf("?") === -1
        ? "?"
        : path.indexOf("?") !== -1 && path.indexOf("=") !== -1
        ? "&"
        : "";
    const shareParams = `${path}${sep}center=${roundedLon},${roundedLat}&level=${roundedZoom}`;
    const type = this.get("view.type");
    // Checks if view.type is 3D, if so add, 3D url parameters
    if (type === "3d") {
      const { camera } = this.view as SceneView;
      const { heading, fov, tilt } = camera;
      const roundedHeading = this._roundValue(heading);
      const roundedFov = this._roundValue(fov);
      const roundedTilt = this._roundValue(tilt);
      return `${shareParams}&heading=${roundedHeading}&fov=${roundedFov}&tilt=${roundedTilt}`;
    }

    // Otherwise, just return original url parameters for 2D
    return shareParams;
  }

  private async _shorten(url: string): Promise<string> {
    this._shortening = true;
    this.notifyChange("state");
    const request = await esriRequest(SHORTEN_API, {
      query: {
        longUrl: url,
        f: "json"
      }
    });
    this._shortening = false;
    this.notifyChange("state");
    const shortUrl = request.data && request.data.data && request.data.data.url;
    if (shortUrl) {
      return shortUrl;
    }
  }

  private _roundValue(val: number): number {
    return parseFloat(val.toFixed(4));
  }
}

export = ShareViewModel;
