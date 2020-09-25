class BrickLayer extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = `<div class="brickLayer">
        <p>
            <span id="noOfBricks">...</span>
            <img src="./images/bricks-30.png" class="icon-brick" style="height: 32px; width: 32px;"/>
            <span id="ticket">...</span>
            <img src="images/tickets-23.png" class="icon-brick" style="height: 30px; width: 30px;"/></p>
    </div>
`
    }
}

window.customElements.define('brick-layer',BrickLayer);