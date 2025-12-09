
(function() {
    const LocationManager = {
        watchId: null,

        init: function() {
            // Only show on specific pages (Home and Salon List)
            const path = window.location.pathname;
            const page = path.split('/').pop() || 'index.html';
            const allowedPages = ['index.html', 'salons.html', ''];

            if (allowedPages.includes(page)) {
                this.renderLocationBadge();
                this.startWatching();
            }
        },

        renderLocationBadge: function() {
            if (document.getElementById('location-badge')) return;
            
            const badge = document.createElement('div');
            badge.id = 'location-badge';
            badge.className = 'location-badge';
            badge.innerHTML = '📍 Finding location...';
            document.body.appendChild(badge);
            
            // Check if we have cached location to show immediately
            const lat = localStorage.getItem('userLat');
            const lng = localStorage.getItem('userLng');
            if (lat && lng) {
                this.updateBadge(lat, lng);
            }
        },

        startWatching: function() {
            if (!navigator.geolocation) {
                this.updateBadgeText("Geolocation not supported");
                return;
            }

            // Clear existing watch if any
            if (this.watchId) navigator.geolocation.clearWatch(this.watchId);

            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Update storage
                    localStorage.setItem('userLat', lat);
                    localStorage.setItem('userLng', lng);
                    
                    // Update UI
                    this.updateBadge(lat, lng);
                },
                (error) => {
                    console.warn("Location watch error:", error.message);
                    // If we have cached data, keep showing it, otherwise show error
                    if (!localStorage.getItem('userLat')) {
                        this.updateBadgeText("📍 Location access denied");
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        },

        requestLocation: function(callback) {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                if (callback) callback(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    localStorage.setItem('userLat', lat);
                    localStorage.setItem('userLng', lng);
                    this.updateBadge(lat, lng);
                    if (callback) callback(true);
                },
                (error) => {
                    console.warn("Location error:", error.message);
                    alert("Could not retrieve location. Please check permissions.");
                    if (callback) callback(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        },

        updateBadge: function(lat, lng) {
            const badge = document.getElementById('location-badge');
            if (!badge) return;

            badge.innerHTML = `📍 Your Location: ${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
            // Make badge clickable to force refresh or re-center logic if needed
            badge.onclick = () => this.requestLocation();
            badge.style.cursor = 'pointer';
        },

        updateBadgeText: function(text) {
             const badge = document.getElementById('location-badge');
             if(badge) badge.innerHTML = text;
        },
        
        getDistance: function(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the earth in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return Number((R * c).toFixed(1));
        }
    };

    window.LocationManager = LocationManager;
    document.addEventListener('DOMContentLoaded', () => LocationManager.init());
})();
