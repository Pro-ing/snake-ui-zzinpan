const style = document.createElement("style");
style.classList.add("component-start-button");
style.innerHTML = `
.start-button {
    position: fixed;
    left: 50%;
    top: calc( 50% - 50px );
    transform: translate(-50%, -50%);
    border:  none;
    font-size: 4rem;
    cursor: pointer;
    background-color: transparent;
    padding: 4px 10px;
    z-index: 10;
    text-shadow: white 1px 0 10px;
    color: #644724;
    transition: font-size 500ms, color 500ms, top 500ms, opacity 500ms, text-shadow 500ms;
    opacity: 0;
    pointer-events: none;
}

.start-button.show {
    opacity: 1;
    top: 50%;
    pointer-events: auto;
}

.start-button:hover {
    font-size: 5rem;
    color: white;
    text-shadow: #644724 1px 0 10px;
}
`;



class StartButton extends HTMLElement {

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
        if( !document.head.querySelector(".component-start-button") ){
            document.head.appendChild( style );
        }

        this.classList.add("start-button");
        this.classList.add("show");
        this.innerText = "START";
    }

}

customElements.define("start-button", StartButton);