import {Vector} from "./Vector.js";

export const TOP = new Vector( 0, -1 );
export const RIGHT = new Vector( 1, 0 );
export const BOTTOM = new Vector( 0, 1 );
export const LEFT = new Vector( -1, 0 );

const directions = [
    TOP, RIGHT, BOTTOM, LEFT
];

export const random = () => {

    const index = Math.floor( Math.random() * 4 );
    return directions[ index ];

};

export const hasValue = ( value ) => {

    return -1 < directions.indexOf( value );

};