document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const apiStatusDot = document.getElementById('status-dot');
  const apiStatusText = document.getElementById('status-text');
  const classifyForm = document.getElementById('classify-form');
  const descriptionInput = document.getElementById('description-input');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const loader = document.getElementById('loader');
  
  const resultPlaceholder = document.getElementById('result-placeholder');
  const resultDisplay = document.getElementById('result-display');
  const resultBadge = document.getElementById('result-badge');
  const confidenceText = document.getElementById('confidence-text');
  const confidenceBar = document.getElementById('confidence-bar');
  
  const historyCount = document.getElementById('history-count');
  const noHistory = document.getElementById('no-history');
  const historyList = document.getElementById('history-list');

  // Constants
  const SEVERITY_INFO = {
    'P1': { label: 'P1 - Critical', class: 'badge-p1', color: 'var(--color-p1)' },
    'P2': { label: 'P2 - High', class: 'badge-p2', color: 'var(--color-p2)' },
    'P3': { label: 'P3 - Medium', class: 'badge-p3', color: 'var(--color-p3)' },
    'P4': { label: 'P4 - Low', class: 'badge-p4', color: 'var(--color-p4)' }
  };

  // Check API Health
  async function checkApiHealth() {
    try {
      const response = await fetch('/health');
      if (response.ok) {
        apiStatusDot.classList.remove('offline');
        apiStatusText.textContent = 'System Online';
        return true;
      }
    } catch (error) {
      console.error('API health check failed:', error);
    }
    apiStatusDot.classList.add('offline');
    apiStatusText.textContent = 'System Offline';
    return false;
  }

  // Format timestamp nicely
  function formatTimestamp(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return isoString;
    }
  }

  // Fetch and render classification history
  async function fetchHistory() {
    try {
      const response = await fetch('/history');
      if (response.ok) {
        const data = await response.json();
        renderHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }

  // Render history list items
  function renderHistory(historyItems) {
    historyCount.textContent = `${historyItems.length} item${historyItems.length !== 1 ? 's' : ''}`;
    
    if (historyItems.length === 0) {
      noHistory.style.display = 'flex';
      historyList.style.display = 'none';
      return;
    }

    noHistory.style.display = 'none';
    historyList.style.display = 'flex';
    
    // Clear existing history items
    historyList.innerHTML = '';
    
    // Reverse the history to show the latest first
    const reversedItems = [...historyItems].reverse();
    
    reversedItems.forEach(item => {
      const severityMeta = SEVERITY_INFO[item.severity] || SEVERITY_INFO['P4'];
      const confidencePercentage = Math.round(item.confidence * 100);
      
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      historyItem.innerHTML = `
        <span class="history-badge ${severityMeta.class}">${item.severity}</span>
        <div class="history-details">
          <div class="history-desc" title="${escapeHtml(item.description)}">${escapeHtml(item.description)}</div>
          <div class="history-meta">
            <span>Confidence: <span class="history-confidence">${confidencePercentage}%</span></span>
            <span class="history-time">${formatTimestamp(item.timestamp)}</span>
          </div>
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });
  }

  // Helper to escape HTML tags to prevent XSS
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Update classification result layout
  function displayResult(result) {
    resultPlaceholder.style.display = 'none';
    resultDisplay.style.display = 'block';

    const severityMeta = SEVERITY_INFO[result.severity] || SEVERITY_INFO['P4'];
    
    // Reset and apply severity classes
    resultBadge.className = 'result-badge';
    resultBadge.classList.add(severityMeta.class);
    resultBadge.textContent = severityMeta.label;

    // Confidence Level
    const confidencePct = Math.round(result.confidence * 100);
    confidenceText.textContent = `${confidencePct}%`;
    confidenceBar.style.width = `${confidencePct}%`;
    confidenceBar.style.backgroundColor = severityMeta.color;
    
    // Glow/Highlight effect based on severity
    confidenceBar.style.boxShadow = `0 0 10px ${severityMeta.color}`;
  }

  // Handle Form Submission
  classifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = descriptionInput.value.trim();
    if (!description) return;

    // Enter loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Analyzing...';
    loader.style.display = 'inline-block';

    try {
      const response = await fetch('/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show result details
        displayResult(result);
        
        // Update history
        await fetchHistory();
        
        // Clear input form
        descriptionInput.value = '';
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || 'Failed to classify incident'}`);
      }
    } catch (error) {
      console.error('Classification request failed:', error);
      alert('Unable to connect to the classification server. Please check that the server is running.');
    } finally {
      // Exit loading state
      submitBtn.disabled = false;
      btnText.textContent = 'Classify Severity';
      loader.style.display = 'none';
    }
  });

  // Init
  async function init() {
    const online = await checkApiHealth();
    if (online) {
      fetchHistory();
    }
    // Poll health status every 10 seconds
    setInterval(checkApiHealth, 10000);
  }

  init();
});