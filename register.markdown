---
layout: page
title: Bitcoin Market - Vendor Registration
permalink: /register/
---

## Bitcoin Market - Vendor Registration

<div class="market-event-info">
  <h3>Event Details</h3>
  <p><strong>Date:</strong> Saturday, December 13, 2025</p>
  <p><strong>Time:</strong> 11:00 AM - 3:00 PM (vendors should arrive at 10)</p>
  <p><strong>Location:</strong> <a href="https://beachmontessorichristianacademy.com" target="blank">Beach Montessori Christian Academy</a> - 1101 Eaglewood Dr, Virginia Beach, VA 23454</p>
</div>

<p class="market-intro">Register as a vendor for our Bitcoin market! This is an opportunity to sell your goods and services while accepting Bitcoin payments.</p>

<div class="market-form-container">
<form id="registration-form" action="https://formsubmit.co/85169e999d1a335d26bc68438b416700" method="POST">
  <!-- Honeypot for spam protection -->
  <input type="text" name="_honey" style="display:none">

  <!-- Disable CAPTCHA (remove this line if you want CAPTCHA enabled) -->
  <input type="hidden" name="_captcha" value="false">

  <!-- Custom success page (optional - customize URL after form is submitted) -->
  <input type="hidden" id="next-url" name="_next" value="https://757btc.org/thanks">

  <!-- Subject line for email -->
  <input type="hidden" name="_subject" value="Bitcoin Market Vendor Registration - Dec 6, 2025">

  <div class="market-form-field">
    <label for="name" class="market-form-label">Name <span class="market-required">*</span></label>
    <input type="text" id="name" name="name" required class="market-input">
  </div>

  <div class="market-form-field">
    <label for="email" class="market-form-label">Email <span class="market-required">*</span></label>
    <input type="email" id="email" name="email" required class="market-input">
  </div>

  <div class="market-form-field">
    <label for="phone" class="market-form-label">Phone <span class="market-optional">(optional)</span></label>
    <input type="tel" id="phone" name="phone" class="market-input">
  </div>

  <div class="market-form-field">
    <label for="business_name" class="market-form-label">Business/Vendor Name <span class="market-optional">(optional)</span></label>
    <input type="text" id="business_name" name="business_name" class="market-input">
  </div>

  <div class="market-form-field">
    <label for="products" class="market-form-label">What products/services will you be selling? <span class="market-required">*</span></label>
    <textarea id="products" name="products" rows="4" required class="market-textarea"></textarea>
  </div>

  <div class="market-payment-group">
    <label class="market-form-label">What Bitcoin payment methods will you accept? <span class="market-required">*</span> <span class="market-label-note">(Select all that apply)</span></label>
    <div class="market-checkbox-list">
      <label for="onchain" class="market-checkbox-label">
        <input type="checkbox" id="onchain" name="payment_onchain" value="yes">
        <span>On-Chain Bitcoin</span>
      </label>
      <label for="lightning" class="market-checkbox-label">
        <input type="checkbox" id="lightning" name="payment_lightning" value="yes">
        <span>Lightning Network</span>
      </label>
      <label for="cashu" class="market-checkbox-label">
        <input type="checkbox" id="cashu" name="payment_cashu" value="yes">
        <span>Cashu (eCash)</span>
      </label>
      <label for="nostr_zaps" class="market-checkbox-label">
        <input type="checkbox" id="nostr_zaps" name="payment_nostr_zaps" value="yes">
        <span>Nostr Zaps</span>
      </label>
      <label for="other_payment" class="market-checkbox-label">
        <input type="checkbox" id="other_payment" name="payment_other" value="yes">
        <span>Other (please specify below)</span>
      </label>
    </div>
  </div>

  <div class="market-form-field">
    <label for="additional_info" class="market-form-label">Additional Information or Questions <span class="market-optional">(optional)</span></label>
    <textarea id="additional_info" name="additional_info" rows="4" class="market-textarea"></textarea>
  </div>

  <div class="market-privacy-notice">
    <p><strong>Privacy Notice:</strong> We respect your privacy. Your information will only be used to coordinate the Bitcoin market and will never be shared with third parties.</p>
  </div>

  <button type="submit" class="market-submit-btn">
    Submit Registration
  </button>
</form>
</div>

<script>
  // Add event listener to capture name before form submission
  document.getElementById('registration-form').addEventListener('submit', function(e) {
    const nameField = document.getElementById('name');
    const nextUrlField = document.getElementById('next-url');

    if (nameField && nameField.value) {
      // Construct absolute URL dynamically based on current origin (works for both local and production)
      const encodedName = encodeURIComponent(nameField.value);
      const baseUrl = window.location.origin;
      nextUrlField.value = baseUrl + '/thanks?name=' + encodedName;
    } else {
      // Fallback to thanks page without name parameter
      const baseUrl = window.location.origin;
      nextUrlField.value = baseUrl + '/thanks';
    }
  });
</script>

---

![Sic semper tyrannis](/assets/img/757circlenostr02-alpha.png)
