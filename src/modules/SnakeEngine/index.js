export class SnakeEngine {

    static Direction = {
        TOP: { axis: "x", value: 1 },
        RIGHT: { axis: "y", value: 1 },
        BOTTOM: { axis: "x", value: -1 },
        LEFT: { axis: "y", value: -1 },
    };

    world = {
        size: {
            x: 11,
            y: 11
        },
        value: [[null]]
    }

    snake = [
        { type: "snake", index: 0, direction: SnakeEngine.Direction.BOTTOM, x: 0, y: 0 }
    ];

    eventListeners = {

        update: [],
        gameover: []

    };

    constructor(x, y) {

        this.world.size.x = x;
        this.world.size.y = y;
        this.world.value = new Array( this.world.size.x ).fill( new Array( this.world.size.y ).fill(null) );

    }

    reset() {

        const startX = Math.floor( this.world.size.x / 2 );
        const startY = Math.floor( this.world.size.y / 2 );
        const snakeHead = { type: "snake", index: 0, direction: SnakeEngine.Direction.BOTTOM, position: { x: startX, y: startY } };

        this.snake = [
            snakeHead
        ];

        this.world.value[ startX ][ startY ] = snakeHead;

    }

    getSnakeHead() {

        return this.snake[ 0 ];

    }

    getWorld() {
        return this.world.value;
    }

    start() {

    }

    top() {

    }

    right() {

    }

    bottom() {

    }

    left() {

    }

    on( eventName, eventListener ) /* void */ {

        const eventListeners = this.eventListeners[ eventName ];
        if( !eventListeners ){
            return;
        }

        eventListeners.push( eventListener );

    }

    getHeadInfo()  {


        return {
            direction: SnakeEngine.Direction.TOP,
            position: { x: 0, y: 0 }
        };

    }

    getFeeds() {

        return {
            direction: SnakeEngine.Direction.BOTTOM,
            position: { x: 2, y: 2 }
        };

    }

}