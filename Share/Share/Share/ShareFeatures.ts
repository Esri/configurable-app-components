/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";
import Accessor = require("esri/core/Accessor");

@subclass("ShareFeatures")
class ShareFeatures extends declared(Accessor) {
  @property({ value: true })
  set copyToClipboard(value: boolean) {
    if (!this.shareServices) {
      console.error(
        "ERROR: Unable to toggle both Share Item AND Copy URL features off."
      );
      return;
    }
    this._set("copyToClipboard", value);
  }

  @property({ value: true })
  set shareServices(value: boolean) {
    if (!this.copyToClipboard) {
      console.error(
        "ERROR: Unable to toggle both Share Item AND Copy URL features off."
      );
      return;
    }
    this._set("shareServices", value);
  }

  @property() embedMap = true;

  @property() shortenLink = true;
}

export = ShareFeatures;
