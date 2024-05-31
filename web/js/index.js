import {SnakeEngine} from "../../src";
import {Sprite} from "./modules/Sprite.js";

const constant = (() => {

    const unitTileSize = new SnakeEngine.Vector(100, 100);

    return {

        unitTileSize,

        htmlElement: {
            canvasTemplate: (() => {

                const canvasTemplate = document.createElement("canvas");
                canvasTemplate.classList.add( "snake-game" );
                canvasTemplate.classList.add( "viewer" );
                return canvasTemplate;

            })(),

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
        canvas: null
    };

    canvasContext;
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

// 모양 만들기



        this.konva.layer.draw();

        this.tileCount = new SnakeEngine.Vector();
        this.sprites.snake.walk.set( SnakeEngine.Direction.TOP, [ new Sprite("../web/img/character/walk/top/0.png"), new Sprite("../web/img/character/walk/top/1.png") ] );
        this.sprites.snake.walk.set( SnakeEngine.Direction.RIGHT, [ new Sprite("../web/img/character/walk/right/0.png"), new Sprite("../web/img/character/walk/right/1.png") ] );
        this.sprites.snake.walk.set( SnakeEngine.Direction.BOTTOM, [ new Sprite("../web/img/character/walk/bottom/0.png"), new Sprite("../web/img/character/walk/bottom/1.png") ] );
        this.sprites.snake.walk.set( SnakeEngine.Direction.LEFT, [ new Sprite("../web/img/character/walk/left/0.png"), new Sprite("../web/img/character/walk/left/1.png") ] );


        this.setUnitTileSize( constant.unitTileSize );
        this.resize();
        this.mapSize = new SnakeEngine.Vector(30, 30);
        this.engine = new SnakeEngine( this.mapSize );

        const unitTileSizeX = this.unitTileSize.getX();
        const unitTileSizeY = this.unitTileSize.getY();

                for( let x=-this.mapSize.getX(); x<this.mapSize.getX() * 2; ++x ){
                    for( let y=-this.mapSize.getY(); y<this.mapSize.getY() * 2; ++y ){

                        let image = this.sprites.map.ground;
                        if( -1 < x &&  x < this.mapSize.getX() && y === -2 ){
                            image = this.sprites.map.land.bottom;
                        }
                        else if( x < -1 || this.mapSize.getX() < x || y < -1 || this.mapSize.getY() < y ){
                            image = this.sprites.map.land.center;
                        }
                        else if( x === -1 && y === this.mapSize.getY() ){
                            image = this.sprites.map.land.center;
                        }
                        else if( x === this.mapSize.getX() && y === this.mapSize.getY() ){
                            image = this.sprites.map.land.center;
                        }
                        else if( x === -1 ){
                            image = this.sprites.map.land.right;
                        }
                        else if( x === this.mapSize.getX() ) {
                            image = this.sprites.map.land.left;
                        }
                        else if( y === -1 ){
                            image = this.sprites.map.land.bottomWall;
                        }
                        else if( y === this.mapSize.getY() ) {
                            image = this.sprites.map.land.top;
                        }

                        const bg = new Konva.Image({
                            x: x * unitTileSizeX,
                            y: y * unitTileSizeY,
                            image,
                            width: unitTileSizeX,
                            height: unitTileSizeY,
                        });

                        this.konva.layer.add( bg );
                    }
                }

        this.eventManager = new SnakeEngine.EventManager();

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

        console.log(snake[0].position);
        // });


        this.konva.stage.position({
            x: this.konva.stage.width() /2 -snake[0].position.getX() * unitTileSizeX,
            y: this.konva.stage.height()/2 -snake[0].position.getY() * unitTileSizeY
        });
        this.konva.stage.batchDraw();

        this.updateCounts += 1;

    }

    start() {

        this.updateCounts = 0;
        this.engine.snake.speed = 0.0001;
        // this.engine.snake.speed = 0.001

        this.konva.objects.snake.forEach(( snakeBody ) => {
            snakeBody.hide();
        });

        this.engine.on("update", () => {

            this.render();

        });

        this.engine.on("gameover", () => {

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

        const boundingClientRect = this.htmlElement.container.getBoundingClientRect();
        this.konva.stage.setWidth( boundingClientRect.width );
        this.konva.stage.setHeight( boundingClientRect.height );

    }

    on( event, callback ) {

        this.eventManager.addEventListener( event, callback );

    }

}