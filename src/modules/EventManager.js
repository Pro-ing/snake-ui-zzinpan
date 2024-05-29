export class EventManager {

    map;

    constructor() {

        this.map = new Map();

    }

    addEventListener( key, eventListener ) {

        const eventListeners = this.map.get( key );
        if( !eventListeners ) {
            this.map.set( key, [ eventListener ] );
            return;
        }

        eventListeners.push( eventListener );

    }

    dispatch( ...args ) {

        const key = args.shift();
        const eventListeners = this.map.get( key );
        if( !eventListeners ) {
            return;
        }

        eventListeners.forEach(( eventListener ) => {
            eventListener( ...args );
        });
    }

}