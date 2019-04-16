/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";
import Accessor = require("esri/core/Accessor");

@subclass("ShareItem")
class ShareItem extends declared(Accessor) {
  @property() id: string = null;

  @property() name: string = null;

  @property() className: string = null;

  @property() urlTemplate: string = null;
}

export = ShareItem;
