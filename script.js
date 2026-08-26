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

    jsonFile: "data/customers.json",

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

    const profileId =
        getProfileId();

    console.log(
        "Profile ID:",
        profileId
    );


    try {

        /* =============================================
           LOAD JSON
        ============================================= */

        const response =
            await fetch(
                CONFIG.jsonFile,
                {
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} - ${CONFIG.jsonFile}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Customers JSON:",
            data
        );


        /* =============================================
           SUPPORT DIFFERENT JSON STRUCTURES
        ============================================= */

        let profiles = [];


        if (Array.isArray(data)) {

            profiles = data;

        }

        else if (
            Array.isArray(data.customers)
        ) {

            profiles =
                data.customers;

        }

        else if (
            Array.isArray(data.clients)
        ) {

            profiles =
                data.clients;

        }

        else if (
            Array.isArray(data.profiles)
        ) {

            profiles =
                data.profiles;

        }


        console.log(
            "Profiles:",
            profiles
        );


        /* =============================================
           CHECK DATA
        ============================================= */

        if (
            !Array.isArray(profiles) ||
            profiles.length === 0
        ) {

            throw new Error(
                "No customers found in JSON file"
            );

        }


        /* =============================================
           DETERMINE ID
        ============================================= */

        const selectedId =
            profileId ||
            CONFIG.defaultProfile;


        /* =============================================
           FIND PROFILE
        ============================================= */

        const profile =
            profiles.find(
                item =>
                    String(item.id)
                        .trim()
                        .toLowerCase() ===
                    String(selectedId)
                        .trim()
                        .toLowerCase()
            );


        console.log(
            "Selected profile:",
            profile
        );


        /* =============================================
           PROFILE NOT FOUND
        ============================================= */

        if (!profile) {

            showProfileError(
                `Profile "${selectedId}" not found`
            );

            return;

        }


        /* =============================================
           UPDATE PROFILE
        ============================================= */

        updateProfile(
            profile
        );


    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        showProfileError(
            "Unable to load profile"
        );

    }

}


/* =========================================================
   UPDATE PROFILE
========================================================= */

function updateProfile(profile) {

    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    window.currentProfile =
        profile;


    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    const name =
        profile.name ||
        profile.fullName ||
        "Digital Business Card";


    const job =
        profile.title ||
        profile.job ||
        profile.position ||
        "";


    const description =
        profile.description ||
        profile.bio ||
        "";


    /* =====================================================
       PAGE TITLE
    ===================================================== */

    document.title =
        job
            ? `${name} | ${job}`
            : name;


    /* =====================================================
       META DESCRIPTION
    ===================================================== */

    updateMetaDescription(
        description ||
        `${name}${job ? " | " + job : ""}`
    );


    /* =====================================================
       NAME
    ===================================================== */

    setText(
        [
            "#profileName",
            "#name",
            ".profile-name",
            ".name"
        ],
        name
    );


    /* =====================================================
       TITLE
    ===================================================== */

    setText(
        [
            "#profileTitle",
            "#jobTitle",
            ".profile-title",
            ".job-title",
            ".title"
        ],
        job
    );


    /* =====================================================
       BIO
    ===================================================== */

    setText(
        [
            "#profileBio",
            "#bio",
            ".profile-bio",
            ".bio"
        ],
        description
    );


    /* =====================================================
       PROFILE IMAGE
    ===================================================== */

    const image =
        profile.photo ||
        profile.image ||
        profile.profileImage;


    if (image) {

        document
            .querySelectorAll(
                "#profilePhoto, .profile-photo, .photo"
            )
            .forEach(
                img => {

                    if (
                        img.tagName === "IMG"
                    ) {

                        img.src =
                            image;

                        img.alt =
                            `${name} profile photo`;

                    }

                }
            );

    }


    /* =====================================================
       PHONE
    ===================================================== */

    if (profile.phone) {

        updatePhone(
            profile.phone
        );

    }


    /* =====================================================
       EMAIL
    ===================================================== */

    if (profile.email) {

        updateEmail(
            profile.email
        );

    }


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const whatsapp =
        profile.whatsapp ||
        profile.phone;


    if (whatsapp) {

        updateWhatsApp(
            whatsapp
        );

    }


    /* =====================================================
       SOCIAL MEDIA
    ===================================================== */

    updateSocialLink(
        "linkedin",
        profile.linkedin
    );


    updateSocialLink(
        "github",
        profile.github
    );


    updateSocialLink(
        "facebook",
        profile.facebook
    );


    updateSocialLink(
        "instagram",
        profile.instagram
    );


    updateSocialLink(
        "twitter",
        profile.twitter
    );


    /* =====================================================
       CV
    ===================================================== */

    if (profile.cv) {

        updateCV(
            profile.cv
        );

    }


    /* =====================================================
       QR CODE
    ===================================================== */

    updateQRCode(
        profile
    );


    /* =====================================================
       SAVE CONTACT
    ===================================================== */

    prepareContactData(
        profile
    );


    /* =====================================================
       SHARE DATA
    ===================================================== */

    updateShareData(
        profile
    );


    /* =====================================================
       PROFILE LOADED
    ===================================================== */

    document.body.classList.add(
        "profile-loaded"
    );


    console.log(
        "Profile loaded successfully:",
        name
    );

}


