const style = document.createElement("style");
style.classList.add("component-start-button");
style.innerHTML = `
.start-button {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border:  none;
    font-size: 4rem;
    cursor: pointer;
    background-color: transparent;
    padding: 4px 10px;
    z-index: 10;
    transition: all 500ms;
    text-shadow: white 1px 0 10px;
    opacity: 0;
    pointer-events: none;
}

.start-button.show {
    opacity: 1;
    pointer-events: auto;
}

.start-button:hover {
    font-size: 5rem;
    color: white;
    text-shadow: black 1px 0 10px;
}
`;



class StartButton extends HTMLElement {

    constructor() {
        super();

        if( !document.head.querySelector(".component-start-button") ){
            document.head.appendChild( style );
        }

        this.classList.add("start-button");
        this.classList.add("show");
        this.innerText = "START";
    }

    static get observedAttributes() {
        return [ "visible" ];
    }

    attributeChangedCallback() {
        console.log(123);
        if(this.getAttribute('visible') === "true"){
            this.classList.add( "show" );
            return;
        }

        this.classList.remove( "show" );
    }

    connectedCallback() {

    }

}

customElements.define("start-button", StartButton);