import { Renderer } from "./Renderer";
import { Actions } from "./Actions";
import { Options } from "./InterfaceOptions";
import "./style.css";

export class ElemSlider {
  private opts: Options;
  private id: string;

  constructor(elemId: string, params: Options) {
    this.id = elemId.indexOf("#") !== -1 ? elemId.substr(1) : elemId;
    //  this.opts = { ...defaults, ...params };
    this.opts = { ...params };
    const el = document.getElementById(this.id);
    if (el) {
      const renderer = new Renderer(this.id);
      renderer.renderMarkup();
      const actions = new Actions(this.id, { ...this.opts });
    } else {
      console.log(`Element with id: #${this.id} does not exist`);
    }
  }
  public printOptions(): void {
    console.log(this.opts);
    console.log(this.id);
  }
}