/* =========================================================
   META DESCRIPTION
========================================================= */

function updateMetaDescription(
    description
) {

    let meta =
        document.querySelector(
            'meta[name="description"]'
        );


    if (!meta) {

        meta =
            document.createElement(
                "meta"
            );

        meta.name =
            "description";

        document.head.appendChild(
            meta
        );

    }


    meta.content =
        description;

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    selectors,
    value
) {

    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    element => {

                        element.textContent =
                            value || "";

                    }
                );

        }
    );

}


/* =========================================================
   PHONE
========================================================= */

function updatePhone(
    phone
) {

    const cleanPhone =
        String(phone)
            .replace(
                /[^\d+]/g,
                ""
            );


    document
        .querySelectorAll(
            ".phone-link"
        )
        .forEach(
            link => {

                link.href =
                    `tel:${cleanPhone}`;

            }
        );

}


/* =========================================================
   EMAIL
========================================================= */

function updateEmail(
    email
) {

    document
        .querySelectorAll(
            ".email-link"
        )
        .forEach(
            link => {

                link.href =
                    `mailto:${email}`;

            }
        );

}


/* =========================================================
   WHATSAPP
========================================================= */

function updateWhatsApp(
    phone
) {

    const cleanPhone =
        String(phone)
            .replace(
                /\D/g,
                ""
            );


    document
        .querySelectorAll(
            ".whatsapp-link"
        )
        .forEach(
            link => {

                link.href =
                    `https://wa.me/${cleanPhone}`;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            }
        );

}


/* =========================================================
   SOCIAL LINKS
========================================================= */

function updateSocialLink(
    platform,
    url
) {

    const selectors = [

        `.${platform}-link`,

        `#${platform}Link`

    ];


    const elements = [];


    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    element => {

                        elements.push(
                            element
                        );

                    }
                );

        }
    );


    elements.forEach(
        link => {

            if (!url) {

                link.style.display =
                    "none";

                return;

            }


            link.style.display =
                "";


            link.href =
                url;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

        }
    );

}


/* =========================================================
   CV
========================================================= */

function updateCV(
    cv
) {

    document
        .querySelectorAll(
            ".cv-link, #cvLink"
        )
        .forEach(
            link => {

                link.href =
                    cv;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            }
        );

}


/* =========================================================
   QR CODE
========================================================= */

function updateQRCode(
    profile
) {

    const currentURL =
        window.location.href;


    document
        .querySelectorAll(
            ".qr-code"
        )
        .forEach(
            img => {

                /*
                 * If QR image exists
                 */

                if (profile.qr) {

                    img.src =
                        profile.qr;

                }

                /*
                 * Otherwise generate QR
                 */

                else {

                    img.src =
                        "https://api.qrserver.com/v1/create-qr-code/" +
                        "?size=500x500&data=" +
                        encodeURIComponent(
                            currentURL
                        );

                }


                img.alt =
                    `${profile.name} QR Code`;

            }
        );

}


