import {Asset} from "./index.js";

export class SnakeBody extends Asset {

    prev;
    next;

    constructor() {

        super();

    }

    setNext( snakeBody ) {

        this.next = snakeBody;

    }

    getNext(){
        return this.next;
    }

    setPrev( snakeBody ) {

        this.prev = snakeBody;

    }


    getPrev(){
        return this.prev;
    }

}