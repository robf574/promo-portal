// RiskCherry Client Portal JavaScript

// Modal functionality
function openNewOrderModal() {
    const modal = document.getElementById('newOrderModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNewOrderModal() {
    const modal = document.getElementById('newOrderModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('newOrderModal');
    if (event.target === modal) {
        closeNewOrderModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeNewOrderModal();
    }
});

// Feature toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            const featureGroup = document.querySelectorAll(`[data-feature="${feature}"]`);
            
            // Remove active class from all buttons in this feature group
            featureGroup.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
});

// File upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.querySelector('.drop-zone');
    
    if (dropZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);
        
        // Handle click to browse files
        dropZone.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.zip';
            input.multiple = false;
            input.addEventListener('change', handleFiles);
            input.click();
        });
    }
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    e.currentTarget.classList.add('highlight');
}

function unhighlight(e) {
    e.currentTarget.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files } });
}

function handleFiles(e) {
    const files = e.target.files;
    const dropZone = document.querySelector('.drop-zone');
    
    if (files.length > 0) {
        const file = files[0];
        if (file.name.toLowerCase().endsWith('.zip')) {
            dropZone.innerHTML = `
                <i class="fas fa-file-archive" style="font-size: 24px; color: #28a745; margin-bottom: 10px;"></i>
                <div style="font-weight: 600; color: #28a745;">${file.name}</div>
                <div style="font-size: 12px; color: #6c757d;">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
            `;
        } else {
            alert('Please upload a .zip file only.');
        }
    }
}

// Form validation and submission
function placeOrder() {
    // Get form data
    const formData = {
        markets: document.querySelector('.dropdown-field span').textContent,
        studio: document.querySelectorAll('.dropdown-field span')[1].textContent,
        target: document.getElementById('target').value,
        priority: document.querySelectorAll('.dropdown-field span')[2].textContent,
        purchaseOrder: document.getElementById('purchaseOrder').value,
        gameName: document.getElementById('gameName').value,
        orderType: document.getElementById('orderType').value,
        gameId: document.getElementById('gameId').value,
        rtpVersions: document.getElementById('rtpVersions').value,
        channel: document.getElementById('channel').value,
        playUrl: document.getElementById('playUrl').value,
        features: getSelectedFeatures(),
        otherFeatures: document.querySelector('.other-features-section textarea').value,
        confirmation: document.getElementById('confirmation').checked
    };
    
    // Basic validation
    if (!formData.target) {
        alert('Please select a target date.');
        return;
    }
    
    if (!formData.confirmation) {
        alert('Please confirm that all Customer Materials have been provided and passed QA.');
        return;
    }
    
    // Show loading state
    const orderBtn = document.querySelector('.place-order-btn');
    const originalText = orderBtn.textContent;
    orderBtn.textContent = 'PROCESSING...';
    orderBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Close modal
        closeNewOrderModal();
        
        // Show success message (this is where we'll add fun elements later)
        showOrderSuccess();
        
        // Reset button
        orderBtn.textContent = originalText;
        orderBtn.disabled = false;
        
        // Reset form
        resetForm();
        
    }, 2000);
}

function getSelectedFeatures() {
    const features = {};
    const featureGroups = ['jackpot', 'buyFeature', 'buyChance', 'gamble', 'sideBet'];
    
    featureGroups.forEach(feature => {
        const activeButton = document.querySelector(`[data-feature="${feature}"].active`);
        if (activeButton) {
            const isEnabled = activeButton.querySelector('.fa-check');
            features[feature] = isEnabled ? true : false;
        }
    });
    
    return features;
}

function resetForm() {
    // Reset all form fields
    document.getElementById('target').value = '2025-11-16';
    document.getElementById('purchaseOrder').value = '';
    document.getElementById('confirmation').checked = false;
    document.querySelector('.other-features-section textarea').value = '';
    
    // Reset file upload
    const dropZone = document.querySelector('.drop-zone');
    dropZone.innerHTML = 'Drag and drop a .zip archive, or click to browse to the .zip location.';
    
    // Reset feature toggles to default state
    const defaultStates = {
        jackpot: false,
        buyFeature: false,
        buyChance: false,
        gamble: true,
        sideBet: true
    };
    
    Object.keys(defaultStates).forEach(feature => {
        const buttons = document.querySelectorAll(`[data-feature="${feature}"]`);
        buttons.forEach(btn => btn.classList.remove('active'));
        
        const targetButton = defaultStates[feature] ? buttons[0] : buttons[1];
        targetButton.classList.add('active');
    });
}

function showOrderSuccess() {
    // Create success modal
    const successModal = document.createElement('div');
    successModal.className = 'modal-overlay active';
    successModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <div class="modal-header">
                <h2 style="color: #28a745;">Order Placed Successfully!</h2>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="font-size: 48px; color: #28a745; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p style="font-size: 18px; margin-bottom: 20px;">Your order has been submitted and is being processed.</p>
                <p style="color: #6c757d;">You will receive a confirmation email shortly.</p>
            </div>
            <div class="modal-footer">
                <button class="place-order-btn" onclick="this.closest('.modal-overlay').remove()" style="background-color: #007bff;">
                    OK
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successModal.parentNode) {
            successModal.remove();
        }
    }, 5000);
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would typically navigate to different pages
            // For this mockup, we'll just show an alert
            const itemName = this.querySelector('span').textContent;
            if (itemName !== 'Orders') {
                alert(`Navigating to ${itemName} page...`);
            }
        });
    });
});

// Table row click functionality
document.addEventListener('DOMContentLoaded', function() {
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove active class from all rows
            tableRows.forEach(r => r.classList.remove('active'));
            
            // Add active class to clicked row
            this.classList.add('active');
            
            // Here you would typically show order details
            alert('Order details would be displayed here...');
        });
    });
});

// Add some CSS for active states
const style = document.createElement('style');
style.textContent = `
    .table-row.active {
        background-color: #e3f2fd !important;
        border-left: 4px solid #2196f3;
    }
    
    .drop-zone.highlight {
        border-color: #007bff !important;
        background-color: #f0f8ff !important;
    }
    
    .place-order-btn:disabled {
        background-color: #6c757d !important;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);