/* =========================================================
   QR MODAL
========================================================= */

function initQRModal() {

    const modal =
        document.getElementById(
            "qrModal"
        );


    if (!modal) {

        console.warn(
            "QR modal not found"
        );

        return;

    }


    const qrImage =
        document.querySelector(
            ".qr-code"
        );


    const largeQR =
        document.querySelector(
            ".qr-large"
        );


    const closeButton =
        document.querySelector(
            ".qr-close"
        );


    /* =====================================================
       OPEN QR
    ===================================================== */

    if (qrImage) {

        qrImage.addEventListener(
            "click",
            () => {

                if (largeQR) {

                    largeQR.src =
                        qrImage.src;

                }


                modal.style.display =
                    "flex";


                modal.classList.add(
                    "active"
                );


                document.body.style.overflow =
                    "hidden";

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeQR
        );

    }


    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeQR();

            }

        }
    );


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeQR();

            }

        }
    );

}


/* =========================================================
   CLOSE QR
========================================================= */

function closeQR() {

    const modal =
        document.getElementById(
            "qrModal"
        );


    if (!modal) return;


    modal.style.display =
        "none";


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   SHARE BUTTONS
========================================================= */

function initShareButtons() {

    document
        .querySelectorAll(
            ".share-card"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    shareCard
                );

            }
        );


    document
        .querySelectorAll(
            ".share-nfc"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    shareNFC
                );

            }
        );

}


/* =========================================================
   SHARE CARD
========================================================= */

