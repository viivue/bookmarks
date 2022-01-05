/**
 * Get contrast text color base on background color
 * https://www.w3.org/TR/AERT/#color-contrast
 * @param rgb
 * @returns {string}
 */
function getTextColor(rgb){
    // Randomly update colours
    // rgb[0] = Math.round(Math.random() * 255);
    // rgb[1] = Math.round(Math.random() * 255);
    // rgb[2] = Math.round(Math.random() * 255);

    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(rgb[0]) * 299) +
        (parseInt(rgb[1]) * 587) +
        (parseInt(rgb[2]) * 114)) / 1000);

    return (brightness > 125) ? '#000' : '#fff';
}


/**
 * Hex to RGB
 * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 * @param hex
 * @returns {{r: number, b: number, g: number}|null}
 */
function hexToRgb(hex){
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


/**
 * Manage object in session|local storage
 */
class MyStorage{
    constructor(key){
        this.key = key;
    }

    set(object){
        sessionStorage.setItem(this.key, JSON.stringify(object));
    }

    get(){
        return JSON.parse(sessionStorage.getItem(this.key));
    }

    clear(){
        sessionStorage.removeItem(this.key);
    }
}