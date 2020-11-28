const contactForm = document.getElementById("contact-form"),
  submitBtn = document.getElementById("contact-submit-btn"),
  inputFields = document.querySelectorAll(".input-field"),
  errorMsgs = document.querySelectorAll(".incorrect-field-text"),
  submissionMsg = document.getElementById("submission-msg"),
  returnBtn = document.getElementById("return-btn");

inputFields.forEach((field) => {
  if (
    localStorage.getItem(`input-${[...inputFields].indexOf(field)}`) !== null
  ) {
    field.value = JSON.parse(
      localStorage.getItem(`input-${[...inputFields].indexOf(field)}`)
    );
  }

  field.addEventListener("input", () => {
    localStorage.setItem(
      `input-${[...inputFields].indexOf(field)}`,
      JSON.stringify(field.value)
    );
  });
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const incorrectFields = [];

  inputFields.forEach((field) => {
    if (
      field.classList.contains("required-field") &&
      field.value.trim().length === 0
    ) {
      incorrectFields.push(field);
      errorMsgs[[...inputFields].indexOf(field)].innerText =
        "Please fill out this field.";
    } else if (
      field.name === "email" &&
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(field.value)
    ) {
      incorrectFields.push(field);
      errorMsgs[[...inputFields].indexOf(field)].innerText =
        "Please enter a valid email address.";
    } else if (
      field.name === "phone" &&
      field.value.trim().length > 0 &&
      !/^\+?([\.\s\-\(]*\d+[\.\s\-\)]*)+$/g.test(field.value)
    ) {
      incorrectFields.push(field);
      errorMsgs[[...inputFields].indexOf(field)].innerText =
        "Please enter a valid phone number.";
    }
  });

  if (incorrectFields.length > 0) {
    incorrectFields.forEach((field) => {
      field.classList.add("incorrect-field");
      localStorage.removeItem(`input-${[...inputFields].indexOf(field)}`);
    });
  } else {
    errorMsgs.forEach((msg) => (msg.innerHTML = "&nbsp;"));
    contactForm.classList.add("form-submitted");
    submissionMsg.classList.remove("form-pending");
    inputFields.forEach((field) => {
      field.value = "";
      if (
        localStorage.getItem(`input-${[...inputFields].indexOf(field)}`) !==
        null
      ) {
        localStorage.removeItem(`input-${[...inputFields].indexOf(field)}`);
      }
    });
  }
});

returnBtn.addEventListener("click", () => {
  submissionMsg.classList.add("form-pending");
  contactForm.classList.remove("form-submitted");
});
