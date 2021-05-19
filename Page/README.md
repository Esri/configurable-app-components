# Page

### Constructor:

#### new **Page(_properties?_)**

##### Property Overview:

| Name          | Type       | Summary                                      |
| ------------- | ---------- | -------------------------------------------- |
| title         | String     | Title text.                                  |
| titleColor    | String     | Title color.                                 |
| subtitle      | String     | Subtitle text.                               |
| subtitleColor | String     | Title color.                                 |
| background    | Background | Background color or image.                   |
| buttonText    | String     | Button text.                                 |
| showScrollTop | Boolean    | Display button to scroll back to cover page. |

#### Interfaces:

```
interface Background {
    backgroundType: string;
    backgroundImage: ImageFile;
    backgroundColor: string;
}

interface ImageFile {
    name: string;
    size: number;
    type: string;
    url: string;
}
```

### **Example:**

```
const page = new Page({
    container: document.createElement("esri-page"),
    title: "Title",
    titleColor: "#ffffff",
    subtitle: "Subtitle",
    subtitleColor: "#ffffff",
    textPosition: "center-leading",
    buttonText: "Explore",
    background: {
      backgroundType: "color",
      backgroundImage: null,
      backgroundColor: "#0079c1"
    }
});
```

Load language files with t9n message bundler in app with `"esri/intl".registerMessageBundleLoader()` and `"esri/intl".createJSONLoader()`.

```
registerMessageBundleLoader(
  createJSONLoader({
    pattern: "node_modules/@esri/configurable-app-components/",
    base: "node_modules/@esri/configurable-app-components",
    location: new URL(
      "../../node_modules/@esri/configurable-app-components/Page",
      window.location.href
    )
  })
);
```
