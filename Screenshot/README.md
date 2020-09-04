# screenshot-widget

Screenshot widget built with the ArcGIS API for Javascript version 4.x and html2canvas.

More info on html2canvas can be found here: http://html2canvas.hertzen.com/

![Interactive Legend Preview](images/screenshot-widget.png)

## Screenshot

### Constructor:

#### new **Screenshot(_properties?_)**

##### Property Overview:

| Name                         | Type                                    | Summary                                                                                                                                                                                               |
| ---------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| view \*                      | MapView \| SceneView                    | A reference to the `MapView` or `SceneView`                                                                                                                                                           |
| viewModel                    | ScreenshotViewModel                     | View model for this widget.                                                                                                                                                                           |
| label                        | String                                  | The widget's default label.                                                                                                                                                                           |
| iconClass                    | String                                  | Expand widget icon class.                                                                                                                                                                             |
| screenshotModeIsActive \*    | Boolean                                 | Boolean which indicates if the widget is in screenshot mode.                                                                                                                                          |
| enableLegendOption \*        | Boolean                                 | Boolean to include legend option for user to include/exclude in screenshot.                                                                                                                           |
| enablePopupOption \*         | Boolean                                 | Boolean to include pop-up option for user to include/exclude in screenshot.                                                                                                                           |
| includeLegendInScreenshot \* | Boolean                                 | Boolean to include/exclude legend in screenshot.                                                                                                                                                      |
| includePopupInScreenshot \*  | Boolean                                 | Boolean to include/exclude pop-up in screenshot.                                                                                                                                                      |
| includeCustomInScreenshot \* | Boolean                                 | Boolean to include/exclude custom element in screenshot. This property requires a value for the `custom` property to be passed in.                                                                    |
| includeCustomInScreenshot \* | Boolean                                 | Boolean to include/exclude custom element in screenshot. This property requires a value for the `custom` property to be passed in.                                                                    |
| custom \*                    | { label: string; element: HTMLElement } | HTML Element to include in screenshot output. `custom.label` will be used for the checkbox input label. `custom.element` will be used to pass into html2canvas to include in final screenshot output. |
| outputLayout \*              | "horizontal" \| "vertical"              | Option to set layout of screenshot output to a horizontal or vertical layout. `Default: "horizontal"`                                                                                                 |
| includeLayoutOption          | Boolean                                 | Render option to allow end-user to select screenshot layout output.                                                                                                                                   |
| featureWidget \* `read-only` | Feature                                 | Feature Widget containing pop-up node to include in screenshot.                                                                                                                                       |
| legendWidget \* `read-only`  | Legend                                  | Legend Widget containing map legend node to include in screenshot.                                                                                                                                    |

\* = aliased

## ScreenshotViewModel

### Constructor:

#### new **ScreenshotViewModel(_properties?_)**

##### Property Overview:

| Name                      | Type                                    | Summary                                                                                                                                                                                               |
| ------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| view                      | MapView \| SceneView                    | A reference to the `MapView` or `SceneView`                                                                                                                                                           |
| previewIsVisible          | Boolean                                 | Boolean which indicates if the image preview panel is visible.                                                                                                                                        |
| screenshotModeIsActive    | Boolean                                 | Boolean which indicates if the widget is in screenshot mode.                                                                                                                                          |
| dragHandler               | any                                     | Drag handler event.                                                                                                                                                                                   |
| state                     | String                                  | State of this widget. Possible values are: `ready`, `takingScreenshot`, `complete`, `disabled`                                                                                                        |
| enableLegendOption        | Boolean                                 | Boolean to include legend option for user to include/exclude in screenshot.                                                                                                                           |
| enablePopupOption         | Boolean                                 | Boolean to include pop-up option for user to include/exclude in screenshot.                                                                                                                           |
| includeLegendInScreenshot | Boolean                                 | Boolean to include/exclude legend in screenshot.                                                                                                                                                      |
| includePopupInScreenshot  | Boolean                                 | Boolean to include/exclude pop-up in screenshot.                                                                                                                                                      |
| includeCustomInScreenshot | Boolean                                 | Boolean to include/exclude custom element in screenshot. Custom property required.                                                                                                                    |
| custom                    | { label: string; element: HTMLElement } | HTML Element to include in screenshot output. `custom.label` will be used for the checkbox input label. `custom.element` will be used to pass into html2canvas to include in final screenshot output. |
| outputLayout              | "horizontal" \| "vertical"              | Option to set layout of screenshot output to a horizontal or vertical layout. `Default: "horizontal"`                                                                                                 |
| featureWidget `read-only` | Feature                                 | Instance of the Feature widget.                                                                                                                                                                       |
| legendWidget `read-only`  | Legend                                  | Instance of the Legend widget.                                                                                                                                                                        |

### **Example usage:**

```
const screenshot = new Screenshot({
  view: this.view,
  enableLegendOption: true,
  enablePopupOption: true,
  includeLegendInScreenshot: true,
  includePopupInScreenshot: false
});
```

### **Advanced usage:**

```
const sidePanel = document.querySelector(".scrollable-content");
const screenshot = new Screenshot({
  view: this.view,
  container: document.createElement("div"),
  enableLegendOption: true,
  enablePopupOption: true,
  custom: {
    label: "Include results",
    element: sidePanel
  },
  outputLayout: "column",
  includeLayoutOption: true
  });
```

A few things to note:

Uses Esri Calcite Components: https://github.com/Esri/calcite-components

Uses ArcGIS JS API:

https://js.arcgis.com/4.16/

https://js.arcgis.com/4.16/esri/css/main.css

Insert Screenshot styles as last stylesheet

If Expand widget is used, please use similar logic in app to watch expanded property:

```
watchUtils.whenFalse(expandWidget, "expanded", () => {
    if (screenshotWidget.screenshotModeIsActive) {
      screenshotWidget.screenshotModeIsActive = false;
    }
  });
```

Please see which CSS properties are supported in html2Canvas here:
http://html2canvas.hertzen.com/features

Due to html2Canvas limitations in IE11, please include a Promise polyfill.

## Features:

1.  `MapView` and `SceneView` compatability
2.  Take a screenshot of the `MapView` or `SceneView`
3.  Include screenshots of map components i.e. Legend or Popup

## Instructions

1. Fork and then clone the repo.
2. Include widget in your sample app.
3. Compile typescript and scss files.
4. Run on local web server.

## Requirements

- Notepad or your favorite HTML editor
- Web browser with access to the Internet

## Resources

- [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
- [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
- [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2020 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](LICENSE) file.
