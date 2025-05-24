  
    const sharePrice = 50;
    const maxLoanAmount = sharePrice * 3;

    const loanForm = document.getElementById("loanForm");

    const inputs = {
      amount: document.getElementById("loan-amount"),
      purpose: document.getElementById("loan-purpose"),
      interest: document.getElementById("loan-interest"),
      duration: document.getElementById("loan-duration"),
    };

    // Helper to set error placeholder text & style
    function setError(input, message) {
      input.value = "";
      input.classList.add("error");
      input.placeholder = message;
    }

    // Reset placeholder style to normal
    function resetError(input, defaultPlaceholder) {
      input.classList.remove("error");
      input.placeholder = defaultPlaceholder;
    }

    loanForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = true;

      // Validate Amount
      const amountVal = parseFloat(inputs.amount.value);
      if (!inputs.amount.value || amountVal <= 0) {
        setError(inputs.amount, "Loan amount required");
        valid = false;
      } else if (amountVal > maxLoanAmount) {
        setError(
          inputs.amount,
          `Max loan ₹${maxLoanAmount} allowed`
        );
        valid = false;
      } else {
        resetError(inputs.amount, "Enter loan amount");
      }

      // Validate Purpose
      if (!inputs.purpose.value.trim()) {
        setError(inputs.purpose, "Purpose required");
        valid = false;
      } else {
        resetError(inputs.purpose, "Write the purpose");
      }

      // Validate Interest
      if (!inputs.interest.value || parseFloat(inputs.interest.value) <= 0) {
        setError(inputs.interest, "Interest rate required");
        valid = false;
      } else {
        resetError(inputs.interest, "Interest rate");
      }

      // Validate Duration
      if (!inputs.duration.value || parseInt(inputs.duration.value) <= 0) {
        setError(inputs.duration, "Duration required");
        valid = false;
      } else {
        resetError(inputs.duration, "Enter duration");
      }

      if (!valid) return;

      // If all valid, make number inputs readonly
      inputs.amount.setAttribute("readonly", true);
      inputs.interest.setAttribute("readonly", true);
      inputs.duration.setAttribute("readonly", true);

      alert("Loan request submitted successfully.");
    });
 