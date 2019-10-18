import { Options } from "./InterfaceOptions";
import { mapRange, roundTo } from "./Helpers";
const defaults: Options = {
  isRangeSlider: true,
  outputId: "el-slider1-value1",
  start: 0,
  end: 100,
  range: 1200,
  step: 10,
  value: 0,
  offset: 0,
  sliderWidth: 300,
  sliderHeight: 10,
  offsetWidth: 0,
  currentHandle: {
    id: "",
    elem: <HTMLElement>document.getElementById("output1-handle1"),
    posX: 0,
    leftOffset: 0,
    width: 20,
    height: 20
  },

  handle1: {
    posX: 0,
    limit: 0,
    id: "",
    start: 0,
    end: 100,
    width: 20,
    height: 20
  },

  handle2: {
    posX: 0,
    limit: 0,
    id: "",
    start: 100,
    end: 100,
    width: 20,
    height: 20
  }
};

export class Actions {
  id: string;
  private opts: Options;
  EVstart: string;
  EVmove: string;
  EVend: string;
  canmoveHandle: boolean;
  handle1Elem: HTMLElement;
  handle2Elem: HTMLElement;
  constructor(id: string, params: any) {
    this.opts = {
      ...defaults,
      ...params
    };
    this.id = id.indexOf("#") !== -1 ? id.substr(1) : id;
    this.canmoveHandle = false;
    this.EVstart =
      "ontouchstart" in document.documentElement ? "touchstart" : "mousedown";
    this.EVmove =
      "ontouchstart" in document.documentElement ? "touchmove" : "mousemove";
    this.EVend =
      "ontouchstart" in document.documentElement ? "touchend" : "mouseup";
    const elem = <HTMLElement>(
      document.querySelector("#" + this.id + " .el-slider")
    );

    this.handle1Elem = <HTMLElement>(
      document.getElementById(`${this.id}-handle1`)
    );
    this.handle2Elem = <HTMLElement>(
      document.getElementById(`${this.id}-handle2`)
    );
    this.setupEvents(elem);
    this.setupOptions();
    this.updateValue(true);
  }

  /*=============================================
  =            Setup options            =
  =============================================*/

  private setupOptions = () => {
    const elId = "#" + this.id + "-el-slider";
    const el = <HTMLElement>document.querySelector(elId);
    this.opts.sliderWidth = <number>el.offsetWidth;
    this.opts.offsetWidth = el.offsetWidth;
    this.opts.sliderHeight = el.offsetHeight;
  };

  /*=============================================
  =           SETUP EVENTS           =
  =============================================*/

  private setupEvents = (elem: HTMLElement) => {
    // EVENT START DRAG
    elem.addEventListener(
      this.EVstart,
      event => {
        event.preventDefault();
        this.drag(event);
        return false;
      },
      false
    );
    // EVENT END
    document.addEventListener(
      this.EVend,
      () => {
        return (this.canmoveHandle = false);
      },
      false
    );
    // EVENT SNAP HANDLE
    document.addEventListener(
      this.EVstart,
      (event: any) => {
        this.snapHandle(event);
        return (this.canmoveHandle = true);
      },
      false
    );
  };
  /*=============================================
=           UPDATE VALUE         =
=============================================*/
  private updateValue(isInit: boolean = false) {
    if (isInit) {
      const output1 = document.getElementById(this.id + "-value1"),
        output2 = document.getElementById(this.id + "-value2");
      if (output1 && output2) {
        output1.innerHTML = this.opts.handle1.start.toFixed(2);
        output2.innerHTML = this.opts.range.toFixed(2);
      }
    } else {
      let v = mapRange(
        this.opts.currentHandle.leftOffset,
        0,
        this.opts.sliderWidth,
        0,
        this.opts.range
      ); // 0

      const value = roundTo(v, this.opts.step);
      this.opts.value = value;
      const output = <HTMLElement>document.getElementById(this.opts.outputId);
      output.innerHTML = this.opts.value.toFixed(2);
    }
  }
  /*=============================================
  =           CALC HANDLE POSITION           =
  =============================================*/

  private calculateHandlePostion = (event: any) => {
    const handleTag = event.target;
    const targetId = handleTag.id;
    const outputId =
      targetId.indexOf("handle1") !== -1
        ? this.id + "-value1"
        : this.id + "-value2";
    this.opts.outputId = outputId;
    this.opts.currentHandle.elem = event.target;
    this.opts.currentHandle.id = event.target.id;
    this.opts.currentHandle.width = handleTag.offsetWidth;
    this.opts.sliderWidth = this.opts.offsetWidth;
  };

  /*=============================================
  =           DRAG         =
  =============================================*/

  private drag = (event: any) => {
    event.preventDefault();
    if (
      event.target.id === this.id + "-handle1" ||
      event.target.id === this.id + "-handle2"
    ) {
      this.calculateHandlePostion(event);
      document.addEventListener(this.EVmove, this.move, false);
    }
  };
  /*=============================================
=           DROP       =
=============================================*/

