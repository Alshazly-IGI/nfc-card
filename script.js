/* =========================================================
   NFC DIGITAL BUSINESS CARD
   MULTI-CLIENT SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initTheme();

    loadProfile();

    initQRModal();

    initShareButtons();

});


/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {

    jsonFile: "./data/customers.json",

    defaultProfile: "alshazly"

};


/* =========================================================
   GLOBAL PROFILE
========================================================= */

window.currentProfile = null;


/* =========================================================
   GET PROFILE ID FROM URL
========================================================= */

function getProfileId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    console.log(
        "================================="
    );

    console.log(
        "NFC PROFILE SYSTEM START"
    );

    console.log(
        "================================="
    );


    /* =====================================================
       GET ID FROM URL
    ===================================================== */

    const profileId =
        getProfileId() ||
        CONFIG.defaultProfile;


    console.log(
        "Requested Profile ID:",
        profileId
    );


    try {

        /* =================================================
           LOAD JSON
        ================================================= */

        const response =
            await fetch(
                CONFIG.jsonFile +
                "?v=" +
                Date.now()
            );


        console.log(
            "JSON Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} - Cannot load ${CONFIG.jsonFile}`
            );

        }


        /* =================================================
           PARSE JSON
        ================================================= */

        const data =
            await response.json();


        console.log(
            "Customers JSON:",
            data
        );


        /* =================================================
           FIND PROFILE
           
           JSON structure:

           {
               "alshazly": {
                   ...
               },

               "ahmed": {
                   ...
               }
           }
        ================================================= */

        const profileKey =
            Object.keys(data).find(
                key =>
                    key.toLowerCase() ===
                    String(profileId).toLowerCase()
            );


        console.log(
            "Matched Profile Key:",
            profileKey
        );


        /* =================================================
           PROFILE NOT FOUND
        ================================================= */

        if (!profileKey) {

            showProfileError(
                `Profile "${profileId}" not found`
            );

            return;

        }


        /* =================================================
           GET PROFILE
        ================================================= */

        const profile =
            data[profileKey];


        console.log(
            "Selected Profile:",
            profile
        );


        /* =================================================
           CHECK ACTIVE
        ================================================= */

        if (
            profile.active === false
        ) {

            showProfileError(
                "This profile is inactive"
            );

            return;

        }


        /* =================================================
           ADD ID
        ================================================= */

        profile.id =
            profileKey;


        /* =================================================
           UPDATE PAGE
        ================================================= */

        updateProfile(
            profile
        );


        console.log(
            "Profile loaded successfully"
        );


    }

    catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "PROFILE LOAD ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );


        showProfileError(
            "Unable to load profile"
        );

    }

}
