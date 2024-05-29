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

    sprites = {
        snake: {
            walk: new Map(),
            attack: new Map()
        },
        map: {
            ground: new Sprite("../web/img/map/ground.png")
        }
    };

    htmlElement = {
        container: null,
        canvas: null
    };

    canvasContext;
    engine;
    updateCounts = 0;

    constructor( containerHtmlElement ) {

        if( !document.head.querySelector("style.snake-game") ){
            document.head.appendChild( constant.htmlElement.style );
        }

        this.htmlElement.container = containerHtmlElement;
        this.htmlElement.canvas = constant.htmlElement.canvasTemplate.cloneNode( true );
        this.canvasContext = this.htmlElement.canvas.getContext("2d");
        this.htmlElement.container.appendChild( this.htmlElement.canvas );


        this.tileCount = new SnakeEngine.Vector();
        this.sprites.snake.walk.set( SnakeEngine.Direction.TOP, [ new Sprite("../web/img/character/walk/top/0.png"), new Sprite("../web/img/character/walk/top/1.png") ] );
        this.sprites.snake.walk.set( SnakeEngine.Direction.RIGHT, [ new Sprite("../web/img/character/walk/right/0.png"), new Sprite("../web/img/character/walk/right/1.png") ] );
        this.sprites.snake.walk.set( SnakeEngine.Direction.BOTTOM, [ new Sprite("../web/img/character/walk/bottom/0.png"), new Sprite("../web/img/character/walk/bottom/1.png") ] );
        this.sprites.snake.walk.set( SnakeEngine.Direction.LEFT, [ new Sprite("../web/img/character/walk/left/0.png"), new Sprite("../web/img/character/walk/left/1.png") ] );


        this.tiles = [];
        this.setUnitTileSize( constant.unitTileSize );
        this.resize();
        this.mapSize = new SnakeEngine.Vector(100, 100);
        this.engine = new SnakeEngine( this.mapSize );

    }

    getEmptyTile() {

        return this.tiles.find(( tile ) => {

            return !tile.parentElement;

        });

    }

    render() {

        const snakeHead = this.engine.getSnake()[0];
        const walkSprites = this.sprites.snake.walk.get( snakeHead.direction );
        const walkSprite = walkSprites[ this.updateCounts % 2 ];

        const headPosition = snakeHead.getPosition();
        console.log("update", headPosition);
        const headDirection = snakeHead.getDirection();

        this.canvasContext.save();
        this.canvasContext.fillStyle = this.canvasContext.createPattern(this.sprites.map.ground, 'repeat');
        const mapWidth = this.unitTileSize.getX() * this.mapSize.getX();
        const mapHeight = this.unitTileSize.getY() * this.mapSize.getY();
        this.canvasContext.scale( -1, 1 );
        this.canvasContext.translate( this.unitTileSize.getX() * headPosition.getX(), this.unitTileSize.getY() * headPosition.getY() )
        this.canvasContext.fillRect(-mapWidth, -mapHeight, mapWidth, mapHeight);
        this.canvasContext.restore();

        this.canvasContext.save();
        this.canvasContext.translate( this.htmlElement.canvas.width / 2 - this.unitTileSize.getX() / 2, this.htmlElement.canvas.height / 2 - this.unitTileSize.getY() / 2 );
        this.canvasContext.drawImage( walkSprite, 0, 0, this.unitTileSize.getX(), this.unitTileSize.getY() );
        this.canvasContext.restore();

        this.updateCounts += 1;

    }

    start() {

        this.updateCounts = 0;
        this.engine.snake.speed = 0.0001;



        this.engine.on("update", () => {

            this.render();

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
        let viewerWidth = boundingClientRect.width - ( boundingClientRect.width % this.unitTileSize.x ) + this.unitTileSize.x;
        let viewerHeight = boundingClientRect.height - ( boundingClientRect.height % this.unitTileSize.y ) + this.unitTileSize.y;

        // 플레이어가 가운데 위치하도록 타일들을 홀수를 만들어준다.
        if( ( viewerWidth / this.unitTileSize.x ) % 2 === 0 ){
            viewerWidth += this.unitTileSize.x;
        }

        if( ( viewerHeight / this.unitTileSize.y ) % 2 === 0 ){
            viewerHeight += this.unitTileSize.y;
        }

        this.tileCount.setX( viewerWidth / this.unitTileSize.x );
        this.tileCount.setY( viewerHeight / this.unitTileSize.y );

        this.htmlElement.canvas.width = viewerWidth;
        this.htmlElement.canvas.height = viewerHeight;
        this.htmlElement.canvas.style.width = `${viewerWidth}px`;
        this.htmlElement.canvas.style.height = `${viewerHeight}px`;

    }

}