/* =========================================================
   NFC DIGITAL BUSINESS CARD
   Multi-Client JavaScript
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
    jsonFile: data/customers.json",

    defaultProfile: {
        id: "alshazly",
        name: "Alshazly Altieb",
        title: "Healthcare Data Analyst",
        photo: "assets/profile.jpg",
        cv: "assets/cv.pdf"
    }
};


/* =========================================================
   GET PROFILE ID FROM URL
========================================================= */

function getProfileId() {

    const params = new URLSearchParams(window.location.search);

    return params.get("id");
}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    const profileId = getProfileId();

    try {

        const response = await fetch(CONFIG.jsonFile, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(
                `Unable to load ${CONFIG.jsonFile}`
            );
        }

        const data = await response.json();

        /*
         * Support both:
         *
         * {
         *   "clients": [...]
         * }
         *
         * and:
         *
         * [...]
         */

        const profiles = Array.isArray(data)
            ? data
            : data.clients || data.profiles || [];

        /*
         * If no ID was provided,
         * use the first profile or default profile.
         */

        let profile;

        if (profileId) {

            profile = profiles.find(
                item =>
                    String(item.id).toLowerCase() ===
                    String(profileId).toLowerCase()
            );

        } else {

            profile =
                profiles.find(
                    item =>
                        String(item.id).toLowerCase() ===
                        CONFIG.defaultProfile.id.toLowerCase()
                ) ||
                profiles[0];

        }


        /* =================================================
           PROFILE NOT FOUND
        ================================================= */

        if (!profile) {

            showProfileError(
                "Profile not found"
            );

            return;
        }


        /* =================================================
           UPDATE PAGE
        ================================================= */

        updateProfile(profile);

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

    /* -----------------------------------------------------
       Save profile globally
    ----------------------------------------------------- */

    window.currentProfile = profile;


    /* -----------------------------------------------------
       PAGE TITLE
    ----------------------------------------------------- */

    const name =
        profile.name ||
        "Digital Business Card";

    const job =
        profile.title ||
        profile.job ||
        "";

    document.title =
        job
            ? `${name} | ${job}`
            : name;


    /* -----------------------------------------------------
       META DESCRIPTION
    ----------------------------------------------------- */

    const description =
        profile.description ||
        `${name}${job ? " | " + job : ""}`;

    let metaDescription =
        document.querySelector(
            'meta[name="description"]'
        );

    if (!metaDescription) {

        metaDescription =
            document.createElement("meta");

        metaDescription.name =
            "description";

        document.head.appendChild(
            metaDescription
        );
    }

    metaDescription.content =
        description;


    /* -----------------------------------------------------
       NAME
    ----------------------------------------------------- */

    setText(
        [
            "#profileName",
            "#name",
            ".profile-name",
            ".name"
        ],
        name
    );


    /* -----------------------------------------------------
       JOB / TITLE
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       DESCRIPTION
    ----------------------------------------------------- */

    if (profile.bio || profile.description) {

        setText(
            [
                "#profileBio",
                "#bio",
                ".profile-bio",
                ".bio"
            ],
            profile.bio ||
            profile.description
        );
    }


    /* -----------------------------------------------------
       PROFILE IMAGE
    ----------------------------------------------------- */

    if (profile.photo || profile.image) {

        const image =
            profile.photo ||
            profile.image;

        document
            .querySelectorAll(
                ".photo, .profile-photo, #profilePhoto"
            )
            .forEach(img => {

                if (img.tagName === "IMG") {

                    img.src = image;

                    img.alt =
                        `${name} profile photo`;

                }
            });
    }


    /* -----------------------------------------------------
       PHONE
    ----------------------------------------------------- */

    if (profile.phone) {

        updatePhone(
            profile.phone
        );
    }


    /* -----------------------------------------------------
       EMAIL
    ----------------------------------------------------- */

    if (profile.email) {

        updateEmail(
            profile.email
        );
    }


    /* -----------------------------------------------------
       WHATSAPP
    ----------------------------------------------------- */

    if (profile.whatsapp) {

        updateWhatsApp(
            profile.whatsapp
        );
    }


    /* -----------------------------------------------------
       SOCIAL LINKS
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       CV
    ----------------------------------------------------- */

    if (profile.cv) {

        updateCV(
            profile.cv
        );
    }


    /* -----------------------------------------------------
       QR CODE
    ----------------------------------------------------- */

    updateQRCode(
        profile
    );


    /* -----------------------------------------------------
       CONTACT DATA
    ----------------------------------------------------- */

    prepareContactData(
        profile
    );


    /* -----------------------------------------------------
       UPDATE SHARE DATA
    ----------------------------------------------------- */

    updateShareData(
        profile
    );


    /* -----------------------------------------------------
       BODY
    ----------------------------------------------------- */

    document.body.classList.add(
        "profile-loaded"
    );
}


/* =========================================================
   SAFE TEXT UPDATE
========================================================= */

function setText(
    selectors,
    value
) {

    selectors.forEach(selector => {

        document
            .querySelectorAll(selector)
            .forEach(element => {

                element.textContent =
                    value || "";

            });
    });
}


/* =========================================================
   PHONE
========================================================= */

function updatePhone(phone) {

    const cleanPhone =
        String(phone)
            .replace(/[^\d+]/g, "");

    document
        .querySelectorAll(
            'a[href^="tel:"], .phone-link'
        )
        .forEach(link => {

            link.href =
                `tel:${cleanPhone}`;

            if (
                !link.textContent.trim()
            ) {

                link.textContent =
                    phone;
            }
        });
}


