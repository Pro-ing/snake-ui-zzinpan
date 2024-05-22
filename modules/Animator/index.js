const defaultImage = new Image();

export class Animator {

    playingAnimation;
    animations;

    constructor() {

        this.animations = [];

    }

    addAnimation( animation ) {

        if( !this.playingAnimation ){
            this.playingAnimation( animation.name );
        }

        this.animations.push( animation );

    }

    playAnimation( animationName ) {

        const playingAnimation = this.animations.find(( animation ) => {

            return animationName === animation.getName();

        });

        if( !playingAnimation ){
            return;
        }

        playingAnimation.play();
        this.playingAnimation = playingAnimation;

    }

}