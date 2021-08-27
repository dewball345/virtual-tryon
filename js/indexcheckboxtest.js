import {ControlSystemHelper} from './helpers/controlSys/controlSystemHelper.js';

var checkbox = document.getElementById("mCheckbox");
var checkbox1 = document.getElementById("mCheckbox1");
var slider = document.getElementById("slider1");
var dropdown = document.getElementById("mySelect");
var color = document.getElementById("color");

var track = {
    checkbox: true,
    checkbox1: true,
    slider: 0,
    dropdown:"Audi",
    color: "#000000",
};

var c = new ControlSystemHelper.checkbox({
    checkbox: checkbox, 
    mapKey: "checkbox", 
    tracker: track, 
    callback: (event) => {
        console.log("check" + track.checkbox)
    }
});

var c1 = new ControlSystemHelper.checkbox({
    checkbox: checkbox1,
    mapKey: "checkbox1",
    tracker: track,
    callback: (event) => {
        console.log("check1" + track.checkbox1)
    }
});

var s1 = new ControlSystemHelper.input({
    element: slider,
    mapKey: "slider",
    tracker: track,
    callback: (event) => {
        console.log("slider" + track.slider)
    }
});

var d1 = new ControlSystemHelper.input({
    element: dropdown,
    mapKey: "dropdown",
    tracker: track,
    callback: (event) => {
        console.log("dropdown" + track.dropdown)
    }
});

var d1 = new ControlSystemHelper.input({
    element: color,
    mapKey: "color",
    tracker: track,
    callback: (event) => {
        console.log("color" + track.color)
    }
});

