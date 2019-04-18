# Configurable App Components

[![npm version][npm-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/@esri/configurable-app-components.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/configurable-app-components

Custom 4.x widgets built with the ArcGIS API for JavaScript.

## Components

Each component directory contains general instructions on how to use the corresponding component.

1. Info: Panel that displays customized string content in a list or paragraph form ([Sample App](https://jsapi.maps.arcgis.com/apps/InteractiveLegend/index.html?appid=c6be720af9cd4fe5a81c9016e3554fea)).

2. Screenshot: Tool which provides the capability of taking screenshots of the map view/scene view. Optionally, include the legend or pop-up with the map screenshot ([Sample App](https://jsapi.maps.arcgis.com/apps/InteractiveLegend/index.html?appid=c6be720af9cd4fe5a81c9016e3554fea)).

3. Share: Dialogue that provides the capability of sharing a web application of the current map extent across customized social sharing platforms i.e. Facebook, Twitter, LinkedIn, or E-mail ([Sample App](https://jsapi.maps.arcgis.com/apps/Media/index.html?appid=5fd207b452cb454bac9fff9f889bcd3e)).

## Requirements

- ArcGIS API for JavaScript 4.x
- Node
- Web browser with access to the Internet
- Your favorite IDE

## Install via npm

`npm i @esri/configurable-app-components`

## Typings

Include in tsconfig.json:

`./node_modules/@esri/configurable-app-components/index.d.ts`

## Dojo config example

```
  const config = {
    async: true,
    locale: dojoLocale,
    packages: [
      {
        name: "Components",
        location: `${appPath}/node_modules/@esri/configurable-app-components`
      }
    ]
  };
```

## Importing module into project

Naming convention: `Components/[component_name]/[component_name]`

### Example:

```
import Share = require("Components/Share/Share");

import ShareItem = require("Components/Share/Share/ShareItem");
```

### Namespace

After linking the typings file to your tsconfig.json, you can use the `__esriConfigApps` namespace for the types.

### Adding CSS

Don't forget to link to the corresponding CSS file.

`./node_modules/@esri/configurable-app-components/[component_name]/[component_name]/css/[component_name].css`

```
<link rel="stylesheet"
    href="./node_modules/@esri/configurable-app-components/Screenshot/Screenshot/css/Screenshot.css">
```

## Resources

- [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
- [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
- [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2019 Esri

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