/* =========================================================
   EMAIL
========================================================= */

function updateEmail(email) {

    document
        .querySelectorAll(
            'a[href^="mailto:"], .email-link'
        )
        .forEach(link => {

            link.href =
                `mailto:${email}`;

            if (
                !link.textContent.trim()
            ) {

                link.textContent =
                    email;
            }
        });
}


/* =========================================================
   WHATSAPP
========================================================= */

function updateWhatsApp(phone) {

    const cleanPhone =
        String(phone)
            .replace(/\D/g, "");

    document
        .querySelectorAll(
            ".whatsapp-link"
        )
        .forEach(link => {

            link.href =
                `https://wa.me/${cleanPhone}`;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";
        });
}


/* =========================================================
   SOCIAL LINKS
========================================================= */

function updateSocialLink(
    platform,
    url
) {

    if (!url) return;

    document
        .querySelectorAll(
            `.${platform}-link, #${platform}Link`
        )
        .forEach(link => {

            link.href = url;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";
        });
}


/* =========================================================
   CV
========================================================= */

function updateCV(cv) {

    document
        .querySelectorAll(
            ".cv-link, #cvLink"
        )
        .forEach(link => {

            link.href = cv;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";
        });
}


/* =========================================================
   QR CODE
========================================================= */

function updateQRCode(profile) {

    const currentURL =
        window.location.href;

    document
        .querySelectorAll(
            ".qr-code"
        )
        .forEach(img => {

            /*
             * If profile has a specific QR image,
             * use it.
             */

            if (profile.qr) {

                img.src =
                    profile.qr;

            }

            /*
             * Otherwise generate QR
             * from current profile URL.
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
        });
}


/* =========================================================
 
       OPEN QR
    ----------------------------------------------------- */

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

                document.body.style.overflow =
                    "hidden";
            }
        );
    }


    /* -----------------------------------------------------
       CLOSE BUTTON
    ----------------------------------------------------- */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeQR
        );
    }


    /* -----------------------------------------------------
       CLICK BACKGROUND
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       ESC KEY
    ----------------------------------------------------- */

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
        .forEach(button => {

            button.addEventListener(
                "click",
                shareCard
            );
        });


    document
        .querySelectorAll(
            ".share-nfc"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                shareNFC
            );
        });
}


/* =========================================================
   SHARE CARD
========================================================= */

async function shareCard() {

    const profile =
        window.currentProfile;

    if (!profile) return;

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


    /* -----------------------------------------------------
       Web Share API
    ----------------------------------------------------- */

    if (
        navigator.share &&
        navigator.canShare
            ? navigator.canShare(shareData)
            : true
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


    /* -----------------------------------------------------
       FALLBACK
    ----------------------------------------------------- */

    copyToClipboard(
        window.location.href
    );

    showMessage(
        "Profile link copied"
    );
}


/* =========================================================
   SHARE NFC
========================================================= */

async function shareNFC() {

    const url =
        window.location.href;

    /*
     * NFC should contain only the URL.
     *
     * Example:
     *
     * https://alshazly-igi.github.io/nfc-card/?id=alshazly
     */

    try {

        await copyToClipboard(
            url
        );

        showMessage(
            "NFC profile link copied"
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Unable to copy NFC link"
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


    /* -----------------------------------------------------
       Fallback
    ----------------------------------------------------- */

    const textarea =
        document.createElement(
            "textarea"
        );

    textarea.value =
        text;

    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";

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

    const shareTitle =
        profile.title ||
        profile.job ||
        "";

    document
        .querySelectorAll(
            "[data-share-title]"
        )
        .forEach(element => {

            element.dataset.shareTitle =
                `${profile.name} | ${shareTitle}`;
        });
}


/* =========================================================
   VCARD / SAVE CONTACT
========================================================= */

function prepareContactData(
    profile
) {

    document
        .querySelectorAll(
            ".save-contact"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    createVCard(
                        profile
                    );
                }
            );
        });
}


/* =========================================================
   CREATE VCARD
========================================================= */

function createVCard(
    profile
) {

    const name =
        profile.name || "";

    const phone =
        profile.phone || "";

    const email =
        profile.email || "";

    const organization =
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
ORG:${escapeVCard(organization)}
TITLE:${escapeVCard(job)}
TEL;TYPE=CELL:${escapeVCard(phone)}
EMAIL;TYPE=INTERNET:${escapeVCard(email)}
URL:${website}
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
}


/* =========================================================
   ESCAPE VCARD
========================================================= */

function escapeVCard(
    value
) {

    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,");
}


/* =========================================================
   FILE NAME
========================================================= */

function sanitizeFileName(
    name
) {

    return String(name)
        .replace(
            /[<>:"/\\|?*]+/g,
            ""
        )
        .trim()
        || "contact";
}


/* =========================================================
   THEME
========================================================= */

function initTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    if (savedTheme) {

        setTheme(
            savedTheme
        );

    } else {

        setTheme(
            "dark"
        );
    }


    /* -----------------------------------------------------
       Dark button
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Light button
    ----------------------------------------------------- */

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

    const body =
        document.body;

    body.classList.remove(
        "dark",
        "light"
    );

    body.classList.add(
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
   THEME BUTTON STATE
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


    const card =
        document.querySelector(
            ".card"
        );


    if (card) {

        card.innerHTML = `
            <div class="profile-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h2>${message}</h2>
                <p>
                    Please check the profile ID.
                </p>
            </div>
        `;
    }
}


/* =========================================================
   MESSAGE / TOAST
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
   =========================================================
   These allow existing HTML onclick=""
   attributes to continue working.
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
