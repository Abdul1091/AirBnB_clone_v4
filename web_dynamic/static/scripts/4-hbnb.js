document.addEventListener('DOMContentLoaded', function() {
    // Define the function to fetch and display places
    function fetchPlaces(amenities = []) {
        fetch('http://0.0.0.0:5001/api/v1/places_search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amenities: amenities })
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
                maxGuest.classList.add('max_guest');
                maxGuest.textContent = `${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`;

                const numberRooms = document.createElement('div');
                numberRooms.classList.add('number_rooms');
                numberRooms.textContent = `${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`;

                const numberBathrooms = document.createElement('div');
                numberBathrooms.classList.add('number_bathrooms');
                numberBathrooms.textContent = `${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`;

                information.appendChild(maxGuest);
                information.appendChild(numberRooms);
                information.appendChild(numberBathrooms);
                article.appendChild(information);

                const description = document.createElement('div');
                description.classList.add('description');
                description.textContent = place.description;

                article.appendChild(description);

                placesSection.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching places:', error));
    }

    // Initial fetch of all places without filters
    fetchPlaces();

    // Handle search button click
    document.querySelector('button').addEventListener('click', () => {
        const checkedAmenities = Array.from(document.querySelectorAll('.amenity input:checked'))
            .map(checkbox => checkbox.dataset.id);

        fetchPlaces(checkedAmenities);
    });
});
