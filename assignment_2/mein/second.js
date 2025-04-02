const matrixContainer = document.getElementById('matrix-container');
const form = document.getElementById('user-form');
const userName = document.getElementById('userName');
const selectedSeats = document.getElementById('selectedSeats');
const totalPrice = document.getElementById('totalPrice');
let rows = 0;
var cols = 0;
let currentLetter = 'A';
let currentNumber = 1;
var color = "blue";
let seats = [];
function generateSeat() {
    matrixContainer.style.gridTemplateColumns = 'repeat(${cols}, 3em)';

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = `${currentLetter}${currentNumber}`;
        cell.addEventListener('click', function () {
            cell.classList.toggle('clicked');
        });
        matrixContainer.appendChild(cell);

        currentNumber++;
        if (currentNumber > cols) {
            currentNumber = 1;
            currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
        }
    }
    selectSeats();
}

document.getElementById('login-button').addEventListener('click', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const adminInterface = document.getElementById('admin-interface');
    

    if (email === 'admin@admin.com') {
        adminInterface.style.display = 'block';
        matrixContainer.style.display = 'block';

    } else {
        adminInterface.style.display = 'none';
        matrixContainer.style.display = 'block';
    }
});
document.getElementById('setBtn').addEventListener('click', function(){
    rows = document.getElementById('rows').value;
    cols = document.getElementById('columns').value;
    generateSeat();
}); 

function selectSeats(){
    seats.forEach(seat => {
        seats.addEventListener('click', function(){
            if(!seat.selected){
                seat.selected = true;
                seat.classList.add('selected');
            }else{
                seat.selected = false;
                seat.classList.remove('selected');
            }

        })
    })
    updateReservationDetails();
}
function updateReservationDetails(){
    
    let selected = seats.filter(seat => seat.selected);
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let age = parseInt(document.getElementById('age').value);
            var total = selected.reduce((sum, seat) => {
                if (0<=age||age < 18 || age >= 65) {
                    return sum + 10;
                } else if (age >= 18 && age < 26) {
                    return sum + 15;
                } else {
                    return sum + 25;
                }
            }, 0);
            userName.textContent = `${name} ${surname}`;
            selectedSeats.textContent = selected.map(seat => seat.cell.textContent).join(', ');
            totalPrice.textContent = total;
}
