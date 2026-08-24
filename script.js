console.log("Welcome");



/* =================================
   QR CODE
================================= */

function openQR() {

    const modal = document.getElementById("qrModal");

    if (!modal) {
        console.error("QR Modal not found!");
        return;
    }

    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
}


function closeQR() {

    const modal = document.getElementById("qrModal");

    if (!modal) {
        return;
    }

    modal.style.display = "none";

    document.body.style.overflow = "";
}


/* =================================
   CLOSE WITH ESC
================================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeQR();

    }

});

/* =================================
   THEME SWITCHER
================================= */

function setTheme(theme) {

    const darkBtn =
        document.getElementById("darkThemeBtn");

    const lightBtn =
        document.getElementById("lightThemeBtn");


    if (theme === "light") {

        document.body.classList.add("light-theme");

        darkBtn.classList.remove("active");

        lightBtn.classList.add("active");

        localStorage.setItem(
            "theme",
            "light"
        );

    } else {

        document.body.classList.remove("light-theme");

        lightBtn.classList.remove("active");

        darkBtn.classList.add("active");

        localStorage.setItem(
            "theme",
            "dark"
        );

    }

}


/* =================================
   LOAD SAVED THEME
================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const savedTheme =
            localStorage.getItem("theme");


        if (savedTheme === "light") {

            setTheme("light");

        } else {

            setTheme("dark");

        }

    }
);
