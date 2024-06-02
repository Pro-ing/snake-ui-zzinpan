import {SnakeEngine} from "../../src";
import {Sprite} from "./modules/Sprite.js";
import * as utility from "./modules/utility.js";

const constant = (() => {

    const unitTileSize = new SnakeEngine.Vector(100, 100);

    return {

        unitTileSize,

        htmlElement: {
            style: (() => {

                const style = document.createElement("style");
                style.classList.add("snake-game");

                style.innerHTML = `
    .snake-game.viewer {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate( -50%, -50% );
        background-color: red;
        border-radius: 10px;
    }
    `;

                return style;

            })()
        },

    };

})();

export class SnakeGame {

    static Vector = SnakeEngine.Vector;

    unitTileSize;
    tileCount;
    tiles;
    mapSize;
    eventManager;

    sprites = {
        snake: {
            walk: new Map(),
            die: new Map(),
            attack: new Map()
        },
        map: {
            ground: new Sprite("../web/img/map/ground.png"),
            land: {
                center: new Sprite("../web/img/map/land/center.png"),
                right: new Sprite("../web/img/map/land/right.png"),
                left: new Sprite("../web/img/map/land/left.png"),
                top: new Sprite("../web/img/map/land/top.png"),
                bottom: new Sprite("../web/img/map/land/bottom.png"),
                bottomWall: new Sprite("../web/img/map/land/bottomWall.png"),
            }
        }
    };

    htmlElement = {
        container: null,
        minimap: {
            container: null,
            canvas: null,
            canvasContext: null
        }
    };

    engine;
    updateCounts = 0;

    konva = {
        stage: null,
        layer: null,
        objects: {
            snake: []
        }
    }

    constructor( containerHtmlElement ) {

        if( !document.head.querySelector("style.snake-game") ){
            document.head.appendChild( constant.htmlElement.style );
        }

        this.htmlElement.container = containerHtmlElement;

        const boundingClientRect = this.htmlElement.container.getBoundingClientRect();

        this.konva.stage = new Konva.Stage({
            container: this.htmlElement.container, // 컨테이너 id <div>
            width: boundingClientRect.width,
            height: boundingClientRect.height
        });

        this.konva.stage.scale(-1);
        this.konva.layer = new Konva.Layer();
        this.konva.layer.scale(-1);
        this.konva.stage.add( this.konva.layer );
        this.konva.layer.draw();

        this.tileCount = new SnakeEngine.Vector();
        ["TOP", "RIGHT", "BOTTOM", "LEFT"].forEach(( directionName ) => {

            const lowerCaseDirectionName = directionName.toLowerCase();

            [
                { name: "walk", frameCount: 2 },
                { name: "die", frameCount: 30 }
            ].forEach(( animation ) => {

                const sprites = [];
                for( let i=0; i<animation.frameCount; ++i ){
                    sprites.push(new Sprite(`../web/img/character/${animation.name}/${lowerCaseDirectionName}/${i}.png`))
                }

                this.sprites.snake[ animation.name ].set( SnakeEngine.Direction[ directionName ], sprites );

            });

        });

        this.setUnitTileSize( constant.unitTileSize );
        this.resize();

        this.htmlElement.minimap.canvas = document.createElement("canvas");
        this.htmlElement.minimap.canvasContext = this.htmlElement.minimap.canvas.getContext("2d");

        this.mapSize = new SnakeEngine.Vector(30, 30);
        this.engine = new SnakeEngine( this.mapSize );
        this.eventManager = new SnakeEngine.EventManager();

        this.initWorld();

    }

