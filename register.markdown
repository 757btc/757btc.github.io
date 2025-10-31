---
layout: page
title: Bitcoin Market - Vendor Registration
permalink: /register/
---

## Bitcoin Market - Vendor Registration

<div style="background-color: #f9f9f9; padding: 1.5em; border-radius: 8px; margin-bottom: 2em; border-left: 4px solid #f7931a;">
  <h3 style="margin-top: 0; color: #f7931a;">Event Details</h3>
  <p style="margin-bottom: 0.5em; color: #222;"><strong style="color: #222;">Date:</strong> Saturday, December 6, 2025</p>
  <p style="margin-bottom: 0; color: #222;"><strong style="color: #222;">Time:</strong> 11:00 AM - 3:00 PM</p>
</div>

<p style="font-size: 1.1em; margin-bottom: 2em;">Register as a vendor for our Bitcoin market! This is an opportunity to sell your goods and services while accepting Bitcoin payments.</p>

<div style="background-color: #fff; padding: 1.5em; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
<form id="registration-form" action="https://formsubmit.co/85169e999d1a335d26bc68438b416700" method="POST">
  <!-- Honeypot for spam protection -->
  <input type="text" name="_honey" style="display:none">

  <!-- Disable CAPTCHA (remove this line if you want CAPTCHA enabled) -->
  <input type="hidden" name="_captcha" value="false">

  <!-- Custom success page (optional - customize URL after form is submitted) -->
  <input type="hidden" id="next-url" name="_next" value="https://757btc.org/thanks">

  <!-- Subject line for email -->
  <input type="hidden" name="_subject" value="Bitcoin Market Vendor Registration - Dec 6, 2025">

  <div style="margin-bottom: 1.5em;">
    <label for="name" style="display: block; margin-bottom: 0.5em; font-weight: 600; color: #333;">Name <span style="color: #f7931a;">*</span></label>
    <input type="text" id="name" name="name" required style="width: 100%; padding: 0.75em; border: 2px solid #ddd; border-radius: 6px; color: #222; font-size: 1em; transition: border-color 0.3s;" onfocus="this.style.borderColor='#f7931a'" onblur="this.style.borderColor='#ddd'">
  </div>

  <div style="margin-bottom: 1.5em;">
    <label for="email" style="display: block; margin-bottom: 0.5em; font-weight: 600; color: #333;">Email <span style="color: #f7931a;">*</span></label>
    <input type="email" id="email" name="email" required style="width: 100%; padding: 0.75em; border: 2px solid #ddd; border-radius: 6px; color: #222; font-size: 1em; transition: border-color 0.3s;" onfocus="this.style.borderColor='#f7931a'" onblur="this.style.borderColor='#ddd'">
  </div>

  <div style="margin-bottom: 1.5em;">
    <label for="phone" style="display: block; margin-bottom: 0.5em; font-weight: 600; color: #333;">Phone <span style="color: #999; font-weight: 400;">(optional)</span></label>
    <input type="tel" id="phone" name="phone" style="width: 100%; padding: 0.75em; border: 2px solid #ddd; border-radius: 6px; color: #222; font-size: 1em; transition: border-color 0.3s;" onfocus="this.style.borderColor='#f7931a'" onblur="this.style.borderColor='#ddd'">
  </div>

  <div style="margin-bottom: 1.5em;">
    <label for="business_name" style="display: block; margin-bottom: 0.5em; font-weight: 600; color: #333;">Business/Vendor Name <span style="color: #999; font-weight: 400;">(optional)</span></label>
    <input type="text" id="business_name" name="business_name" style="width: 100%; padding: 0.75em; border: 2px solid #ddd; border-radius: 6px; color: #222; font-size: 1em; transition: border-color 0.3s;" onfocus="this.style.borderColor='#f7931a'" onblur="this.style.borderColor='#ddd'">
  </div>

  <div style="margin-bottom: 1.5em;">
    <label for="products" style="display: block; margin-bottom: 0.5em; font-weight: 600; color: #333;">What products/services will you be selling? <span style="color: #f7931a;">*</span></label>
    <textarea id="products" name="products" rows="4" required style="width: 100%; padding: 0.75em; border: 2px solid #ddd; border-radius: 6px; color: #222; font-size: 1em; transition: border-color 0.3s; resize: vertical;" onfocus="this.style.borderColor='#f7931a'" onblur="this.style.borderColor='#ddd'"></textarea>
  </div>

  <div style="margin-bottom: 1.5em; padding: 1.25em; background-color: #f9f9f9; border-radius: 6px; border: 2px solid #ddd;">
    <label style="display: block; margin-bottom: 1em; font-weight: 600; color: #333;">What Bitcoin payment methods will you accept? <span style="color: #f7931a;">*</span> <span style="color: #666; font-weight: 400; font-size: 0.9em;">(Select all that apply)</span></label>
    <div style="display: grid; gap: 0.75em;">
      <label for="onchain" style="display: flex; align-items: center; cursor: pointer; padding: 0.5em; border-radius: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
        <input type="checkbox" id="onchain" name="payment_onchain" value="yes" style="margin-right: 0.75em; width: 18px; height: 18px; cursor: pointer;">
        <span style="color: #222;">On-Chain Bitcoin</span>
      </label>
      <label for="lightning" style="display: flex; align-items: center; cursor: pointer; padding: 0.5em; border-radius: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
        <input type="checkbox" id="lightning" name="payment_lightning" value="yes" style="margin-right: 0.75em; width: 18px; height: 18px; cursor: pointer;">
        <span style="color: #222;">Lightning Network</span>
      </label>
      <label for="cashu" style="display: flex; align-items: center; cursor: pointer; padding: 0.5em; border-radius: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
        <input type="checkbox" id="cashu" name="payment_cashu" value="yes" style="margin-right: 0.75em; width: 18px; height: 18px; cursor: pointer;">
        <span style="color: #222;">Cashu (eCash)</span>
      </label>
      <label for="nostr_zaps" style="display: flex; align-items: center; cursor: pointer; padding: 0.5em; border-radius: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
        <input type="checkbox" id="nostr_zaps" name="payment_nostr_zaps" value="yes" style="margin-right: 0.75em; width: 18px; height: 18px; cursor: pointer;">
        <span style="color: #222;">Nostr Zaps</span>
      </label>
      <label for="other_payment" style="display: flex; align-items: center; cursor: pointer; padding: 0.5em; border-radius: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
        <input type="checkbox" id="other_payment" name="payment_other" value="yes" style="margin-right: 0.75em; width: 18px; height: 18px; cursor: pointer;">
        <span style="color: #222;">Other (please specify below)</span>
      </label>
    </div>
  </div>

  <div style="margin-bottom: 2em;">
    <label for="additional_info" style="display: block; margin-bottom: 0.5em; font-weight: 600; color: #333;">Additional Information or Questions <span style="color: #999; font-weight: 400;">(optional)</span></label>
    <textarea id="additional_info" name="additional_info" rows="4" style="width: 100%; padding: 0.75em; border: 2px solid #ddd; border-radius: 6px; color: #222; font-size: 1em; transition: border-color 0.3s; resize: vertical;" onfocus="this.style.borderColor='#f7931a'" onblur="this.style.borderColor='#ddd'"></textarea>
  </div>

  <div style="margin-bottom: 1.5em; padding: 1em; background-color: #f9f9f9; border-radius: 6px; border-left: 3px solid #f7931a;">
    <p style="margin: 0; color: #555; font-size: 0.95em;"><strong>Privacy Notice:</strong> We respect your privacy. Your information will only be used to coordinate the Bitcoin market and will never be shared with third parties.</p>
  </div>

  <button type="submit" style="background-color: #f7931a; color: white; padding: 1em 2.5em; border: none; border-radius: 6px; font-size: 1.1em; font-weight: 600; cursor: pointer; width: 100%; transition: background-color 0.3s, transform 0.1s;" onmouseover="this.style.backgroundColor='#e08910'" onmouseout="this.style.backgroundColor='#f7931a'" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
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

<div style="margin-top: 3em; text-align: center;">
  <img src="/assets/img/757btc-seal.jpg" alt="Sic semper tyrannis" style="max-width: 100%; height: auto;">
</div>
