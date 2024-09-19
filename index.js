
// define items to change colour
const body = document.getElementById("body");
const paragraph = document.getElementsByTagName("p");
const links = document.getElementsByTagName("a");
style = "default"

// check if DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById("changeStyleBtn");

    // Attach event listener to the button
    button.addEventListener("click", function() {
        if (changeStyleBtn.classList.contains("dark")) {
            console.log("default")
            changeStyleBtn.classList.remove("dark");
            changeStyleBtn.classList.add("default");
            // change style to be current style
            changeStyle("default");
            // set button text to be next style
            changeStyleBtn.textContent = "White Theme (!! FLASHBANG WARNING !!)";
        }
        // loaded toggle loop starts here
        else if (changeStyleBtn.classList.contains("default")) {
            console.log("white")
            changeStyleBtn.classList.remove("default");
            changeStyleBtn.classList.add("white");
            changeStyle("white");
            changeStyleBtn.textContent = "Dark Theme";
        }
        else {
            console.log("dark")
            changeStyleBtn.classList.remove("white");
            changeStyleBtn.classList.add("dark");
            changeStyle("dark");
            changeStyleBtn.textContent = "Default Theme";
        }
    });
});


function changeStyle(style) {
    if (style == "dark") {
        document.body.style.backgroundColor = "black";

        for (let i = 0; i < paragraph.length; i++) {
            paragraph[i].style.color = "white"; 
        }       
        for (let i = 0; i < links.length; i++) {
            links[i].style.color = "white";
        }  
    }
    else if (style == "white") {
        document.body.style.backgroundColor = "white";
        for (let i = 0; i < links.length; i++) {
            links[i].style.color = "black";
        }  
        for (let i = 0; i < paragraph.length; i++) {
            paragraph[i].style.color = "black"; 
        }  
    }
    else if (style == "default") {
        document.body.style.backgroundColor = "";
        for (let i = 0; i < links.length; i++) {
            links[i].style.color = ""; // Change the font color to blue
        }  
        for (let i = 0; i < paragraph.length; i++) {
            paragraph[i].style.color = ""; // Change the font color to blue
        }  
    }
};