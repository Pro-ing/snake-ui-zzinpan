import {Vector} from "./modules/Vector.js";
import * as Direction from "./modules/Direction.js";
import {Asset} from "./modules/Asset";
import {EventManager} from "./modules/EventManager.js";

export class SnakeEngine {

    static Vector = Vector;
    static Direction = Direction;
    static EventManager = EventManager;

    world = {
        size: new Vector(11, 11),
        assets: []
    }

    snake = {
        // 꼬리[0] ... 머리[bodies.length - 1]
        bodies: [],
        // pxPerMilliSeconds
        speed: 0.00001
    };

    feeds = [];
    enemies = [];


    eventManager = new EventManager();

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

        return this.snake.bodies.slice();

    }

    getAssets() {
        return this.world.assets.slice();
    }

    start() {

        let remainder = 0;
        this.reset();

        const frame = () => {

            // 거리 = 시간 * 속력 + 이전 프레임에 계산되지 않은 나머지 거리
            const now = Date.now();
            const time = now - this.raf.time;
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

            if( this.isOutOfWorld( nextHeadPosition ) ){
                cancelAnimationFrame( this.raf.id );
                this.eventManager.dispatch( "gameover" );
                return;
            }

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

                this.eventManager.dispatch( "update" );
                this.raf.time = now;
                this.raf.id = requestAnimationFrame(frame);
                return;
            }

            if( this.isFeed( asset ) ){
                console.log("asset is feed");
                this.eventManager.dispatch( "update" );
                this.raf.time = now;
                this.raf.id = requestAnimationFrame(frame);
                return;
            }

            // this.isEnemy( asset ) || this.isSnake( asset )
            console.log("asset is enemy or snake");
            this.eventManager.dispatch( "update" );
            this.raf.time = now;
            this.raf.id = requestAnimationFrame(frame);
        };

        this.raf.time = Date.now();
        this.raf.id = requestAnimationFrame(frame);

    }

    isOutOfWorld( vector ) {

        const x = vector.getX();
        if( x < 0 ){
            return true;
        }

        if( this.world.size.getX() <= x ){
            return true;
        }

        const y = vector.getY();
        if( y < 0 ){
            return true;
        }

        if( this.world.size.getY() <= y ){
            return true;
        }

        return false;

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
            return;
        }

        head.direction = direction;

    }

    top() {

        this.move( Direction.TOP );

    }

    right() {

        this.move( Direction.RIGHT );

    }

    bottom() {

        this.move( Direction.BOTTOM );

    }

    left() {

        this.move( Direction.LEFT );

    }

    on( eventName, eventListener ) /* void */ {

        this.eventManager.addEventListener( eventName, eventListener );

    }

    getFeeds() {

        return {
            direction: SnakeEngine.Direction.BOTTOM,
            position: { x: 2, y: 2 }
        };

    }

}