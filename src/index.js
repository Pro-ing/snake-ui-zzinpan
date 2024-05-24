import * as mapImageSource from "./assets/image/map.js";
import * as characterImageSource from "./assets/image/character.js";
import {Vector} from "./modules/Vector.js";
import {SnakeEngine} from "./modules/SnakeEngine";
import {Tile} from "./modules/Tile.js";

const constant = (() => {

    const unitTileSize = new Vector(100, 100);

    return {

        unitTileSize,

        htmlElement: {
            viewerTemplate: (() => {

                const viewerTemplate = document.createElement("div");
                viewerTemplate.classList.add( "snake-game" );
                viewerTemplate.classList.add( "viewer" );
                viewerTemplate.style.backgroundImage = `url("${mapImageSource.normal}")`;

                return viewerTemplate;

            })(),

            style: (() => {

                const style = document.createElement("style");
                style.classList.add("snake-game");

                style.innerHTML = `
    .snake-game.viewer {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate( -50%, -50% ) scaleY(-1);
        background-color: red;
        border-radius: 10px;
        transition: all 200ms;
    }
    
    .snake-game.viewer > .tile {
        position: absolute;
        transition: none;
        box-shadow: 0px 0px 0px 1px red;
        transform: translate( -50%, -50% ) scaleY(-1);
    }
    `;

                return style;

            })()
        },

    };

})();

export class SnakeGame {

    static Vector = Vector;

    unitTileSize;
    tileCount;
    tiles

    imageSources = {
        snake: {
            walk: new Map(),
            attack: new Map()
        }
    };

    htmlElement = {
        container: null,
        viewer: null
    };

    engine;

    constructor( containerHtmlElement ) {

        if( !document.head.querySelector("style.snake-game") ){
            document.head.appendChild( constant.htmlElement.style );
        }

        this.htmlElement.container = containerHtmlElement;
        this.htmlElement.viewer = constant.htmlElement.viewerTemplate.cloneNode( true );
        this.htmlElement.container.appendChild( this.htmlElement.viewer );


        this.tileCount = new Vector();
        this.imageSources.snake.walk.set( SnakeEngine.Direction.TOP, characterImageSource.top.walk );
        this.imageSources.snake.walk.set( SnakeEngine.Direction.RIGHT, characterImageSource.right.walk );
        this.imageSources.snake.walk.set( SnakeEngine.Direction.BOTTOM, characterImageSource.bottom.walk );
        this.imageSources.snake.walk.set( SnakeEngine.Direction.LEFT, characterImageSource.left.walk );


        this.setUnitTileSize( constant.unitTileSize );
        this.resize();

        this.engine = new SnakeEngine( 1000, 1000 );
        this.engine.reset();

        const render = () => {

            Array.from(this.htmlElement.viewer.children).forEach(( tile ) => {
                this.htmlElement.viewer.removeChild( tile );
            });

            const snakeHead = this.engine.getSnakeHead();

            snakeHead.position.x
            snakeHead.position.y

        };


        window.a = () => {

            // 제거
            Array.from(this.htmlElement.viewer.children).forEach(( tile ) => {
                this.htmlElement.viewer.removeChild( tile );
            });

            const snake = this.engine.getSnakeHead();
            const walkImageSources = this.imageSources.snake.walk.get( snake.head.direction );
            const walkImageSourceIndex = snake.head.position[ snake.head.direction.axis ] % 2;
            const walkImageSource = walkImageSources[ walkImageSourceIndex ];


            const x = Math.ceil( this.tileCount.x / 2 );
            const y = Math.ceil( this.tileCount.y / 2 );
            console.log( x, y );
            const tile = new Tile( walkImageSource );
            // tile.style.left = `${x * this.unitTileSize.x}px`;
            // tile.style.top = `${y * this.unitTileSize.y}px`;

            tile.style.left = `50%`;
            tile.style.top = `50%`;

            tile.width = this.unitTileSize.x;
            tile.height = this.unitTileSize.y;
            this.htmlElement.viewer.appendChild( tile );


            // this.engine.getFeeds().forEach(( feed ) => {
            //
            //
            //
            // });

        };
        this.engine.on("update", window.a);

    }

    setUnitTileSize( unitTileSize = this.unitTileSize ) {

        this.unitTileSize = unitTileSize;
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

        this.htmlElement.viewer.style.backgroundSize = `${Math.min( this.unitTileSize.x, this.unitTileSize.y )}px`;
        this.htmlElement.viewer.style.width = `${viewerWidth}px`;
        this.htmlElement.viewer.style.height = `${viewerHeight}px`;

    }

}