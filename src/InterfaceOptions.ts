export interface Options {
  outputId: string;
  isRangeSlider: boolean;
  start: number;
  end: number;
  range: number;
  step: number;
  value: number;
  offset: number;
  sliderWidth: number;
  sliderHeight: number;
  offsetWidth: number;
  handle1: Handle;
  handle2: Handle;
  currentHandle: CurrentHandle;
}
interface CurrentHandle {
  id: string;
  elem: HTMLElement;
  posX: number;
  leftOffset: number;
  width: number;
  height: number;
}
interface Handle {
  posX: number;
  limit: number;
  id: string;
  start: number;
  end: number;
  width: number;
  height: number;
}
