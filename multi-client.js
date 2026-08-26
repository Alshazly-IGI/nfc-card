/* =========================================================
   NFC CARD - MULTI CLIENT DATA LAYER
   Existing design/QR/theme code can remain in place.
   ========================================================= */

(function () {
    "use strict";

    const DEFAULT_CUSTOMER_ID = "alshazly";
    let currentCustomerId = DEFAULT_CUSTOMER_ID;
    let currentCustomer = null;

    function getCustomerId() {
        const params = new URLSearchParams(window.location.search);
        return (params.get("id") || DEFAULT_CUSTOMER_ID).trim().toLowerCase();
    }

    function setText(selectors, value) {
        if (!value) return;
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                el.textContent = value;
                return;
            }
        }
    }

    function setHref(selectors, value) {
        if (!value) return;
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                el.href = value;
                return;
            }
        }
    }

    function setImage(selectors, value) {
        if (!value) return;
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                el.src = value;
                return;
            }
        }
    }

    function applyCustomer(customer) {
        setText(["#customerName", ".profile-name", ".name"], customer.name);
        setText(["#customerJob", ".profile-job", ".job-title"], customer.job);
        setText(["#customerHeadline", ".profile-headline", ".headline"], customer.headline);
        setText(["#customerCompany", ".company-name", ".company"], customer.company);
        setText(["#customerBio", ".profile-bio", ".bio"], customer.bio);
        setImage(["#customerPhoto", ".profile-photo", ".profile-image"], customer.photo);

        if (customer.phone) {
            setHref(["#phone", "#phoneLink", ".phone-link"], `tel:${customer.phone}`);
        }

        if (customer.whatsapp) {
            const wa = customer.whatsapp.replace(/[^\d]/g, "");
            setHref(["#whatsapp", "#whatsappLink", ".whatsapp-link"], `https://wa.me/${wa}`);
        }

        setHref(["#email", "#emailLink", ".email-link"],
            customer.email ? `mailto:${customer.email}` : "");

        setHref(["#linkedin", "#linkedinLink", ".linkedin-link"],
            customer.linkedin || "");

        setHref(["#website", "#websiteLink", ".website-link"],
            customer.website || "");

        document.title = customer.name
            ? `${customer.name} | NFC Card`
            : "NFC Card";

        // Make the current profile URL available globally for QR/NFC functions.
        window.NFCCurrentProfileURL = buildProfileURL(currentCustomerId);
        window.NFCCurrentCustomer = customer;

        // If the existing page has an element with data-profile-url,
        // keep it synchronized automatically.
        document.querySelectorAll("[data-profile-url]").forEach(el => {
            el.textContent = window.NFCCurrentProfileURL;
            if ("href" in el) el.href = window.NFCCurrentProfileURL;
        });

        document.dispatchEvent(new CustomEvent("nfcCustomerLoaded", {
            detail: {
                id: currentCustomerId,
                customer: customer,
                url: window.NFCCurrentProfileURL
            }
        }));
    }

    function buildProfileURL(customerId) {
        const url = new URL(window.location.href);
        url.search = "";
        url.hash = "";
        url.searchParams.set("id", customerId);
        return url.toString();
    }

    function showNotFound() {
        document.body.classList.add("customer-not-found");

        const targets = [
            "#customerNotFound",
            ".customer-not-found-message"
        ];

        for (const selector of targets) {
            const el = document.querySelector(selector);
            if (el) {
                el.hidden = false;
                el.textContent = "Profile not found or inactive.";
            }
        }
    }

    async function loadCustomer() {
        currentCustomerId = getCustomerId();

        try {
            const response = await fetch("data/customers.json", {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(`customers.json returned ${response.status}`);
            }

            const customers = await response.json();
            const customer = customers[currentCustomerId];

            if (!customer || customer.active === false) {
                showNotFound();
                return;
            }

            currentCustomer = customer;
            applyCustomer(customer);
        } catch (error) {
            console.error("NFC Card customer loading error:", error);
        }
    }

    // Public helpers for the existing QR/NFC code.
    window.getNFCCustomerId = () => currentCustomerId;
    window.getNFCCustomer = () => currentCustomer;
    window.getNFCProfileURL = () => buildProfileURL(currentCustomerId);

    document.addEventListener("DOMContentLoaded", loadCustomer);
})();
