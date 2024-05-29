export class Vector {

    x; y;

    constructor( x = 0, y = 0 ) {

        this.set( x, y );

    }

    set( x, y ) {

        this.setX( x );
        this.setY( y );
        return this;

    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX( x = this.x ) {

        this.x = x;
        return this;

    }

    setY( y = this.y ) {

        this.y = y;
        return this;

    }

    add( vector = new Vector() ) {

        this.setX( this.getX() + vector.getX() );
        this.setY( this.getY() + vector.getY() );
        return this;

    }

    copy( vector = this ) {

        this.set( vector.getX(), vector.getY() );
        return this;

    }

    clone() {
        return new Vector( this.getX(), this.getY() );
    }

    equals( vector ) {

        if( vector.getX() !== this.getX() ) {
            return false;
        }

        return vector.getY() === this.getY();

    }

    multiplyScalar( value ) {

        this.setX( this.getX() * value );
        this.setY( this.getY() * value );
        return this;

    }

    negate() {

        this.setX( -this.getX() );
        this.setY( -this.getY() );
        return this;

    }

}