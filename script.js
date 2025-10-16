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
    console.log('showOrderSuccess called - creating spin the wheel modal');
    // Create success modal with spin the wheel
    const successModal = document.createElement('div');
    successModal.className = 'modal-overlay active';
    successModal.innerHTML = `
        <div class="modal-content wheel-modal" style="max-width: 600px; text-align: center;">
            <div class="modal-header">
                <h2 style="color: #28a745;">Order Placed Successfully!</h2>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="wheel-container">
                    <h3 style="margin-bottom: 20px; color: #333;">Feeling Lucky?</h3>
                    <p style="margin-bottom: 30px; color: #6c757d;">
                        If your order has no issues, you get a discount related to the % the wheel lands on.<br>
                        Any issues and you pay the same % as a premium penalty.
                    </p>
                    
                    <div class="wheel-wrapper">
                        <div class="wheel-pointer"></div>
                        <div class="wheel" id="discountWheel">
                            <div class="wheel-segment" data-segment="0">
                                <span class="segment-text">?</span>
                            </div>
                            <div class="wheel-segment" data-segment="1">
                                <span class="segment-text">?</span>
                            </div>
                            <div class="wheel-segment" data-segment="2">
                                <span class="segment-text">?</span>
                            </div>
                            <div class="wheel-segment" data-segment="3">
                                <span class="segment-text">?</span>
                            </div>
                            <div class="wheel-segment" data-segment="4">
                                <span class="segment-text">?</span>
                            </div>
                        </div>
                        <div class="wheel-center">
                            <button class="spin-btn" id="spinBtn" onclick="spinWheel()">SPIN</button>
                        </div>
                    </div>
                    
                    <div class="wheel-buttons">
                        <button class="continue-btn" onclick="continueWithoutGamble()">
                            Continue without the gamble
                        </button>
                        <button class="gamble-btn" onclick="startGamble()">
                            Gamble
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Auto-remove after 30 seconds if no interaction
    setTimeout(() => {
        if (successModal.parentNode) {
            successModal.remove();
        }
    }, 30000);
}

// Wheel spinning functionality
let isSpinning = false;
let wheelSegments = [5, 10, 15, 20, 25]; // Default percentages

function startGamble() {
    const segments = document.querySelectorAll('.wheel-segment');
    const spinBtn = document.getElementById('spinBtn');
    
    // Disable gamble button
    document.querySelector('.gamble-btn').disabled = true;
    document.querySelector('.gamble-btn').textContent = 'Revealing...';
    
    // Reveal percentages one by one
    segments.forEach((segment, index) => {
        setTimeout(() => {
            segment.querySelector('.segment-text').textContent = wheelSegments[index] + '%';
            segment.style.transform = 'scale(1.1)';
            setTimeout(() => {
                segment.style.transform = 'scale(1)';
            }, 200);
        }, index * 500);
    });
    
    // Enable spin button after all percentages are revealed
    setTimeout(() => {
        spinBtn.disabled = false;
        spinBtn.textContent = 'SPIN';
        document.querySelector('.gamble-btn').textContent = 'Gamble';
        document.querySelector('.gamble-btn').disabled = false;
    }, segments.length * 500 + 1000);
}

function spinWheel() {
    if (isSpinning) return;
    
    const wheel = document.getElementById('discountWheel');
    const spinBtn = document.getElementById('spinBtn');
    
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = 'SPINNING...';
    
    // Random rotation (5-7 full rotations + random segment)
    const randomSegment = Math.floor(Math.random() * 5);
    const baseRotation = 1800 + (randomSegment * 72); // 5 full rotations + segment offset
    const finalRotation = baseRotation + (Math.random() * 72); // Add some randomness
    
    wheel.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    
    // Show result after spin
    setTimeout(() => {
        const percentage = wheelSegments[randomSegment];
        showWheelResult(percentage, randomSegment);
        isSpinning = false;
    }, 3000);
}

function showWheelResult(percentage, segmentIndex) {
    // Create result modal
    const resultModal = document.createElement('div');
    resultModal.className = 'modal-overlay active';
    
    // Simulate order issues (random for demo)
    const hasIssues = Math.random() < 0.3; // 30% chance of issues
    
    resultModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <div class="modal-header">
                <h2 style="color: ${hasIssues ? '#dc3545' : '#28a745'};">
                    ${hasIssues ? 'Premium Penalty!' : 'Discount Applied!'}
                </h2>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="font-size: 64px; margin-bottom: 20px;">
                    ${hasIssues ? '⚠️' : '🎉'}
                </div>
                <div style="font-size: 48px; font-weight: bold; color: ${hasIssues ? '#dc3545' : '#28a745'}; margin-bottom: 20px;">
                    ${percentage}%
                </div>
                <p style="font-size: 18px; margin-bottom: 20px;">
                    ${hasIssues 
                        ? `Your order has issues. You'll pay ${percentage}% premium penalty.` 
                        : `Congratulations! You get ${percentage}% discount on your order.`
                    }
                </p>
                <p style="color: #6c757d; margin-bottom: 30px;">
                    ${hasIssues 
                        ? 'The penalty will be added to your final invoice.' 
                        : 'The discount will be applied to your final invoice.'
                    }
                </p>
            </div>
            <div class="modal-footer">
                <button class="place-order-btn" onclick="this.closest('.modal-overlay').remove()" style="background-color: #007bff;">
                    Continue
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(resultModal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (resultModal.parentNode) {
            resultModal.remove();
        }
    }, 10000);
}

function continueWithoutGamble() {
    // Close the wheel modal and show simple success
    const wheelModal = document.querySelector('.wheel-modal').closest('.modal-overlay');
    wheelModal.remove();
    
    // Show simple success message
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

// Status tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    const statusTabs = document.querySelectorAll('.tab');
    
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            statusTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you would filter the table based on status
            const status = this.textContent;
            console.log(`Filtering by status: ${status}`);
        });
    });
});

// Time period filters functionality
document.addEventListener('DOMContentLoaded', function() {
    const timeTabs = document.querySelectorAll('.time-tab');
    
    timeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all time tabs
            timeTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update footer text based on selection
            const footerText = document.querySelector('.footer-text');
            const period = this.textContent;
            
            if (period === '6M') {
                footerText.textContent = 'Showing orders from past 6 months. Use the top toolbar to select time period.';
            } else if (period === '12M') {
                footerText.textContent = 'Showing orders from past 12 months. Use the top toolbar to select time period.';
            } else {
                footerText.textContent = 'Showing all orders. Use the top toolbar to select time period.';
            }
            
            console.log(`Filtering by time period: ${period}`);
        });
    });
});

// Dropdown filters functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownFilters = document.querySelectorAll('.dropdown-filter');
    
    dropdownFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Here you would show a dropdown menu
            console.log(`Opening dropdown: ${this.querySelector('span').textContent}`);
        });
    });
});

// Control buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    const controlButtons = document.querySelectorAll('.control-btn');
    
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            console.log(`Control action: ${action}`);
            
            // Here you would implement the specific control actions
            if (action === 'COLUMNS') {
                alert('Columns control would open here');
            } else if (action === 'FILTERS') {
                alert('Filters control would open here');
            } else if (action === 'DENSITY') {
                alert('Density control would open here');
            }
        });
    });
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value;
            console.log(`Searching for: ${searchTerm}`);
            
            // Here you would implement search functionality
            // For now, we'll just log the search term
        });
    }
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
