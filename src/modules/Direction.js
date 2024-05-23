import {Vector} from "./Vector";

export const Direction = Object.create(Object.prototype, {

    TOP: {

        value: new Vector( 0, 1 ),
        enumerable: true

    },

    RIGHT: {

        value: new Vector( 1, 0 ),
        enumerable: true

    },

    BOTTOM: {

        value: new Vector( 0, -1 ),
        enumerable: true

    },

    LEFT: {

        value: new Vector( -1, 0 ),
        enumerable: true

    },

    getNameByValue: {

        value( value ) {

            const entry = Object.entries( this ).find(( entry ) => {

                return value === entry[1];

            });

            if( !entry ){
                return;
            }

            return entry[0];

        }

    }

});