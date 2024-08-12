document.addEventListener('DOMContentLoaded', function() {
    const selectedAmenities = {};
    const selectedLocations = { states: [], cities: [] };

    // Function to update the list of selected locations
    function updateLocationText() {
        const locationText = Object.values(selectedLocations.states)
            .concat(Object.values(selectedLocations.cities))
            .join(', ');

        document.querySelector('.locations h4').textContent = locationText || 'Locations';
    }

    // Handle amenity checkbox changes
    document.querySelectorAll('.amenity input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedAmenities[this.dataset.id] = this.dataset.name;
            } else {
                delete selectedAmenities[this.dataset.id];
            }
        });
    });

    // Handle location (state/city) checkbox changes
    document.querySelectorAll('.locations input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const isState = !this.closest('ul');

            if (this.checked) {
                if (isState) {
                    selectedLocations.states.push(this.dataset.id);
                } else {
                    selectedLocations.cities.push(this.dataset.id);
                }
            } else {
                if (isState) {
                    const index = selectedLocations.states.indexOf(this.dataset.id);
                    if (index > -1) selectedLocations.states.splice(index, 1);
                } else {
                    const index = selectedLocations.cities.indexOf(this.dataset.id);
                    if (index > -1) selectedLocations.cities.splice(index, 1);
                }
            }

            updateLocationText();
        });
    });

    // Function to fetch places with filters applied
    function fetchPlaces() {
        const filters = {
            amenities: Object.keys(selectedAmenities),
            states: selectedLocations.states,
            cities: selectedLocations.cities
        };

        fetch('http://0.0.0.0:5001/api/v1/places_search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        })
        .then(response => response.json())
        .then(data => {
            const placesSection = document.querySelector('section.places');
            placesSection.innerHTML = ''; // Clear previous places

            data.forEach(place => {
                const article = document.createElement('article');

                const titleBox = document.createElement('div');
                titleBox.classList.add('title_box');

                const name = document.createElement('h2');
                name.textContent = place.name;

                const priceByNight = document.createElement('div');
                priceByNight.classList.add('price_by_night');
                priceByNight.textContent = `$${place.price_by_night}`;

                titleBox.appendChild(name);
                titleBox.appendChild(priceByNight);
                article.appendChild(titleBox);

                const information = document.createElement('div');
                information.classList.add('information');

                const maxGuest = document.createElement('div');
                maxGuest.textContent = `${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`;
                information.appendChild(maxGuest);

                const numberRooms = document.createElement('div');
                numberRooms.textContent = `${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`;
                information.appendChild(numberRooms);

                const numberBathrooms = document.createElement('div');
                numberBathrooms.textContent = `${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`;
                information.appendChild(numberBathrooms);

                article.appendChild(information);

                const description = document.createElement('div');
                description.classList.add('description');
                description.textContent = place.description;
                article.appendChild(description);

                const reviewsDiv = document.createElement('div');
                reviewsDiv.classList.add('reviews');
                article.appendChild(reviewsDiv);

                const reviewsTitle = document.createElement('h2');
                reviewsTitle.textContent = 'Reviews';
                reviewsDiv.appendChild(reviewsTitle);

                const reviewsToggle = document.createElement('span');
                reviewsToggle.classList.add('toggle-reviews');
                reviewsToggle.textContent = 'show';
                reviewsDiv.appendChild(reviewsToggle);

                reviewsToggle.addEventListener('click', function() {
                    if (this.textContent === 'show') {
                        this.textContent = 'hide';
                        fetchReviews(place.id, reviewsDiv);
                    } else {
                        this.textContent = 'show';
                        reviewsDiv.querySelectorAll('.review').forEach(review => review.remove());
                    }
                });

                placesSection.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching places:', error));
    }

    // Function to fetch reviews for a place
    function fetchReviews(placeId, reviewsDiv) {
        fetch(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews/`)
        .then(response => response.json())
        .then(reviews => {
            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('review');

                const user = document.createElement('h3');
                user.textContent = review.user_name;
                reviewDiv.appendChild(user);

                const text = document.createElement('p');
                text.textContent = review.text;
                reviewDiv.appendChild(text);

                reviewsDiv.appendChild(reviewDiv);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
    }

    // Initial fetch of all places without filters
    fetchPlaces();

    // Handle search button click
    document.querySelector('button').addEventListener('click', fetchPlaces);
});
