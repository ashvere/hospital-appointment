// Global data storage
let appointments = JSON.parse(localStorage.getItem('appointments')) || [
    { id: '1001', patient: 'Chou Tzuyu', doctor: 'Dr. Myoui', department: 'Cardiology', time: '10:00 AM', date: '2023-06-14', status: 'confirmed' },
    { id: '1002', patient: 'Son Chaeyoung', doctor: 'Dr. Myoui', department: 'Cardiology', time: '11:30 AM', date: '2023-06-14', status: 'confirmed' },
    { id: '1003', patient: 'Minatozaki Sana', doctor: 'Dr. Myoui', department: 'Cardiology', time: '2:15 PM', date: '2023-06-14', status: 'confirmed' },
    { id: '1004', patient: 'Im Nayeon', doctor: 'Dr. Thananusak', department: 'Dermatology', time: '9:00 AM', date: '2023-06-14', status: 'pending' },
    { id: '1005', patient: 'Park Jihyo', doctor: 'Dr. Trakulwipatkul', department: 'Neurology', time: '1:00 PM', date: '2023-06-14', status: 'cancelled' }
];

let appointmentRequests = JSON.parse(localStorage.getItem('appointmentRequests')) || [
    { id: '2001', patient: 'Im Nayeon', date: 'Tomorrow, 10:00 AM', reason: 'Chest pain and shortness of breath', type: 'New Patient', status: 'urgent' },
    { id: '2002', patient: 'Park Jihyo', date: 'June 20, 2:30 PM', reason: 'Routine cardiac checkup', type: 'Existing Patient', status: 'new' },
    { id: '2003', patient: 'Kim Dahyun', date: 'June 18, 4:00 PM', reason: 'Follow-up on medication', type: 'Existing Patient', status: 'new' }
];

let patients = JSON.parse(localStorage.getItem('patients')) || [
    { id: '3001', name: 'Chou Tzuyu', patientId: 'P12345', age: 28, lastVisit: 'June 10, 2023', conditions: 'Hypertension, Coronary Artery Disease', medications: 'Lisinopril 10mg, Atorvastatin 20mg, Aspirin 81mg', nextAppointment: 'June 14, 2023 at 8:00 AM' },
    { id: '3002', name: 'Son Chaeyoung', patientId: 'P12346', age: 25, lastVisit: 'June 5, 2023', conditions: 'Heart Palpitations, Mitral Valve Prolapse', medications: 'Metoprolol 25mg, Magnesium Supplement', nextAppointment: 'June 13, 2023 at 11:30 AM' },
    { id: '3003', name: 'Minatozaki Sana', patientId: 'P12347', age: 30, lastVisit: 'June 8, 2023', conditions: 'Arrhythmia, High Cholesterol', medications: 'Amiodarone 200mg, Rosuvastatin 10mg', nextAppointment: 'June 15, 2023 at 2:15 PM' }
];

// Initialize data if not already set
if (!localStorage.getItem('appointments')) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

if (!localStorage.getItem('appointmentRequests')) {
    localStorage.setItem('appointmentRequests', JSON.stringify(appointmentRequests));
}

if (!localStorage.getItem('patients')) {
    localStorage.setItem('patients', JSON.stringify(patients));
}

// Notification functions
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

function sendNotificationToPatient(patientName, message, type = 'info') {
    // Get existing notifications or create empty object
    const notifications = JSON.parse(localStorage.getItem('patientNotifications') || '{}');
    
    if (!notifications[patientName]) {
        notifications[patientName] = [];
    }
    
    notifications[patientName].push({
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    localStorage.setItem('patientNotifications', JSON.stringify(notifications));
    console.log(`Notification sent to patient ${patientName}: ${message}`);
}

// Check for notifications (for patient view)
function checkForNotifications() {
    const patientName = "Ernesto Batumbakal"; // This would come from authentication
    const notifications = JSON.parse(localStorage.getItem('patientNotifications') || '{}');
    const patientNotifications = notifications[patientName] || [];
    
    const unreadNotifications = patientNotifications.filter(n => !n.read);
    
    if (unreadNotifications.length > 0) {
        showNotificationIndicator(unreadNotifications.length);
        
        // Display the latest notification
        const latestNotification = unreadNotifications[unreadNotifications.length - 1];
        showNotification(latestNotification.message, latestNotification.type);
        
        // Mark as read
        patientNotifications.forEach(notification => {
            notification.read = true;
        });
        
        notifications[patientName] = patientNotifications;
        localStorage.setItem('patientNotifications', JSON.stringify(notifications));
    }
}

function showNotificationIndicator(count) {
    // Create or update notification indicator
    let indicator = document.getElementById('notification-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'notification-indicator';
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.right = '10px';
        indicator.style.backgroundColor = '#ef4444';
        indicator.style.color = 'white';
        indicator.style.borderRadius = '50%';
        indicator.style.width = '20px';
        indicator.style.height = '20px';
        indicator.style.display = 'flex';
        indicator.style.alignItems = 'center';
        indicator.style.justifyContent = 'center';
        indicator.style.fontSize = '12px';
        indicator.style.fontWeight = 'bold';
        indicator.style.zIndex = '1000';
        indicator.style.cursor = 'pointer';
        
        indicator.addEventListener('click', () => {
            showAllNotifications();
        });
        
        document.body.appendChild(indicator);
    }
    
    indicator.textContent = count;
    indicator.style.display = 'flex';
}

function showAllNotifications() {
    const patientName = "Ernesto Batumbakal";
    const notifications = JSON.parse(localStorage.getItem('patientNotifications') || '{}');
    const patientNotifications = notifications[patientName] || [];
    
    const notificationList = patientNotifications
        .filter(n => !n.read)
        .map(n => `${new Date(n.timestamp).toLocaleString()}: ${n.message}`)
        .join('\n\n');
    
    if (notificationList) {
        alert(`You have notifications:\n\n${notificationList}`);
        
        // Mark all as read
        patientNotifications.forEach(notification => {
            notification.read = true;
        });
        
        notifications[patientName] = patientNotifications;
        localStorage.setItem('patientNotifications', JSON.stringify(notifications));
        
        // Hide indicator
        const indicator = document.getElementById('notification-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    } else {
        alert('You have no new notifications.');
    }
}

// Utility functions
function formatDateString(dateString) {
    // Simple date formatting for demo purposes
    if (dateString === 'Tomorrow, 10:00 AM') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    
    // Fallback for other date formats
    return '2023-06-15';
}

// Initialize notification checking for patient portal
if (window.location.pathname.endsWith('patient.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        checkForNotifications();
        // Set up interval to check for new notifications
        setInterval(checkForNotifications, 30000); // Check every 30 seconds
    });
}