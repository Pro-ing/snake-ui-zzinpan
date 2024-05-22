import {Object2D} from "./index";
import {Vector} from "../Vector";
import {Animation} from "../Animator/Animation";
import {Frame} from "../Animator/Frame";

export class Character extends Object2D {

    fov = new Vector( 9, 9 );

    constructor() {
        super();
        const animator = super.getAnimator();
        animator.addAnimation( new Animation( "BOTTOM:WALK", [

            new Frame( "../../../assets/character/bottom/walk/0.png" ),
            new Frame( "../../../assets/character/bottom/walk/1.png" )

        ] ) );
    }

}