    initWorld(){

        const unitTileSizeX = this.unitTileSize.getX();
        const unitTileSizeY = this.unitTileSize.getY();

        const filledPositions = [];

        // 기본 배경
        for( let x=-2; x<=this.mapSize.getX(); x+=2 ){
            for( let y=-2; y<=this.mapSize.getY(); y+=2 ){
                const bg = new Konva.Image({
                    x: x * unitTileSizeX,
                    y: y * unitTileSizeY,
                    image: this.sprites.map.ground,
                    width: unitTileSizeX * 2,
                    height: unitTileSizeY * 2,
                });

                filledPositions.push( new SnakeEngine.Vector( x, y ) );
                this.konva.layer.add( bg );
            }
        }

        const lastX = this.mapSize.getX();
        const lastY = this.mapSize.getY();

        // 절벽 TOP
        for( let x=-2; x<=this.mapSize.getX(); x+=2 ){

            const bottomWall = new Konva.Image({
                x: x * unitTileSizeX,
                y: -2 * unitTileSizeY,
                image: this.sprites.map.land.bottomWall,
                width: unitTileSizeX * 2,
                height: unitTileSizeY * 2,
            });

            filledPositions.push( new SnakeEngine.Vector( x, -2 ) );
            this.konva.layer.add( bottomWall );

            const bottomLand = new Konva.Image({
                x: x * unitTileSizeX,
                y: -4 * unitTileSizeY,
                image: this.sprites.map.land.bottom,
                width: unitTileSizeX * 2,
                height: unitTileSizeY * 2,
            });

            filledPositions.push( new SnakeEngine.Vector( x, -4 ) );
            this.konva.layer.add( bottomLand );

            const topLand = new Konva.Image({
                x: x * unitTileSizeX,
                y: lastY * unitTileSizeY,
                image: this.sprites.map.land.top,
                width: unitTileSizeX * 2,
                height: unitTileSizeY * 2,
            });

            filledPositions.push( new SnakeEngine.Vector( x, lastY ) );
            this.konva.layer.add( topLand );
        }

        // 절벽 TOP
        for( let y=-2; y<this.mapSize.getY(); y+=2 ){

            const rightLand = new Konva.Image({
                x: -2 * unitTileSizeX,
                y: y * unitTileSizeY,
                image: this.sprites.map.land.right,
                width: unitTileSizeX * 2,
                height: unitTileSizeY * 2,
            });

            filledPositions.push( new SnakeEngine.Vector( -2, y ) );
            this.konva.layer.add( rightLand );

            const leftLand = new Konva.Image({
                x: lastX * unitTileSizeX,
                y: y * unitTileSizeY,
                image: this.sprites.map.land.left,
                width: unitTileSizeX * 2,
                height: unitTileSizeY * 2,
            });

            filledPositions.push( new SnakeEngine.Vector( lastX, y ) );
            this.konva.layer.add( leftLand );
        }

        // 기본 배경
        for( let x=-this.mapSize.getX(); x<=this.mapSize.getX() * 2; x+=2 ){
            for( let y=-this.mapSize.getY(); y<=this.mapSize.getY() * 2; y+=2 ){

                const isFilled = filledPositions.some(( vector ) => {
                    return vector.getX() === x && vector.getY() === y;
                });

                if( isFilled ){
                    continue;
                }

                const bg = new Konva.Image({
                    x: x * unitTileSizeX,
                    y: y * unitTileSizeY,
                    image: this.sprites.map.land.center,
                    width: unitTileSizeX * 2,
                    height: unitTileSizeY * 2,
                });

                this.konva.layer.add( bg );
            }
        }

        // 모서리
        const bgTl = new Konva.Image({
            x: -2 * unitTileSizeX,
            y: -4 * unitTileSizeY,
            image: this.sprites.map.land.center,
            width: unitTileSizeX * 2,
            height: unitTileSizeY * 2,
        });

        this.konva.layer.add( bgTl );

        const bgTr = new Konva.Image({
            x: lastX * unitTileSizeX,
            y: -4 * unitTileSizeY,
            image: this.sprites.map.land.center,
            width: unitTileSizeX * 2,
            height: unitTileSizeY * 2,
        });

        this.konva.layer.add( bgTr );

        const bgBl = new Konva.Image({
            x: -2 * unitTileSizeX,
            y: lastY * unitTileSizeY,
            image: this.sprites.map.land.center,
            width: unitTileSizeX * 2,
            height: unitTileSizeY * 2,
        });

        this.konva.layer.add( bgBl );

        const bgBr = new Konva.Image({
            x: lastX * unitTileSizeX,
            y: lastY * unitTileSizeY,
            image: this.sprites.map.land.center,
            width: unitTileSizeX * 2,
            height: unitTileSizeY * 2,
        });

        this.konva.layer.add( bgBr );

    }

    getEmptyTile() {

        return this.tiles.find(( tile ) => {

            return !tile.parentElement;

        });

    }

