import {Vector} from "./modules/Vector.js";
import * as Direction from "./modules/Direction.js";
import {Asset} from "./modules/Asset";
import {EventManager} from "./modules/EventManager.js";
import {SnakeHead} from "./modules/Asset/SnakeHead.js";
import {SnakeBody} from "./modules/Asset/SnakeBody.js";

export class SnakeEngine {

    static Vector = Vector;
    static Direction = Direction;
    static EventManager = EventManager;
    static Asset = Asset;

    world = {
        size: new Vector(11, 11),
        assets: []
    }

    snake = {
        head: null,
        // pxPerMilliSeconds
        speed: 0.00001
    };

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

        const snakeHead = new SnakeHead();
        snakeHead.setDirection( Direction.BOTTOM );
        snakeHead.getPosition().set(startX, startY);

        this.snake.head = snakeHead;

        this.world.assets = [ snakeHead ];

    }

    getSnakeHead() {

        return this.snake.head;

    }

    getAssets() {
        return this.world.assets.slice();
    }

    getEmptyPosition() {
        const assets = this.getAssets();
        while(true) {
            const x = Math.floor( Math.random() * this.world.size.getX() );
            const y= Math.floor( Math.random() * this.world.size.getY() );
            const isEmpty = assets.every(( asset ) => {
                const position = asset.getPosition();
                return position.getX() !== x && position.getY() !== y;
            });

            if( isEmpty ){
                return new Vector( x, y );
            }
        }
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
            const head = this.getSnakeHead();
            const nextHeadPosition = head.getPosition().clone();
            nextHeadPosition.add( head.getDirection() );
            nextHeadPosition.multiplyScalar( movePx );

            if( this.isOutOfWorld( nextHeadPosition ) ){
                cancelAnimationFrame( this.raf.id );
                this.eventManager.dispatch( "gameover" );
                return;
            }

            const asset = this.getByPosition( nextHeadPosition );

            // asset === 빈 공간 : 이동 - start
            let lastBody = head;
            while(true){
                const nextBody = lastBody.getNext()

                if(!nextBody) {
                    break;
                }

                lastBody = nextBody;
            }

            let prevBody = lastBody.getPrev();
            while(prevBody){

                const nextBody = prevBody.getNext();
                nextBody.getPosition().copy( prevBody.getPosition() );
                nextBody.setDirection( prevBody.getDirection() );
                prevBody = prevBody.getPrev();

            }
            head.getPosition().add( head.getDirection() );

            // 이동 - end
            if( asset ){
                this.eventManager.dispatch( "meetAsset", asset );
            }

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

    isSnake( asset ) {

        return asset instanceof SnakeBody;

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

        const head = this.getSnakeHead();

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

    addAsset( asset ) {

        this.world.assets.push( asset );
        this.eventManager.dispatch( "update" );

    }

    removeAsset( asset ) {

        const index = this.world.assets.indexOf( asset );
        if( index < 0 ) {
            return;
        }
        this.world.assets.splice( index, 1 );

    }

    addSnakeBody() {

        let lastBody = this.getSnakeHead();
        while(true){

            const nextBody = lastBody.getNext();
            if( !nextBody ){
                break;
            }

            lastBody = nextBody;

        }

        const newLastBody = new SnakeBody();
        newLastBody.setDirection( lastBody.getDirection() );
        newLastBody.getPosition().copy( lastBody.getPosition() );
        lastBody.setNext( newLastBody );
        newLastBody.setPrev( lastBody );

    }

}