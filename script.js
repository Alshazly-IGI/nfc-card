console.log("Welcome");
const qrModal = document.getElementById("qrModal");

qrModal.addEventListener("click", function(event) {

    if (event.target === qrModal) {

        closeQR();

    }

});
