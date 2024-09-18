document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById("changeStyleBtn");

    // Attach event listener to the button
    button.addEventListener("click", function() {
        if (changeStyleBtn.classList.contains("off")) {
            changeStyleBtn.classList.remove("off");
            changeStyleBtn.classList.add("on");
            changeStyleBtn.textContent = "Dark Theme"; // Change text to "On"
            resetChangeStyle();
        } else {
            changeStyleBtn.classList.remove("on");
            changeStyleBtn.classList.add("off");
            changeStyleBtn.textContent = "Cyberpunk Theme"; // Change text to "Off"
            changeStyle();
        }
    });
});

const body = document.getElementById("body");
const paragraph = document.getElementsByTagName("p");
const links = document.getElementsByTagName("a");

function changeStyle() {   
    document.body.style.backgroundColor = "black";
    for (let i = 0; i < paragraph.length; i++) {
        paragraph[i].style.color = "white"; // Change the font color to blue
    }       
    for (let i = 0; i < links.length; i++) {
        links[i].style.color = "white"; // Change the font color to blue
    }  
}

function resetChangeStyle() {   
    document.body.style.backgroundColor = "";
    for (let i = 0; i < links.length; i++) {
        links[i].style.color = ""; // Change the font color to blue
    }  
    for (let i = 0; i < paragraph.length; i++) {
        paragraph[i].style.color = ""; // Change the font color to blue
    }       
}