    render() {

        const unitTileSizeX = this.unitTileSize.getX();
        const unitTileSizeY = this.unitTileSize.getY();
        const snake = this.engine.getSnake();
        snake.forEach(( snakeBody, index ) => {

            const position = snakeBody.getPosition();
            const direction = snakeBody.getDirection();

            const walkSprites = this.sprites.snake.walk.get( direction );
            const walkSprite = walkSprites[ ( this.updateCounts + index ) % 2 ];
            const konvaObject = this.konva.objects.snake[ index ];
            const x= position.getX() * unitTileSizeX;
            const y= position.getY() * unitTileSizeY;
            if( !konvaObject ){
                const konvaObject = new Konva.Image({
                    x,
                    y,
                    image: walkSprite,
                    width: unitTileSizeX,
                    height: unitTileSizeY,
                });
                this.konva.layer.add( konvaObject );
                this.konva.objects.snake.push( konvaObject );
                konvaObject.show();
                return;
            }

            konvaObject.setImage( walkSprite );
            konvaObject.x( x );
            konvaObject.y( y );
            konvaObject.show();

        });

        const snakeHeadPosition = snake[0].getPosition();
        this.konva.stage.position({
            x: this.konva.stage.width() /2 -snakeHeadPosition.getX() * unitTileSizeX,
            y: this.konva.stage.height()/2 -snakeHeadPosition.getY() * unitTileSizeY
        });
        this.konva.stage.batchDraw();



        this.updateCounts += 1;


        if( !this.htmlElement.minimap.container ){
            return;
        }

        this.htmlElement.minimap.canvasContext.clearRect( 0, 0, this.htmlElement.minimap.canvas.width, this.htmlElement.minimap.canvas.height );
        const unitTileX = this.htmlElement.minimap.canvas.width / this.mapSize.getX();
        const unitTileY = this.htmlElement.minimap.canvas.height / this.mapSize.getY();

        console.log(snakeHeadPosition);
        snake.forEach(( snakeBody ) => {

            const snakeX = snakeBody.getPosition().getX();
            const snakeY = snakeBody.getPosition().getY();
            this.htmlElement.minimap.canvasContext.fillRect( snakeX * unitTileX, snakeY * unitTileY, unitTileX, unitTileY );

        });
    }

    start() {

        this.updateCounts = 0;
        // this.engine.snake.speed = 0.0001;
        this.engine.snake.speed = 0.001

        this.konva.objects.snake.forEach(( snakeBody ) => {
            snakeBody.hide();
        });

        this.engine.on("update", () => {

            this.render();

        });

        this.engine.on("gameover", () => {


            utility.duration(( rate ) => {

                const frameIndex = Math.round( 29 * rate );

                this.engine.getSnake().forEach(( snakeBody, index ) => {

                    const direction = snakeBody.getDirection();
                    this.konva.objects.snake[ index ].setImage( this.sprites.snake.die.get( direction )[ frameIndex ] );

                });

            }, 1000);

            this.eventManager.dispatch("gameover");

        });

        window.addEventListener("keydown", ( event ) => {

            console.log(event.key);



            if(event.key === "ArrowLeft"){
                this.engine.left();
                this.render();
                return;
            }

            if(event.key === "ArrowUp"){
                this.engine.top();
                this.render();
                return;
            }

            if(event.key === "ArrowRight"){
                this.engine.right();
                this.render();
                return;
            }

            if(event.key === "ArrowDown"){
                this.engine.bottom();
                this.render();
            }

        });

        this.engine.start();

    }

    setUnitTileSize( unitTileSize = this.unitTileSize ) {

        this.unitTileSize = unitTileSize;
        this.sprites.map.ground.width = this.unitTileSize.getX();
        this.sprites.map.ground.height = this.unitTileSize.getY();
        this.resize();

    }

    resize() {

        const viewerBoundingClientRect = this.htmlElement.container.getBoundingClientRect();
        this.konva.stage.setWidth( viewerBoundingClientRect.width );
        this.konva.stage.setHeight( viewerBoundingClientRect.height );

        if( !this.htmlElement.minimap.container ){
            return;
        }

        const minimapBoundingClientRect = this.htmlElement.minimap.container.getBoundingClientRect();
        this.htmlElement.minimap.canvas.width = minimapBoundingClientRect.width;
        this.htmlElement.minimap.canvas.height = minimapBoundingClientRect.height;
        this.htmlElement.minimap.canvas.style.width = `${this.htmlElement.minimap.canvas.width}px`;
        this.htmlElement.minimap.canvas.style.height = `${this.htmlElement.minimap.canvas.height}px`;
    }

    on( event, callback ) {

        this.eventManager.addEventListener( event, callback );

    }

    minimap( htmlElement ) {

        this.htmlElement.minimap.container = htmlElement;
        this.htmlElement.minimap.container.appendChild( this.htmlElement.minimap.canvas );
        this.resize();

    }

}