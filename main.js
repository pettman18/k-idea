// Auto-scrolls to each field in random order
const container = document.querySelector('.scroll-container');
const inputs = document.querySelectorAll('.wd-input');
const infoContent = document.getElementById('info-content');
const startButton = document.getElementById('start-button');
const logoOverlay = document.getElementById('logo-overlay');
let shuffledIndices = [];
let currentIndex = 0;

// Sample data for all fields
const sampleData = {
  'employee-id': 'KA12345',
  'full-name': 'Bob Smith',
  'job-title': 'Senior Software Engineer',
  'department': 'Digital Services',
  'start-date': '2024-03-15'
};

// Field information for documentation panel
const fieldInfo = {
  'employee-id': {
    title: 'Employee ID',
    description: 'The unique identifier for the employee in the HR system. All Kainos employees have IDs starting with "KA".',
    format: 'Format: KA followed by 5 digits',
    documents: ['Employee Handbook', 'HR System Guide'],
    source: {
      system: 'Workday HR Core',
      status: 'Retrieved',
      lastUpdated: '2024-02-28'
    }
  },
  'full-name': {
    title: 'Full Name',
    description: 'The complete name of the employee as it appears on official documents.',
    format: 'Format: First Name followed by Last Name',
    documents: ['Employee Directory', 'Legal ID Requirements'],
    source: {
      system: 'Active Directory',
      status: 'Retrieved',
      lastUpdated: '2024-03-01'
    }
  },
  'job-title': {
    title: 'Job Title',
    description: 'The official position of the employee within the organization.',
    format: 'Use official titles from the company job catalog',
    documents: ['Job Descriptions', 'Career Pathway Guide'],
    source: {
      system: 'Workday Talent Management',
      status: 'Retrieved',
      lastUpdated: '2024-02-15'
    }
  },
  'department': {
    title: 'Department',
    description: 'The organizational unit to which the employee belongs.',
    format: 'Choose from standard department names',
    documents: ['Organization Chart', 'Department Directory'],
    source: {
      system: 'Workday Organizational Structure',
      status: 'Retrieved',
      lastUpdated: '2024-01-30'
    }
  },
  'start-date': {
    title: 'Start Date',
    description: 'The date when the employee officially began or will begin work.',
    format: 'Format: YYYY-MM-DD',
    documents: ['Onboarding Schedule', 'Employee Contract'],
    source: {
      system: 'Workday Employment Management',
      status: 'Retrieved',
      lastUpdated: '2024-02-10'
    }
  }
};

// Create and shuffle an array of indices
function shuffleIndices() {
  shuffledIndices = Array.from({ length: inputs.length }, (_, i) => i);
  // Fisher-Yates shuffle algorithm
  for (let i = shuffledIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
  }
}

// Update information panel with relevant field details and data source
function updateInfoPanel(fieldName, callback) {
  const info = fieldInfo[fieldName];
  if (!info) return;
  
  // First show loading state
  infoContent.innerHTML = `
    <h4>${info.title}</h4>
    <p>Retrieving data from external systems...</p>
    <div class="loading-indicator">
      <div class="loading-spinner"></div>
      <p>Connecting to ${info.source.system}...</p>
    </div>
  `;
  
  // After a short delay, show the retrieved data
  setTimeout(() => {
    let content = `
      <h4>${info.title}</h4>
      <div class="source-info">
        <p class="source-label">Data Source:</p>
        <p class="source-system">${info.source.system}</p>
        <p class="source-status">Status: <span class="status-retrieved">${info.source.status}</span></p>
        <p class="source-date">Last updated: ${info.source.lastUpdated}</p>
      </div>
      <div class="data-preview">
        <p class="preview-label">Retrieved Value:</p>
        <p class="preview-value">${sampleData[fieldName]}</p>
      </div>
      <div class="field-info">
        <p>${info.description}</p>
        <p><strong>${info.format}</strong></p>
      </div>
      <p>Relevant documents:</p>
      <ul>
    `;
    
    info.documents.forEach(doc => {
      content += `<li><span class="document-link">${doc}</span></li>`;
    });
    
    content += `</ul>`;
    infoContent.innerHTML = content;
    
    // Execute callback function if provided (to populate the field after info is loaded)
    if (callback) {
      callback();
    }
  }, 1200); // Increased delay to simulate data retrieval
}

function scrollToNextInput() {
  if (currentIndex >= inputs.length) {
    // All fields are completed, hide the overlay
    logoOverlay.style.display = 'none';
    return;
  }
  
  const inputIndex = shuffledIndices[currentIndex];
  const input = inputs[inputIndex];
  const fieldName = input.getAttribute('data-field');
  
  // Focus the field
  input.focus();
  
  // Scroll to the field
  container.scrollTo({
    top: input.offsetTop - 10,
    behavior: 'smooth'
  });
  
  // Update the info panel with relevant information first
  updateInfoPanel(fieldName, function() {
    // After the info panel has loaded, populate the field
    setTimeout(() => {
      if (sampleData[fieldName]) {
        // Populate the field with sample data
        input.value = sampleData[fieldName];
        
        // Update the checkbox
        const checkbox = document.getElementById(`check-${fieldName}`);
        if (checkbox) {
          checkbox.checked = true;
        }
      }
      
      // Move to the next field after a delay
      currentIndex++;
      if (currentIndex < inputs.length) {
        setTimeout(scrollToNextInput, 2000); // Adjust time here (ms) per field
      } else {
        // This is the last field, wait 3 seconds then hide overlay
        setTimeout(() => {
          logoOverlay.style.display = 'none';
        }, 3000);
      }
    }, 500); // Short delay for visual effect after data loads
  });
}

// Track input field completion and update checkboxes
function setupFieldTracking() {
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      const fieldName = this.getAttribute('data-field');
      const checkbox = document.getElementById(`check-${fieldName}`);
      
      if (this.value.trim() !== '') {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  });
}

// Start the auto-fill process
function startAutoFill() {
  // Hide the button during the process
  startButton.style.display = 'none';
  
  // Show the overlay and keep it visible
  logoOverlay.style.display = 'flex';
  
  // Start filling fields immediately but keep overlay visible
  shuffleIndices();
  scrollToNextInput();
}

// Initialize the page
window.onload = () => {
  setupFieldTracking();
  
  // Set up the start button
  startButton.addEventListener('click', startAutoFill);
  
  // Clear all input fields and checkboxes initially
  inputs.forEach(input => {
    input.value = '';
    const fieldName = input.getAttribute('data-field');
    const checkbox = document.getElementById(`check-${fieldName}`);
    if (checkbox) {
      checkbox.checked = false;
    }
  });
};
