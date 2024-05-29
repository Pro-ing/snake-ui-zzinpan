import * as Direction from "../Direction.js";
import {Vector} from "../Vector.js";

export class Asset {

    direction;
    position;
    data;

    constructor() {

        this.direction = Direction.BOTTOM;
        this.position = new Vector();
        this.data = {};

    }

    setDirection( direction ) {

        this.direction = direction;

    }

    getDirection() {

        return this.direction;

    }

    getPosition() {

        return this.position;

    }

    clone() {

        const clone = new Asset();
        clone.setDirection( this.direction );
        clone.getPosition().copy( this.getPosition() );
        return clone;

    }

    getData() {

        return this.data;

    }

}