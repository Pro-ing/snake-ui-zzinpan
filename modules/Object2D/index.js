import {Vector} from "../Vector";
import {Animator} from "../Animator";

export class Object2D {

    animator;
    position;

    constructor() {

        this.position = new Vector();
        this.animator = new Animator();

    }

    getAnimator() {
        return this.animator;
    }

}