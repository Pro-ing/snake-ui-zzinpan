export class Vector {

    x; y;

    constructor( x = 0, y = 0 ) {

        this.set( x, y );

    }

    set( x, y ) {

        this.setX( x );
        this.setY( y );

    }

    setX( x = this.x ) {

        this.x = x;

    }

    setY( y = this.y ) {

        this.y = y;

    }

}