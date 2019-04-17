// Copyright 2019 Esri

// Licensed under the Apache License, Version 2.0 (the "License");

// you may not use this file except in compliance with the License.

// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software

// distributed under the License is distributed on an "AS IS" BASIS,

// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

// See the License for the specific language governing permissions and

// limitations under the License.​

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