async function shareCard() {

    const profile =
        window.currentProfile;


    if (!profile) {

        showMessage(
            "Profile is not loaded"
        );

        return;

    }


    const name =
        profile.name ||
        "Digital Business Card";


    const title =
        profile.title ||
        profile.job ||
        "";


    const shareData = {

        title:
            title
                ? `${name} | ${title}`
                : name,

        text:
            `View ${name}'s digital business card`,

        url:
            window.location.href

    };


    /* =====================================================
       WEB SHARE
    ===================================================== */

    if (
        navigator.share
    ) {

        try {

            await navigator.share(
                shareData
            );

            return;

        }

        catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    /* =====================================================
       FALLBACK
    ===================================================== */

    try {

        await copyToClipboard(
            window.location.href
        );


        showMessage(
            "Profile link copied"
        );

    }

    catch (error) {

        console.error(
            error
        );

        showMessage(
            "Unable to share profile"
        );

    }

}


/* =========================================================
   SHARE NFC
========================================================= */

async function shareNFC() {

    try {

        await copyToClipboard(
            window.location.href
        );


        showMessage(
            "NFC profile link copied"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showMessage(
            "Unable to copy link"
        );

    }

}


/* =========================================================
   COPY TO CLIPBOARD
========================================================= */

async function copyToClipboard(
    text
) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard.writeText(
            text
        );

        return;

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.focus();


    textarea.select();


    document.execCommand(
        "copy"
    );


    textarea.remove();

}


/* =========================================================
   SHARE DATA
========================================================= */

function updateShareData(
    profile
) {

    const title =
        profile.title ||
        profile.job ||
        "";


    document
        .querySelectorAll(
            "[data-share-title]"
        )
        .forEach(
            element => {

                element.dataset.shareTitle =
                    `${profile.name} | ${title}`;

            }
        );

}


/* =========================================================
   SAVE CONTACT
========================================================= */

function prepareContactData(
    profile
) {

    document
        .querySelectorAll(
            ".save-contact"
        )
        .forEach(
            button => {

                /*
                 * Prevent duplicate events
                 */

                if (
                    button.dataset.contactReady ===
                    "true"
                ) {

                    return;

                }


                button.dataset.contactReady =
                    "true";


                button.addEventListener(
                    "click",
                    () => {

                        createVCard(
                            profile
                        );

                    }
                );

            }
        );

}


/* =========================================================
   CREATE VCARD
========================================================= */

function createVCard(
    profile
) {

    const name =
        profile.name ||
        "";


    const phone =
        profile.phone ||
        "";


    const email =
        profile.email ||
        "";


    const company =
        profile.company ||
        profile.organization ||
        "";


    const job =
        profile.title ||
        profile.job ||
        "";


    const website =
        window.location.href;


    const vcard =
`BEGIN:VCARD
VERSION:3.0
FN:${escapeVCard(name)}
N:${escapeVCard(name)};;;;
ORG:${escapeVCard(company)}
TITLE:${escapeVCard(job)}
TEL;TYPE=CELL:${escapeVCard(phone)}
EMAIL;TYPE=INTERNET:${escapeVCard(email)}
URL:${escapeVCard(website)}
END:VCARD`;


    const blob =
        new Blob(
            [vcard],
            {
                type:
                    "text/vcard;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `${sanitizeFileName(name)}.vcf`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showMessage(
        "Contact file created"
    );

}


/* =========================================================
   VCARD ESCAPE
========================================================= */

function escapeVCard(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /\n/g,
            "\\n"
        )
        .replace(
            /;/g,
            "\\;"
        )
        .replace(
            /,/g,
            "\\,"
        );

}


/* =========================================================
   SANITIZE FILE NAME
========================================================= */

function sanitizeFileName(
    name
) {

    return String(
        name || "contact"
    )
        .replace(
            /[<>:"/\\|?*]+/g,
            ""
        )
        .trim()
        ||
        "contact";

}


/* =========================================================
   THEME
========================================================= */

function initTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    const initialTheme =
        savedTheme ||
        "dark";


    setTheme(
        initialTheme
    );


    /* =====================================================
       DARK BUTTON
    ===================================================== */

    const darkButton =
        document.getElementById(
            "darkThemeBtn"
        );


    if (darkButton) {

        darkButton.addEventListener(
            "click",
            () => {

                setTheme(
                    "dark"
                );

            }
        );

    }


    /* =====================================================
       LIGHT BUTTON
    ===================================================== */

    const lightButton =
        document.getElementById(
            "lightThemeBtn"
        );


    if (lightButton) {

        lightButton.addEventListener(
            "click",
            () => {

                setTheme(
                    "light"
                );

            }
        );

    }

}


/* =========================================================
   SET THEME
========================================================= */

function setTheme(
    theme
) {

    if (
        theme !== "dark" &&
        theme !== "light"
    ) {

        theme =
            "dark";

    }


    document.body.classList.remove(
        "dark",
        "light"
    );


    document.body.classList.add(
        theme
    );


    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    localStorage.setItem(
        "theme",
        theme
    );


    updateThemeButtons(
        theme
    );

}


/* =========================================================
   THEME BUTTONS
========================================================= */

function updateThemeButtons(
    theme
) {

    const darkButton =
        document.getElementById(
            "darkThemeBtn"
        );


    const lightButton =
        document.getElementById(
            "lightThemeBtn"
        );


    if (darkButton) {

        darkButton.classList.toggle(
            "active",
            theme === "dark"
        );

    }


    if (lightButton) {

        lightButton.classList.toggle(
            "active",
            theme === "light"
        );

    }

}


/* =========================================================
   PROFILE ERROR
========================================================= */

function showProfileError(
    message
) {

    console.error(
        message
    );


    document.title =
        "Profile Not Found";


    const name =
        document.getElementById(
            "profileName"
        );


    const title =
        document.getElementById(
            "profileTitle"
        );


    if (name) {

        name.textContent =
            "Profile Not Found";

    }


    if (title) {

        title.textContent =
            message;

    }


    const bio =
        document.getElementById(
            "profileBio"
        );


    if (bio) {

        bio.textContent =
            "Please check the profile ID.";

    }

}


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showMessage(
    message
) {

    let toast =
        document.getElementById(
            "toastMessage"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toastMessage";


        toast.className =
            "toast-message";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.setTheme =
    setTheme;


window.closeQR =
    closeQR;


window.shareCard =
    shareCard;


window.shareNFC =
    shareNFC;


window.createVCard =
    createVCard;
