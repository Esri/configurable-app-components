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

// esri.core.accessorSupport
import Accessor = require("esri/core/Accessor");

// InfoItemType
type InfoItemType = "list" | "explanation";

@subclass("InfoItem")
class InfoItem extends declared(Accessor) {
  // type
  @property()
  type: InfoItemType = null;

  // title
  @property()
  title: string = null;

  // infoContentItems
  @property()
  infoContentItems: string[] = null;
}

export = InfoItem;
