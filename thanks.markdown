---
layout: page
title: Registration Confirmed
permalink: /thanks/
---

<div id="thank-you-message">
  <h2>Thank You!</h2>

  <p>Your vendor registration for the Bitcoin Market on <strong>Saturday, December 6, 2025</strong> has been successfully submitted.</p>

  <p>We'll review your application and get back to you shortly via email with more details about:</p>

  <ul>
    <li>Booth setup and location</li>
    <li>Market logistics and timing</li>
    <li>Bitcoin payment best practices</li>
    <li>Any additional information you may need</li>
  </ul>

  <p>We're excited to have you join us at the 757btc Bitcoin Market!</p>

  <p style="margin-top: 2em;">
    <a href="/" style="background-color: #f7931a; color: white; padding: 0.75em 2em; text-decoration: none; border-radius: 4px; display: inline-block;">Return to Home</a>
  </p>
</div>

<script>
  // Check if name was passed as URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');

  if (name) {
    // Personalize the message if name is available
    const messageDiv = document.getElementById('thank-you-message');
    const heading = messageDiv.querySelector('h2');
    heading.textContent = `Thank You, ${name}!`;
  }
</script>

---

**Questions?** Feel free to reach out to us at [757btc.org@proton.me](mailto:757btc.org@proton.me)

![Sic semper tyrannis](assets/img/757btc-seal.jpg)
