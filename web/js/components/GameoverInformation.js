const style = document.createElement("style");
style.classList.add("component-gameover-information");
style.innerHTML = `
.gameover-information-container {
    position: fixed;
    left: 50%;
    top: calc( 50% - 50px );
    transform: translate(-50%, -50%);
    border:  none;
    font-size: 4rem;
    background-color: transparent;
    padding: 4px 10px;
    z-index: 10;
    transition: font-size 500ms, color 500ms, top 500ms, opacity 500ms, text-shadow 500ms;
    text-shadow: white 1px 0 10px;
    text-align: center;
    color: #644724;
    opacity: 0;
    pointer-events: none;
}


.gameover-information-container.show {
    opacity: 1;
    top: 50%;
    pointer-events: auto;
}


.gameover-information-container .retry-button {
    font-size: 3rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: font-size 500ms, color 500ms, top 500ms, opacity 500ms, text-shadow 500ms;
    text-shadow: white 1px 0 10px;
    color: #644724;
    outline: none;
}

.gameover-information-container .retry-button:hover {
    font-size: 5rem;
    color: white;
    text-shadow: #644724 1px 0 10px;
}

`;



class GameoverInformation extends HTMLElement {

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
        if( !document.head.querySelector(".component-gameover-information") ){
            document.head.appendChild( style );
        }

        this.classList.add("gameover-information-container");
        this.innerHTML =
`<div>
    <div>GAME OVER</div>
    <div>
        <button class="retry-button">Retry?</button>   
    </div>
</div>`
        ;

        this.querySelector(".retry-button").addEventListener("click", () => {

            const event = new CustomEvent("clickRetryButton", {});
            this.dispatchEvent( event );

        });
    }

}

customElements.define("gameover-information", GameoverInformation);