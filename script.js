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
