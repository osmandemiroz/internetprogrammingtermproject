document.addEventListener("DOMContentLoaded", function() {
    const seatContainer = document.getElementById('seat-container');
    const form = document.getElementById('user-form');
    const adminForm = document.getElementById('admin-form');
    const adminInterface = document.getElementById('admin-interface');
    const reservationDetails = document.getElementById('reservation-details');
    let rows = 0;
    let cols = 0;
    let seats = [];
    let selectedSeats = [];
    let currentUser = null;
    const seatPrices = {
        child: 10,
        youngAdult: 15,
        adult: 25,
        senior: 10
    };

    // Function to generate seat matrix
    function generateSeats() {
        seatContainer.innerHTML = ''; // Clear previous seats
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.setAttribute('data-row', i);
                seat.setAttribute('data-col', j);
                seat.addEventListener('click', function() {
                    reserveSeat(i, j);
                });
                row.push(seat);
                seatContainer.appendChild(seat);
            }
            seats.push(row);
        }
        seatContainer.classList.add('active');
    }

    // Function to reserve a seat
    function reserveSeat(row, col) {
        if (seats[row][col].classList.contains('reserved')) {
            // Cancel reservation
            seats[row][col].classList.remove('reserved');
            const index = selectedSeats.findIndex(seat => seat.row === row && seat.col === col);
            if (index !== -1) {
                selectedSeats.splice(index, 1);
            }
        } else {
            // Reserve seat
            seats[row][col].classList.add('reserved');
            selectedSeats.push({ row, col });
        }
        updateReservationDetails();
    }

    // Function to update reservation details
    function updateReservationDetails() {
        let totalPrice = 0;
        const details = selectedSeats.map(seat => `Row ${seat.row + 1}, Seat ${seat.col + 1}`).join(', ');
        const userInfo = `${currentUser.name} ${currentUser.surname}`;
        selectedSeats.forEach(seat => {
            const age = parseInt(currentUser.age);
            if (age < 18) {
                totalPrice += seatPrices.child;
            } else if (age < 26) {
                totalPrice += seatPrices.youngAdult;
            } else if (age < 65) {
                totalPrice += seatPrices.adult;
            } else {
                totalPrice += seatPrices.senior;
            }
        });
        reservationDetails.innerHTML = `
            <p>User: ${userInfo}</p>
            <p>Selected Seats: ${details}</p>
            <p>Total Price: $${totalPrice}</p>
            <button onclick="confirmReservation()">Confirm</button>
        `;
    }

    // Function to confirm reservation
    function confirmReservation() {
        const details = selectedSeats.map(seat => `Row ${seat.row + 1}, Seat ${seat.col + 1}`).join(', ');
        const totalPrice = selectedSeats.reduce((acc, seat) => {
            const age = parseInt(currentUser.age);
            if (age < 18) {
                return acc + seatPrices.child;
            } else if (age < 26) {
                return acc + seatPrices.youngAdult;
            } else if (age < 65) {
                return acc + seatPrices.adult;
            } else {
                return acc + seatPrices.senior;
            }
        }, 0);
        const confirmationMessage = `Reservation confirmed!\n\nUser: ${currentUser.name} ${currentUser.surname}\nSelected Seats: ${details}\nTotal Price: $${totalPrice}`;
        alert(confirmationMessage);
        // Reset reservation details and selected seats
        reservationDetails.innerHTML = '';
        selectedSeats = [];
        updateReservationDetails();
    }

    // Event listener for user form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = form.elements['name'].value;
        const surname = form.elements['surname'].value;
        const email = form.elements['email'].value;
        const phone = form.elements['phone'].value;
        const age = form.elements['age'].value;

        // Create user object
        currentUser = {
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            age: age
        };

        // Check if user is admin
        if (email === 'admin@admin.com') {
            currentUser.role = 'admin';
            adminInterface.style.display = 'block'; // Show admin interface
        } else {
            currentUser.role = 'user';
        }

        // Activate right part of the page
        const rightContainer = document.getElementById('seat-container');
        rightContainer.classList.add('active');
    });

    // Event listener for admin form submission
    adminForm.addEventListener('submit', function(event) {
        event.preventDefault();
        rows = parseInt(document.getElementById('rows').value);
        cols = parseInt(document.getElementById('cols').value);
        generateSeats();
    });

    // Generate initial seat matrix and reservation details
    generateSeats();
    updateReservationDetails();

});
    