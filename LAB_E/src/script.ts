function loadLink(linkElementColor: string) {
    if (linkElementColor === "red") {
        const linkElementRed = document.createElement("link");
        linkElementRed.setAttribute("rel", "stylesheet");
        linkElementRed.setAttribute("href", "style-red.css");
        return linkElementRed;
    } else if (linkElementColor === "blue") {
        const linkElementBlue = document.createElement("link");
        linkElementBlue.setAttribute("rel", "stylesheet");
        linkElementBlue.setAttribute("href", "style-blue.css");
        return linkElementBlue;
    } else if (linkElementColor === "green") {
        const linkElementGreen = document.createElement("link");
        linkElementGreen.setAttribute("rel", "stylesheet");
        linkElementGreen.setAttribute("href", "style-green.css");
        return linkElementGreen;
    }
}
document.head.appendChild(loadLink("red")!);

const themeRed = document.querySelector("#theme-red");
const themeGreen = document.querySelector("#theme-green");
const themeBlue = document.querySelector("#theme-blue");

themeRed?.addEventListener("click", changeThemeRed)
themeGreen?.addEventListener("click", changeThemeGreen)
themeBlue?.addEventListener("click", changeThemeBlue)

function removeAllThemes(){
    document.head.querySelectorAll("link[rel='stylesheet']")
}
function changeThemeRed() {
    removeAllThemes();
    document.head.appendChild(loadLink("red")!);
}

function changeThemeGreen() {
    removeAllThemes();
    document.head.appendChild(loadLink("green")!);
}

function changeThemeBlue() {
    removeAllThemes();
    document.head.appendChild(loadLink("blue")!);
}