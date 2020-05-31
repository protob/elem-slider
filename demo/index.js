import { ElemSlider } from "../dist/index.esm.js";

const opts1 = {
  start: 0,
  end: 100,
  range: 1200,
  step: 10,
};

const opts2 = {
  start: 0,
  end: 100,
  range: 1500,
  step: 100,
};
const opts3 = {
  start: 0,
  end: 100,
  range: 500,
  step: 100,
};

let slider1 = new ElemSlider("#output1", opts1);
let slider2 = new ElemSlider("#output2", opts2);
let slider3 = new ElemSlider("#output3", opts3);
