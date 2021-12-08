import { messageBundle, tsx } from "esri/widgets/support/widget";
import { subclass, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { on, whenOnce, whenTrueOnce } from "esri/core/watchUtils";
const base = "esri-page";

const CSS = {
  base,
  title: `${base}__title-text`,
  subtitle: `${base}__subtitle-text`,
  textContainer: `${base}__text-container`,
  scrollContainer: `${base}__scroll-container`,
  scrollText: `${base}__scroll-text`,
  backToCoverPage: `${base}__back-to-cover-page`
};

interface BackgroundImageStyles {
  backgroundImage: string;
  backgroundSize: string;
  backgroundColor: string;
}

@subclass("Page")
class Page extends Widget {
  constructor(props: any) {
    super(props);
  }

  private _token: string = null;

  @property()
  showScrollTop = true;

  @property()
  title = null;

  @property()
  titleColor = null;

  @property()
  subtitle = null;

  @property()
  subtitleColor = null;

  @property()
  background = null;

  @property()
  buttonText = null;

  @property()
  isVisible = true;

  @property()
  buttonTextColor = null;

  @property()
  portal: __esri.Portal = null;

  @property()
  @messageBundle(
    "node_modules/@esri/configurable-app-components/Page/t9n/resources"
  )
  messages = null;

  postInitialize() {
    this._handleDefaultMessages();
    this._handleDocBodyStyles();
    this._addPageToBody();
    this.own([
      whenTrueOnce(this, "showScrollTop", () => {
        this._handleShowScrollTop();
      }),
      whenOnce(this, "portal.credential.token", () => {
        this._handleBackgroundImgToken();
        this.own([on(this.portal, "credential", "token-change", () => {
          this._handleBackgroundImgToken();
        })]);
      })
    ]);
  }

  destroy() {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "0";
    document.body.style.transition = "none";
  }

  render() {
    const textContainer = this._renderTextContainer();
    const scrollContainer = this._renderScrollContainer();
    const styles = this.background?.backgroundType === "image"
    ? this._getBackgroundStyles()
    : {
      backgroundColor: this.background?.backgroundColor
        ? this.background?.backgroundColor
        : "#0079c1",
      backgroundImage: "unset"
    };
    return (
      <div
        class={CSS.base}
        styles={styles}
      >
        {textContainer}
        {scrollContainer}
      </div>
    );
  }

  private _renderTextContainer() {
    const { title, titleColor, subtitle, subtitleColor } = this;
    return (
      <div class={CSS.textContainer}>
        <h1 class={CSS.title} style={`color:${titleColor}`}>
          {title}
        </h1>
        <span class={CSS.subtitle} style={`color:${subtitleColor}`}>
          {subtitle}
        </span>
      </div>
    );
  }

  private _renderScrollContainer() {
    return (
      <div class={CSS.scrollContainer}>
        <button
          onclick={this._handleScroll.bind(this)}
          aria-label={this.buttonText}
          title={this.buttonText}
          style={`color:${this.buttonTextColor}`}
        >
          <span class={CSS.scrollText}>{this.buttonText}</span>
          <calcite-icon icon="chevron-down" style={`color:${this.buttonTextColor}`} scale="l" />
        </button>
      </div>
    );
  }

  private _addPageToBody(): void {
    document.body.insertBefore(
      this.container as HTMLElement,
      document.body.childNodes[0]
    );
  }

  private _handleDefaultMessages(): void {
    const { title, subtitle, buttonText } = this.messages;
    if (!this.title) {
      this.title = title;
    }
    if (!this.subtitle) {
      this.subtitle = subtitle;
    }
    if (!this.buttonText) {
      this.buttonText = buttonText;
    }
  }

  private _handleDocBodyStyles(): void {
    document.documentElement.style.overflowX = "unset";
    document.documentElement.style.overflowY = "unset";
    document.documentElement.style.overflow = "unset";
    document.body.style.display = "block";
    document.body.style.overflowX = "unset";
    document.body.style.overflowY = "unset";
    document.body.style.overflow = "hidden";
    document.body.style.position = "relative";
    document.body.style.top = "0";
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      document.body.style.transition = "";
    } else {
      document.body.style.transition = "top 0.5s ease 0s";
    }
  }

  private _handleShowScrollTop(): void {
    const fabElement = document.createElement("calcite-fab") as any;
    fabElement.classList.add(CSS.backToCoverPage);
    fabElement.icon = "chevron-up";
    fabElement.textEnabled = true;
    const { backToCoverPage } = this.messages;
    fabElement.label = backToCoverPage;
    fabElement.title = backToCoverPage;
    fabElement.onclick = () => {
      this._scrollBackToCoverPage();
    };
    document.body.appendChild(fabElement);
  }

  private _scrollBackToCoverPage(): void {
    document.body.style.top = "0";
    this.set("isVisible", true);
  }

  private _handleScroll(): void {
    document.body.style.top = "-100%";
    this.set("isVisible", false);
  }

  private _handleBackgroundImgToken(): void {
    this._token = this.portal.get(
      "credential.token"
    ) as string;
    this.scheduleRender();
  }

  private _getBackgroundStyles(): BackgroundImageStyles {
    const { backgroundImage } = this.background;
    const backgroundImageVal = backgroundImage?.url
      ? this._token
        ? `url('${backgroundImage?.url}?token=${this._token}')`
        : `url('${backgroundImage?.url}')`
      : "none";
    return {
      backgroundImage: backgroundImageVal,
      backgroundSize: "cover",
      backgroundColor: backgroundImage ? "unset" : this.background?.backgroundColor ? this.background.backgroundColor : "#0079c1"
    };
  }
}

export = Page;
