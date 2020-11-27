const contactForm = document.getElementById("contact-form"),
  submitBtn = document.getElementById("contact-submit-btn"),
  inputFields = document.querySelectorAll(".input-field"),
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

  field.addEventListener("focus", (e) => {
    if (e.target.classList.contains("incorrect-field")) {
      e.target.classList.remove("incorrect-field");
      e.target.setAttribute("placeholder", "");
    }
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
      field.setAttribute("placeholder", "Please fill out this field.");
    } else if (
      field.name === "email" &&
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(field.value)
    ) {
      incorrectFields.push(field);
      field.setAttribute("placeholder", "Please enter a valid email address.");
    } else if (
      field.name === "phone" &&
      field.value.trim().length > 0 &&
      !/^\+?([\.\s\-\(]*\d+[\.\s\-\)]*)+$/g.test(field.value)
    ) {
      incorrectFields.push(field);
      field.setAttribute("placeholder", "Please enter a valid phone number.");
    }
  });

  if (incorrectFields.length > 0) {
    incorrectFields.forEach((field) => {
      field.classList.add("incorrect-field");
      field.value = "";
      localStorage.removeItem(`input-${[...inputFields].indexOf(field)}`);
    });
  } else {
    contactForm.classList.add("form-submitted");
    submissionMsg.classList.remove("form-pending");
    inputFields.forEach((field) => {
      field.value = "";
      field.setAttribute("placeholder", "");
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
