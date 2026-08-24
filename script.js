console.log("Welcome");

document.addEventListener("DOMContentLoaded", function () {

    const qrModal = document.getElementById("qrModal");

    if (!qrModal) {
        console.error("QR Modal not found");
        return;
    }

    qrModal.addEventListener("click", function (event) {

        // Close only when clicking the dark background
        if (event.target === qrModal) {
            closeQR();
        }

    });

});
