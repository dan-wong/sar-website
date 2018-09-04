//https://stackoverflow.com/questions/1484506/random-color-generator
export function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    // var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    // return (c);
    var rgb = [];
    rgb.push(r * 255);
    rgb.push(g * 255);
    rgb.push(b * 255);
    return rgb;
}

export function color(number) {
    const colors = [
        [230,25,75],
        [60,180,75],
        [255,225,25],
        [67,99,216],
        [245,130,49],
        [145,30,180],
        [70,240,240],
        [240,50,230],
        [188,246,12],
        [250,190,190],
        [0,128,128],
        [230,190,255],
        [154,99,36],
        [255,250,200],
        [128,0,0],
        [170,255,195],
        [128,128,0],
        [255,216,177],
        [0,0,117],
        [169,169,169],
        [255,255,255],
        [0,0,0],
    ];
    return colors[number];
}