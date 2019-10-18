export class Renderer {
  id: string;
  constructor(id: string) {
    this.id = id.indexOf("#") !== -1 ? id.substr(1) : id;
  }
  private prepareHandle(handleNr: number) {
    const offset = handleNr === 1 ? 0 : "100%";
    const html = `<div class="${this.id}-handle${handleNr} el-slider-handle${handleNr}" id="${this.id}-handle${handleNr}" data-parent-id="${this.id}" style="left: ${offset}">
    <span class="${this.id}-handle1-indicator el-slider-handle${handleNr}-indicator" id="${this.id}-handle${handleNr}-indicator"></span>
    </div>`;
    return html;
  }

  private prepareMarkup() {
    const handle1 = this.prepareHandle(1),
      handle2 = this.prepareHandle(2);
    const html = `<div class="el-slider-wrap" > 
      <div id="${this.id}-el-slider" class="el-slider ${this.id}-el-slider">${handle1}${handle2}</div> 
      <div id="${this.id}-value1" class="el-slider-value ${this.id}-value"></div > 
      <div id="${this.id}-value2" class="el-slider-value ${this.id}-value" > 
      </div>
      </div>`;
    return html;
  }
  public renderMarkup() {
    const html = this.prepareMarkup(),
      wrapper = document.querySelector("#" + this.id);

    if (wrapper) {
      wrapper.innerHTML = html;
    }
  }
}
