const modal = document.getElementById("quoteModal");
const openButtons = document.querySelectorAll("[data-open-quote]");
const closeButton = document.getElementById("closeQuote");
const prevButton = document.getElementById("prevStep");
const nextButton = document.getElementById("nextStep");
const copyButton = document.getElementById("copyQuote");
const emailLink = document.getElementById("emailQuote");
const steps = Array.from(document.querySelectorAll(".quote-step"));
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const estimateValue = document.getElementById("estimateValue");
const estimateBreakdown = document.getElementById("estimateBreakdown");
const quoteForm = document.getElementById("quoteForm");
const sizeCards = Array.from(document.querySelectorAll("[data-quote-size]"));
const contactFab = document.querySelector("[data-contact-fab]");
const contactFabToggle = contactFab?.querySelector(".contact-fab-toggle");
const callTriggers = Array.from(document.querySelectorAll("[data-call-trigger]"));
const dynamicHoverCards = Array.from(
  document.querySelectorAll(".size-card, .service-card-visual, .benefit-card, .pricing-panel")
);

let currentStep = 1;
let hasTrackedQuoteConversion = false;

const pricing = {
  tvSize: { small: 89, medium: 129, large: 159, xl: 219 },
  mountType: { existing: 0, fixed: 34, tilt: 44, motion: 64 },
  wireType: { none: 0, external: 44, inwall: 94 },
  wallType: { drywall: 0, brick: 35, concrete: 45, fireplace: 75 },
  addons: { soundbar: 74, shelf: 44, dismount: 44 }
};

const labels = {
  tvSize: {
    small: '31" or smaller',
    medium: '32" to 59"',
    large: '60" or larger (1 tech and your help)',
    xl: '60" or larger (2 techs)'
  },
  mountType: {
    existing: "I already have a mount",
    fixed: "Fixed mount",
    tilt: "Tilting mount",
    motion: "Full-motion mount"
  },
  wireType: {
    none: "No concealment",
    external: "External raceway",
    inwall: "In-wall concealment"
  },
  wallType: {
    drywall: "Drywall / wood studs",
    brick: "Brick",
    concrete: "Concrete / block",
    fireplace: "Above fireplace"
  },
  addons: {
    soundbar: "Soundbar install",
    shelf: "Floating shelf install",
    dismount: "Remove old TV"
  }
};

function setStep(stepNumber) {
  currentStep = Math.max(1, Math.min(stepNumber, steps.length));

  steps.forEach((step) => {
    step.classList.toggle("is-active", Number(step.dataset.step) === currentStep);
  });

  const visualSteps = steps.length;
  const percent = (currentStep / visualSteps) * 100;
  progressFill.style.width = `${percent}%`;
  progressLabel.textContent = currentStep < visualSteps ? `Step ${currentStep} of ${visualSteps - 1}` : "Summary";

  prevButton.style.visibility = currentStep === 1 ? "hidden" : "visible";
  nextButton.textContent = currentStep === visualSteps - 1 ? "See Estimate" : "Next";
  nextButton.style.display = currentStep === visualSteps ? "none" : "inline-flex";

  if (currentStep === visualSteps) {
    trackQuoteConversion();
  }
}

function getRadioValue(name) {
  return quoteForm.querySelector(`input[name="${name}"]:checked`)?.value;
}

function getCheckboxValues(name) {
  return Array.from(quoteForm.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function buildEstimate() {
  const name = quoteForm.elements.name.value.trim();
  const phone = quoteForm.elements.phone.value.trim();
  const zip = quoteForm.elements.zip.value.trim();
  const tvSize = getRadioValue("tvSize");
  const mountType = getRadioValue("mountType");
  const wireType = getRadioValue("wireType");
  const wallType = getRadioValue("wallType");
  const addons = getCheckboxValues("addons");

  const base =
    pricing.tvSize[tvSize] +
    pricing.mountType[mountType] +
    pricing.wireType[wireType] +
    pricing.wallType[wallType] +
    addons.reduce((sum, addon) => sum + pricing.addons[addon], 0);

  const low = Math.max(base - 20, 79);
  const high = base + 40;

  const breakdownParts = [
    `TV size: ${labels.tvSize[tvSize]}`,
    `mount: ${labels.mountType[mountType]}`,
    `wiring: ${labels.wireType[wireType]}`,
    `wall: ${labels.wallType[wallType]}`
  ];

  if (addons.length) {
    breakdownParts.push(`add-ons: ${addons.map((addon) => labels.addons[addon]).join(", ")}`);
  }

  if (zip) {
    breakdownParts.push(`ZIP: ${zip}`);
  }

  if (name || phone) {
    breakdownParts.push(`contact: ${[name, phone].filter(Boolean).join(" / ")}`);
  }

  const summary = `TV Mount 360 quote estimate\nEstimated range: $${low} - $${high}\n${breakdownParts.join("\n")}`;
  const encodedSummary = encodeURIComponent(summary);

  estimateValue.textContent = `$${low} - $${high}`;
  estimateBreakdown.textContent = breakdownParts.join(" • ");
  emailLink.href = `mailto:tvmount360@gmail.com?subject=TV%20Mount%20360%20Quote&body=${encodedSummary}`;
  copyButton.dataset.summary = summary;
}

function trackQuoteConversion() {
  if (hasTrackedQuoteConversion) {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: "AW-18039081910/IcXJCK2WvI8cELaX2plD",
    value: 1.0,
    currency: "USD"
  });

  hasTrackedQuoteConversion = true;
}

function openQuote() {
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "open");
  }

  hasTrackedQuoteConversion = false;
  setStep(1);
}

