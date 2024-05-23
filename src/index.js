import * as mapImage from "./assets/map.js";
import {Vector} from "./modules/Vector.js";
import {SnakeEngine} from "./modules/SnakeEngine";

const constant = (() => {

    const unitTileSize = new Vector(100, 100);

    return {

        unitTileSize,

        htmlElement: {
            viewerTemplate: (() => {

                const viewerTemplate = document.createElement("div");
                viewerTemplate.classList.add( "snake-game" );
                viewerTemplate.classList.add( "viewer" );
                viewerTemplate.style.backgroundImage = `url("${mapImage.normal}")`;

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
        transform: translate( -50%, -50% );
        background-color: red;
        background-size: ${Math.min( unitTileSize.x, unitTileSize.y )}px;
        border-radius: 10px;
        transition: all 200ms;
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


    htmlElement = {
        container: null,
        viewer: null
    }
    engine;

    constructor( containerHtmlElement ) {

        if( !document.head.querySelector("style.snake-game") ){
            document.head.appendChild( constant.htmlElement.style );
        }

        this.htmlElement.container = containerHtmlElement;
        this.htmlElement.viewer = constant.htmlElement.viewerTemplate.cloneNode( true );
        this.htmlElement.container.appendChild( this.htmlElement.viewer );
        this.tileCount = new Vector(1,1);

        this.setUnitTileSize( constant.unitTileSize );
        this.resize();

        this.engine = new SnakeEngine();
        this.engine.setSize( 1000, 1000 );
        this.engine.on("update", ( tiles ) => {

            const snake = this.engine.getSnake();
            const head = snake.getHead();
            head.getDirection();


            this.engine.getFeeds().forEach(( feed ) => {



            });

        });

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

        this.htmlElement.viewer.style.width = `${viewerWidth}px`;
        this.htmlElement.viewer.style.height = `${viewerHeight}px`;

    }

}