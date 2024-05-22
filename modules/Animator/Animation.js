const defaultImage = new Image();

export class Animation {

    name;
    index;
    frames;

    constructor( name, frames = [] ) {

        this.name = name;
        this.index = 0;
        this.frames = frames;

    }

    getName() {
        return this.name;
    }

    setIndex( index = 0 ) {

        this.index = index;

    }

    update() {

        const frameIndex = this.index + 1;
        if( this.frames.length - 1 < frameIndex ) {
            this.index = 0;
            return;
        }

        this.index = frameIndex;

    }

    getFrame() {

        const frame = this.frames[ this.index ];
        if( frame ){
            return frame;
        }

        return defaultImage;

    }

}