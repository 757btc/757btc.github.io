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
      const blockElement = document.querySelector('.stat-value.block-height');
      if (blockElement) {
        blockElement.textContent = parseInt(height).toLocaleString();
      }
      console.log('✓ Block height updated:', height);
    } catch (error) {
      console.error('✗ Error fetching block height:', error);
      const blockElement = document.querySelector('.stat-value.block-height');
      if (blockElement) {
        blockElement.textContent = 'Error';
      }
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
      const priceElement = document.querySelector('.stat-value.btc-price');
      if (priceElement && prices.USD) {
        priceElement.textContent = `$${parseInt(prices.USD).toLocaleString()}`;
      }
      console.log('✓ Price updated:', prices.USD);
    } catch (error) {
      console.error('✗ Error fetching price:', error);
      const priceElement = document.querySelector('.stat-value.btc-price');
      if (priceElement) {
        priceElement.textContent = 'Error';
      }
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
      const feeElement = document.querySelector('.stat-value.fee-rate');
      if (feeElement) {
        const feeDisplay = `${fees.fastestFee}/${fees.halfHourFee}/${fees.hourFee} sat/vB`;
        feeElement.textContent = feeDisplay;
      }
      console.log('✓ Fees updated:', fees);
    } catch (error) {
      console.error('✗ Error fetching fees:', error);
      const feeElement = document.querySelector('.stat-value.fee-rate');
      if (feeElement) {
        feeElement.textContent = 'Error';
      }
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

    // Build and inject HTML
    const posterElement = document.getElementById('dailydrop-poster');
    if (posterElement) {
      posterElement.innerHTML = buildPosterHTML(data);
      console.log('✓ Poster HTML built');
    }

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
