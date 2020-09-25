class NavBarElem extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = ` <nav class="navbar navbar-expand-lg navbar-light bg-light"> <a class="navbar-brand" href="loggedIn.html"><img src="./images/brixy.net logo@2x.png" class="brixyLogo"></a> <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarNavDropdown"> <ul class="navbar-nav ml-auto"> <li class="nav-item"> <a class="nav-link" href="index.html" id="nav_signOut">Sign Out</a> </li> </div> </nav> `
    }
}

window.customElements.define('nav-bar-elem', NavBarElem);
