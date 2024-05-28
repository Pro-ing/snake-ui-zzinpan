import {Vector} from "./modules/Vector";
import * as Direction from "./modules/Direction";
import {Asset} from "./modules/Asset";
import {EventManager} from "./modules/EventManager";

export class SnakeEngine {

    static Vector = Vector;

    static Direction = Direction;

    world = {
        size: new Vector(11, 11),
        assets: []
    }

    snake = {
        // 꼬리[0] ... 머리[bodies.length - 1]
        bodies: [],
        // pxPerSeconds
        speed: 1
    };

    feeds = [];
    enemies = [];


    eventListeners = new EventManager();

    raf = {
        id: null,
        time: null
    };

    constructor( size ) {

        this.world.size.copy( size );

    }

    reset() {

        const startX = Math.floor( this.world.size.getX() / 2 );
        const startY = Math.floor( this.world.size.getY() / 2 );

        const snakeHead = new Asset();
        snakeHead.setDirection( Direction.BOTTOM );
        snakeHead.getPosition().set(startX, startY);

        this.snake.bodies = [
            snakeHead
        ];

        this.feeds = [];
        this.enemies = [];

        this.world.assets = [ snakeHead ];

    }

    getSnake() {

        return this.snake.slice();

    }

    getAssets() {
        return this.world.assets.slice();
    }

    start() {

        let remainder = 0;

        const frame = () => {

            // 거리 = 시간 * 속력 + 이전 프레임에 계산되지 않은 나머지 거리
            const time = Date.now() - this.raf.time;
            const speed = this.snake.speed;
            const px = time * speed + remainder;

            remainder = px % 1;
            if( px < 1 ){
                this.raf.id = requestAnimationFrame(frame);
                return;
            }

            const movePx = px - remainder;
            const snakeBodies = this.getSnake();
            const head = snakeBodies[ snakeBodies.length - 1 ];
            const nextHeadPosition = head.getPosition().clone();
            nextHeadPosition.add( head.getDirection() );
            nextHeadPosition.multiplyScalar( movePx );

            const asset = this.getByPosition( nextHeadPosition );

            // asset === 빈 공간 : 이동
            if( !asset ){

                snakeBodies.forEach(( body, index ) => {

                    if( index === snakeBodies.length - 1 ) {
                        body.position.copy( nextHeadPosition );
                        return;
                    }

                    const nextBody = snakeBodies[ index + 1 ];
                    body.position.copy( nextBody.position );

                });

                this.eventListeners.dispatch( "update" );
                this.raf.id = requestAnimationFrame(frame);
                return;
            }

            if( this.isFeed( asset ) ){
                console.log("asset is feed");
                this.eventListeners.dispatch( "update" );
                this.raf.id = requestAnimationFrame(frame);
                return;
            }

            // this.isEnemy( asset ) || this.isSnake( asset )
            console.log("asset is enemy or snake");
            this.eventListeners.dispatch( "update" );
            this.raf.id = requestAnimationFrame(frame);
        };

        this.raf.id = requestAnimationFrame(frame);

    }

    isEnemy( asset ) {

        return -1 < this.enemies.indexOf( asset );

    }

    isSnake( asset ) {

        return -1 < this.snake.bodies.indexOf( asset );

    }

    isFeed( asset ) {

        return -1 < this.feeds.indexOf( asset );

    }

    getByPosition( vector ) {

        return this.world.assets.find(( asset ) => {

            return asset.getPosition().equals( vector );

        });

    }

    move( direction ) {

        if( !Direction.hasValue( direction ) ){
            return;
        }

        const snakeBodies = this.getSnake();
        const head = snakeBodies[ snakeBodies.length - 1 ];

        // 현재
        if( head.direction.clone().negate().equals( direction ) ){

        }

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

    getFeeds() {

        return {
            direction: SnakeEngine.Direction.BOTTOM,
            position: { x: 2, y: 2 }
        };

    }

}