  private drop = () => {
    document.removeEventListener(this.EVmove, this.move, false);
    document.removeEventListener(this.EVend, this.drop, false);
  };

  /*=============================================
  =           MOVE       =
  =============================================*/
  private move = (event: any) => {
    document.addEventListener(
      this.EVend,
      () => {
        document.removeEventListener(this.EVmove, this.move, false);
        document.removeEventListener(this.EVend, this.drop, false);
      },
      false
    );

    const clientX =
      "ontouchstart" in document.documentElement
        ? event.touches[0].clientX
        : event.clientX;
    this.opts.currentHandle.leftOffset = clientX - this.opts.currentHandle.posX;

    // Fix for left edge
    if (this.opts.currentHandle.leftOffset < 0) {
      this.opts.currentHandle.leftOffset = 0;
    }
    // Fix for right edge
    if (
      this.opts.currentHandle.leftOffset - this.opts.currentHandle.width >=
      this.opts.sliderWidth - this.opts.currentHandle.width
    ) {
      this.opts.currentHandle.leftOffset = this.opts.sliderWidth;
    }
    // If handle should be moved
    if (this.canmoveHandle) {
      this.moveHandle(event.target.id);

      if (this.opts.isRangeSlider) {
        this.limitOppositeHandles(this.id);
      }
    }
  };
  /*=============================================
  =          MOVE HANDLE     =
  =============================================*/

  private moveHandle = (handleId: string) => {
    const handle = this.opts.currentHandle.elem;
    handle.style.left = this.opts.currentHandle.leftOffset + "px";
    this.updateValue();
  };

  /*=============================================
  =         GARDS FOR LIMITNG OPOSITE HANDLES    =
  =============================================*/
  private limitOppositeHandles = (sliderId: string) => {
    const handle = this.opts.currentHandle.elem;

    this.opts.handle1.limit = this.handle1Elem.offsetLeft;
    this.opts.handle2.limit = this.handle2Elem.offsetLeft;
    this.opts.handle1.posX = this.handle1Elem.offsetLeft;
    this.opts.handle2.posX = this.handle2Elem.offsetLeft;

    if (this.opts.currentHandle.id.indexOf("handle1") !== -1) {
      if (this.opts.handle1.posX >= this.opts.handle2.limit) {
        handle.style.background = "red";
        this.handle1Elem.style.left = this.opts.handle1.limit + "px";
        this.handle2Elem.style.left = this.opts.handle1.limit + "px";
      }
    } else {
      if (this.opts.handle2.posX <= this.opts.handle1.limit) {
        handle.style.background = "red";
        this.handle2Elem.style.left = this.opts.handle2.limit + "px";
        this.handle1Elem.style.left = this.opts.handle2.limit + "px";
      }
    }
  };
  /*=============================================
  =          SNAP HANDLE    =
  =============================================*/
  private snapHandle = (event: any) => {
    const wrapperId = this.id + "-el-slider";
    const arr = [
      wrapperId,
      this.id + "-handle2-indicator",
      this.id + "-handle1-indicator"
    ];

    const handle1 = <HTMLElement>(
      document.querySelector("#" + this.id + " .el-slider-handle1")
    );
    const handle2 = <HTMLElement>(
      document.querySelector("#" + this.id + " .el-slider-handle2")
    );

    if (arr.indexOf(event.target.id) != -1) {
      const clientX =
        "ontouchstart" in document.documentElement
          ? event.touches[0].clientX
          : event.clientX;

      const arrowPosX: number = clientX - this.opts.offset;
      const diff1 = Math.abs(arrowPosX - this.opts.handle1.posX);
      const diff2 = Math.abs(arrowPosX - this.opts.handle2.posX);

      //------FIRST HANDLE--------
      if (diff1 < diff2) {
        handle1.style.left = arrowPosX + "px";
        this.opts.outputId = this.id + "-value1";
      } else {
        //------SECOND HANDLE--------
        const handle2Limit = this.opts.sliderWidth;
        const handle2PosX = arrowPosX;

        // ------ FIX RIGHT EDGE ----
        if (handle2PosX >= handle2Limit) {
          handle2.style.background = "pink";
          setTimeout(function() {
            handle2.style.left = "100%";
          }, 1);
        }

        handle2.style.left = arrowPosX + "px";
        this.opts.outputId = this.id + "-value2";
      }

      this.changeHandlePosAndVal(clientX);
    }
  };
  /*=============================================
  =          CHANGE HANDLE POSITON AND BALUE   =
  =============================================*/
  private changeHandlePosAndVal = (clientX: any) => {
    const val = parseInt(clientX);
    this.opts.currentHandle.leftOffset = val - this.opts.currentHandle.posX;
    this.updateValue();
  };
}
