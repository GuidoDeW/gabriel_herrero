const submitBtn = document.getElementById("contact-submit-btn"),
  inputFields = document.querySelectorAll(".input-field");

inputFields.forEach((field) => {
  // Check LS and fill previously filled-out fields
  if (
    localStorage.getItem(`input-${[...inputFields].indexOf(field)}`) !== null
  ) {
    field.value = JSON.parse(
      localStorage.getItem(`input-${[...inputFields].indexOf(field)}`)
    );
  }

  // Store field input to LS
  field.addEventListener("input", () => {
    localStorage.setItem(
      `input-${[...inputFields].indexOf(field)}`,
      JSON.stringify(field.value)
    );
  });

  // Wipe invalid input and error msg on focus
  field.addEventListener("focus", (e) => {
    if (e.target.classList.contains("incorrect-field")) {
      e.target.classList.remove("incorrect-field");
      e.target.setAttribute("placeholder", "");
    }
  });
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let incorrectFields = [];
  //Check required fields
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
    }
  });

  if (incorrectFields.length > 0) {
    // Wipe fields with invalid input and show error msg
    incorrectFields.forEach((field) => {
      field.classList.add("incorrect-field");
      field.value = "";
    });
  } else {
    // Remove LS items upon successful submit (without affecting LS items from other apps)
    inputFields.forEach((field) => {
      if (
        localStorage.getItem(`input-${[...inputFields].indexOf(field)}`) !==
        null
      ) {
        localStorage.removeItem(`input-${[...inputFields].indexOf(field)}`);
      }
    });
    alert("Thank you!");
  }
});

// use regexs to check for correct input. Replace required attribute
// with class (or alter behaviour of required input fields) to display
// red text inside empty required fields upon submit.
// Upon succesful submit, replace form with text (and perhaps an img)
// and a button allowing the user to send another message (reload the form)
// without having to reload the whole page.

// Finally, save input to LS so as to allow reloads without progress loss.
