// Daily Drop 757 - JSON-driven Bitcoin Data Poster
// Loads all configuration and content from poster-data.json

(function() {
  'use strict';

  let config = null;
  let updateIntervalId = null;

  // Load the poster configuration
  async function loadConfig() {
    try {
      const response = await fetch('/assets/data/poster-data.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }
      config = await response.json();
      console.log('✓ Poster configuration loaded');
      return config;
    } catch (error) {
      console.error('✗ Error loading poster configuration:', error);
      return null;
    }
  }

  // Build the poster HTML from JSON data
  function buildPosterHTML(data) {
    const meetupItems = data.meetups.list.map(meetup => `
      <li>
        <strong>${meetup.frequency}</strong> ${meetup.schedule}<br>
        at ${meetup.location}<br>
        <span class="time">${meetup.time}</span>
      </li>
    `).join('');

    const linkItems = data.links.map(link => `
      <p class="link-item">
        <span class="link-label">${link.label}</span><br>
        <a href="${link.url}" target="_blank">${link.text}</a>
      </p>
    `).join('');

    return `
      <div class="poster-header">
        <h3>${data.header}</h3>
      </div>
      
      <div class="bitcoin-stats">
        <div class="stat-item">
          <span class="stat-label">Block:</span>
          <span class="stat-value block-height">Loading...</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Price:</span>
          <span class="stat-value btc-price">Loading...</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Fees:</span>
          <span class="stat-value fee-rate">Loading...</span>
        </div>
      </div>
      
      <div class="update-info">
        <span class="last-updated">Connecting...</span>
      </div>

      <div class="meetups-section">
        <h4>${data.meetups.title}</h4>
        <ul class="meetup-list">
          ${meetupItems}
        </ul>
      </div>

      <div class="links-section">
        ${linkItems}
      </div>
    `;
  }

  // Build mission objectives from JSON data - Compact checkbox style
  function buildMissionObjectives(data) {
    if (!data.meetups || !data.meetups.list) return;
    
    const missionsList = document.getElementById('missions-list');
    if (!missionsList) return;
    
    // Get current date info
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Helper function to check if meetup has passed this month
    function hasMeetupPassed(meetup) {
      const frequency = meetup.frequency.toLowerCase();
      
      // Calculate the target day of month for this meetup
      let targetDay = null;
      
      if (frequency.includes('first wednesday')) {
        targetDay = getNthDayOfMonth(currentYear, currentMonth, 3, 1); // Wednesday = 3, 1st occurrence
      } else if (frequency.includes('first saturday')) {
        targetDay = getNthDayOfMonth(currentYear, currentMonth, 6, 1); // Saturday = 6, 1st occurrence
      } else if (frequency.includes('second saturday')) {
        targetDay = getNthDayOfMonth(currentYear, currentMonth, 6, 2); // Saturday = 6, 2nd occurrence
      } else if (frequency.includes('third thursday')) {
        targetDay = getNthDayOfMonth(currentYear, currentMonth, 4, 3); // Thursday = 4, 3rd occurrence
      }
      
      // Check if we've passed this meetup day
      return targetDay !== null && currentDay > targetDay;
    }
    
    // Helper to get the Nth occurrence of a weekday in a month
    function getNthDayOfMonth(year, month, dayOfWeek, occurrence) {
      let count = 0;
      let day = 1;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      while (day <= daysInMonth) {
        const date = new Date(year, month, day);
        if (date.getDay() === dayOfWeek) {
          count++;
          if (count === occurrence) {
            return day;
          }
        }
        day++;
      }
      return null;
    }
    
    // Create compact format with smart checkboxes
    const missionsHTML = data.meetups.list.map((meetup, index) => {
      // Create short label (e.g., "1ST WED - CHICHOS")
      const freqShort = meetup.frequency.toUpperCase();
      const locShort = meetup.location.split(' ')[0].toUpperCase(); // First word of location
      const label = `${freqShort} - ${locShort}`;
      
      // Check if this meetup has passed
      const completed = hasMeetupPassed(meetup);
      const completedClass = completed ? 'completed' : '';
      
      return `
        <li class="hud-mission-item ${completedClass}" data-mission="${index}">
          <div class="hud-mission-content">
            <div class="hud-mission-info">
              <div class="hud-mission-label">${label}</div>
            </div>
            <div class="hud-mission-time">${meetup.time}</div>
          </div>
        </li>
      `;
    }).join('');
    
    missionsList.innerHTML = missionsHTML;
    console.log('✓ Mission objectives loaded (compact style with date checking)');
  }

  // Function to update block height
  async function updateBlockHeight() {
    if (!config || !config.bitcoinStats.enabled) return;
    
    try {
      const response = await fetch(config.bitcoinStats.apiUrls.blockHeight, {
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const height = await response.text();
      const formattedHeight = parseInt(height).toLocaleString();
      
      // Update all block height elements (sidebar and HUD)
      const blockElements = document.querySelectorAll('.stat-value.block-height, .hud-stat-value.block-height');
      blockElements.forEach(el => {
        el.textContent = formattedHeight;
        el.classList.add('updating');
        setTimeout(() => el.classList.remove('updating'), 500);
      });
      
      console.log('✓ Block height updated:', height);
    } catch (error) {
      console.error('✗ Error fetching block height:', error);
      const blockElements = document.querySelectorAll('.stat-value.block-height, .hud-stat-value.block-height');
      blockElements.forEach(el => el.textContent = 'Error');
    }
  }

  // Function to update Bitcoin price
  async function updatePrice() {
    if (!config || !config.bitcoinStats.enabled) return;
    
    try {
      const response = await fetch(config.bitcoinStats.apiUrls.price, {
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const prices = await response.json();
      if (prices.USD) {
        const formattedPrice = `$${parseInt(prices.USD).toLocaleString()}`;
        
        // Update all price elements (sidebar and HUD)
        const priceElements = document.querySelectorAll('.stat-value.btc-price, .hud-stat-value.btc-price');
        priceElements.forEach(el => {
          el.textContent = formattedPrice;
          el.classList.add('updating');
          setTimeout(() => el.classList.remove('updating'), 500);
        });
      }
      console.log('✓ Price updated:', prices.USD);
    } catch (error) {
      console.error('✗ Error fetching price:', error);
      const priceElements = document.querySelectorAll('.stat-value.btc-price, .hud-stat-value.btc-price');
      priceElements.forEach(el => el.textContent = 'Error');
    }
  }

  // Function to update fee recommendations
  async function updateFees() {
    if (!config || !config.bitcoinStats.enabled) return;
    
    try {
      const response = await fetch(config.bitcoinStats.apiUrls.fees, {
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const fees = await response.json();
      const feeDisplay = `${fees.fastestFee}/${fees.halfHourFee}/${fees.hourFee} sat/vB`;
      
      // Update all fee elements (sidebar and HUD)
      const feeElements = document.querySelectorAll('.stat-value.fee-rate, .hud-stat-value.fee-rate');
      feeElements.forEach(el => {
        el.textContent = feeDisplay;
        el.classList.add('updating');
        setTimeout(() => el.classList.remove('updating'), 500);
      });
      
      console.log('✓ Fees updated:', fees);
    } catch (error) {
      console.error('✗ Error fetching fees:', error);
      const feeElements = document.querySelectorAll('.stat-value.fee-rate, .hud-stat-value.fee-rate');
      feeElements.forEach(el => el.textContent = 'Error');
    }
  }

  // Function to update all Bitcoin data
  function updateAllData() {
    updateBlockHeight();
    updatePrice();
    updateFees();
    updateTimestamp();
    addUpdateAnimation();
  }

  // Add visual feedback when data updates
  function addUpdateAnimation() {
    const poster = document.querySelector('.sidebar-poster');
    if (poster) {
      poster.classList.add('data-updating');
      setTimeout(() => {
        poster.classList.remove('data-updating');
      }, 500);
    }
  }

  // Update timestamp
  function updateTimestamp() {
    const timestampElement = document.querySelector('.last-updated');
    if (timestampElement) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      timestampElement.textContent = `Updated: ${timeString}`;
    }
  }

  // Initialize the poster
  async function initPoster() {
    console.log('📡 Initializing DailyDrop757 poster...');
    
    // Load configuration
    const data = await loadConfig();
    if (!data) {
      console.error('Failed to load poster configuration');
      return;
    }

    // Build and inject HTML for sidebar (if present)
    const posterElement = document.getElementById('dailydrop-poster');
    if (posterElement) {
      posterElement.innerHTML = buildPosterHTML(data);
      console.log('✓ Poster HTML built');
    }
    
    // Build mission objectives for HUD (if present)
    buildMissionObjectives(data);

    // Start updating Bitcoin data if enabled
    if (data.bitcoinStats.enabled) {
      updateAllData();
      
      // Set up automatic updates
      const interval = data.bitcoinStats.updateInterval || 60000;
      updateIntervalId = setInterval(updateAllData, interval);
      
      console.log(`✓ Auto-update enabled (every ${interval/1000} seconds)`);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPoster);
  } else {
    initPoster();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    if (updateIntervalId) {
      clearInterval(updateIntervalId);
    }
  });

  console.log('📋 DailyDrop757 script loaded');

})();