function openQuoteWithSize(size) {
  const radio = quoteForm.querySelector(`input[name="tvSize"][value="${size}"]`);

  if (radio) {
    radio.checked = true;
  }

  openQuote();
  setStep(2);
}

function closeQuote() {
  modal.close();
}

function triggerPhoneCall(phoneNumber) {
  if (!phoneNumber) {
    return;
  }

  window.location.href = `tel:${phoneNumber}`;
}

function setContactFabState(isOpen) {
  if (!contactFab || !contactFabToggle) {
    return;
  }

  contactFab.classList.toggle("is-open", isOpen);
  contactFabToggle.setAttribute("aria-expanded", String(isOpen));
  contactFabToggle.setAttribute("aria-label", isOpen ? "Close contact links" : "Open contact links");

  const panel = contactFab.querySelector(".contact-fab-panel");
  if (panel) {
    panel.setAttribute("aria-hidden", String(!isOpen));
  }
}

function getDynamicSettings(card) {
  if (card.classList.contains("service-card-visual")) {
    return { lift: 7, scale: 1.025, tilt: 5, shift: 6 };
  }

  if (card.classList.contains("benefit-card")) {
    return { lift: 5, scale: 1.02, tilt: 4.2, shift: 5 };
  }

  if (card.classList.contains("pricing-panel")) {
    return { lift: 4, scale: 1.015, tilt: 3.4, shift: 4 };
  }

  return { lift: 4, scale: 1.015, tilt: 3.8, shift: 4.5 };
}

function initDynamicHoverCards() {
  if (!dynamicHoverCards.length) {
    return;
  }

  const canUseDynamicHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canUseDynamicHover || reducedMotion) {
    return;
  }

  dynamicHoverCards.forEach((card) => {
    const { lift, scale, tilt, shift } = getDynamicSettings(card);
    let frame = 0;

    card.classList.add("dynamic-hover-card");

    const applyDynamicTransform = (event) => {
      const rect = card.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      const rotateY = normalizedX * tilt;
      const rotateX = normalizedY * -tilt;
      const moveX = normalizedX * shift;
      const moveY = normalizedY * shift - lift;

      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        card.style.transform =
          `perspective(980px) translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)` +
          ` rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale})`;
      });
    };

    const activate = () => {
      card.classList.add("is-dynamic-hovered");
    };

    const reset = () => {
      card.classList.remove("is-dynamic-hovered");
      card.style.transform = "";

      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    card.addEventListener("pointerenter", activate);
    card.addEventListener("pointermove", applyDynamicTransform);
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
    card.addEventListener("blur", reset);
  });
}

openButtons.forEach((button) => {
  button.addEventListener("click", openQuote);
});

sizeCards.forEach((card) => {
  const openSelectedQuote = () => openQuoteWithSize(card.dataset.quoteSize);

  card.addEventListener("click", openSelectedQuote);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSelectedQuote();
    }
  });
});

closeButton.addEventListener("click", closeQuote);

prevButton.addEventListener("click", () => {
  setStep(currentStep - 1);
});

nextButton.addEventListener("click", () => {
  if (currentStep === steps.length - 1) {
    buildEstimate();
  }

  setStep(currentStep + 1);
});

copyButton.addEventListener("click", async () => {
  const summary = copyButton.dataset.summary;

  if (!summary) {
    return;
  }

  try {
    await navigator.clipboard.writeText(summary);
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = "Copy Summary";
    }, 1200);
  } catch {
    copyButton.textContent = "Copy failed";
  }
});

modal.addEventListener("click", (event) => {
  const shell = modal.querySelector(".quote-shell");

  if (!shell.contains(event.target)) {
    closeQuote();
  }
});

if (contactFab && contactFabToggle) {
  contactFabToggle.addEventListener("click", () => {
    setContactFabState(!contactFab.classList.contains("is-open"));
  });

  document.addEventListener("click", (event) => {
    if (!contactFab.contains(event.target)) {
      setContactFabState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setContactFabState(false);
    }
  });
}

callTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const phoneNumber = trigger.dataset.callTrigger;

    if (!phoneNumber) {
      return;
    }

    event.preventDefault();
    triggerPhoneCall(phoneNumber);
  });
});

setStep(1);
initDynamicHoverCards();
