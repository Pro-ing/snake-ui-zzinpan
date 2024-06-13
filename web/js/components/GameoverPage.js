const style = document.createElement("style");
style.classList.add("component-gameover-page");
style.innerHTML = `
.gameover-page-container {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    transform: scale(2);
    opacity: 0;
    pointer-events: none;
    z-index: 100;
    transition: all 1000ms;
}

.gameover-page-container img {
    position: absolute;
    object-fit: cover;
    height: 100%;
    width: 100%;
    left: 50%;
    top: 50%;
    transform: translate( -50%, -50% );
}


.gameover-page-container.show {
    transform: scale(1);
    opacity: 1;
    pointer-events: auto;
}


.gameover-page-container button {
    position: absolute;
    left: 50%;
    top: 50%;
    font-family: Maplestory Bold;
    font-size: 2rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transform: translate(-50%, -50%) scale(3);
    transition: all 500ms;
    text-shadow: -2px 0 #210d41, 0 3px #e94a23, 2px 0 #210d41, 0 -1px #fdfffd;
    color: #f7de34;
    outline: none;
}

.gameover-page-container button:hover {
    font-size: 3rem;
}

`;



class GameoverPage extends HTMLElement {

    constructor() {
        super();
    }

    static get observedAttributes() {
        return [ "visible" ];
    }

    attributeChangedCallback() {
        if(this.getAttribute('visible') === "true"){
            this.classList.add( "show" );
            return;
        }

        this.classList.remove( "show" );
    }

    connectedCallback() {
        if( !document.head.querySelector(".component-gameover-page") ){
            document.head.appendChild( style );
        }

        this.classList.add("gameover-page-container");
        this.innerHTML =
`
    <img src="./img/page/gameover.png" />
    <button>Retry?</button>
`
        ;

        this.querySelector("button").addEventListener("click", () => {

            const event = new CustomEvent("clickRetryButton", {});
            this.dispatchEvent( event );

        });
    }

}

customElements.define("gameover-page", GameoverPage);