// Pobieranie lokalizacji
const btnLocation = document.getElementById('btn-location');
const coordsDisplay = document.getElementById('coords-display');
const btnNew = document.getElementById('btn-new');

btnLocation.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            coordsDisplay.innerText = `width ${lat} lenght ${lng}`;

            btnNew.style.display = 'inline-block';

            btnNew.addEventListener('click', () => {
                map.setView([lat, lng], 13);
            });
        },
        (error) => {
            coordsDisplay.innerText = "error: consent denied or position unavailable";
            console.error("position error", error);
        }
    );
});

// zgoda na powiadomienia
const btnNotif = document.getElementById('btn-notifications');
const notifStatus = document.getElementById('notif-status');

btnNotif.addEventListener('click', () => {
    if (!("Notification" in window)) {
        alert("your browser does not support notifications");
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            notifStatus.innerText = "Status: permission granted";

            new Notification("Success!", {
                body: "You have granted permission for notifications.",
            });

        } else if (permission === "denied") {
            notifStatus.innerText = "Status: denied.";
        }
    });
});

// mapa
const map = L.map('map').setView([51, 19], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// puzzle
const btnPobierz = document.getElementById('btn-pobierz');
const puzzleContainer = document.getElementById('puzzle-container');
const puzzleContainer2 = document.getElementById('puzzle-container-2');

// przechowywanie puzzle state
const puzzleState = {
    pieces: [], // wszystkie puzzle
    containerMap: {} // mapowanie ID -> kontener
};

// tworzymy sloty w puzzle-container-2
function initializeSlotsContainer() {
    puzzleContainer2.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.id = `slot-${i}`;
        slot.dataset.slotId = i;
        puzzleContainer2.appendChild(slot);
    }
}

// inicjalizujemy sloty na start
initializeSlotsContainer();

// funkcja do tworzenia puzzle
function createPuzzlePiece(canvas, row, col, pieceIndex) {
    const pieceCanvas = document.createElement('canvas');
    pieceCanvas.width = canvas.width / 4;
    pieceCanvas.height = canvas.height / 4;
    pieceCanvas.id = `puzzle-${pieceIndex}`;
    pieceCanvas.dataset.puzzleId = pieceIndex;
    pieceCanvas.draggable = true;

    const ctx = pieceCanvas.getContext('2d');
    ctx.drawImage(
        canvas,
        col * (canvas.width / 4), row * (canvas.height / 4),
        canvas.width / 4, canvas.height / 4,
        0, 0, canvas.width / 4, canvas.height / 4
    );

    // event listenery dla drag & drop
    pieceCanvas.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('puzzleId', pieceIndex);
    });

    return pieceCanvas;
}

btnPobierz.addEventListener('click', () => {
    const mapElement = document.getElementById('map');

    html2canvas(mapElement, { useCORS: true }).then(canvas => {
        puzzleContainer.innerHTML = '';
        puzzleContainer2.innerHTML = '';
        initializeSlotsContainer();
        puzzleState.pieces = [];
        puzzleState.containerMap = {};

        const pieces = [];
        let pieceIndex = 0;

        // tworzymy wszystkie puzzle
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const piece = createPuzzlePiece(canvas, row, col, pieceIndex);
                pieces.push(piece);
                puzzleState.pieces[pieceIndex] = piece;
                puzzleState.containerMap[pieceIndex] = 'scattered';
                pieceIndex++;
            }
        }

        // tasujemy puzzle
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        }

        // dodajemy do rozrzuconych
        pieces.forEach(piece => puzzleContainer.appendChild(piece));

        // setup drag & drop dla rozrzuconych
        setupScatteredPuzzles();
        setupSlots();

        console.log("map sliced to 16 pieces");
    });
});

function setupScatteredPuzzles() {
    const pieces = puzzleContainer.querySelectorAll('canvas');
    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('puzzleId', piece.dataset.puzzleId);
        });

        // drag over na puzzle-container żeby pozwolić drop
        piece.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
    });

    puzzleContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    puzzleContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const puzzleId = parseInt(e.dataTransfer.getData('puzzleId'));
        const piece = document.getElementById(`puzzle-${puzzleId}`);

        if (piece && piece.parentElement !== puzzleContainer) {
            puzzleContainer.appendChild(piece);
            puzzleState.containerMap[puzzleId] = 'scattered';
            checkIfSolved();
        }
    });
}

function setupSlots() {
    const slots = puzzleContainer2.querySelectorAll('.puzzle-slot');

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            slot.style.backgroundColor = '#e0e0e0';
        });

        slot.addEventListener('dragleave', (e) => {
            slot.style.backgroundColor = '';
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.style.backgroundColor = '';

            const puzzleId = parseInt(e.dataTransfer.getData('puzzleId'));
            const slotId = parseInt(slot.dataset.slotId);
            const piece = document.getElementById(`puzzle-${puzzleId}`);

            // sprawdzamy czy to jest poprawne miejsce
            if (puzzleId === slotId) {
                // poprawne miejsce!
                slot.innerHTML = '';
                slot.appendChild(piece);
                slot.classList.add('filled');
                puzzleState.containerMap[puzzleId] = 'grid';
                checkIfSolved();
            } else {
                // niepoprawne miejsce - puzzle wraca do rozrzuconych
                puzzleContainer.appendChild(piece);
                puzzleState.containerMap[puzzleId] = 'scattered';
            }
        });
    });
}


function checkIfSolved() {
    // sprawdzamy czy wszystkie puzzle są w siatce i w poprawnej kolejności
    const slots = puzzleContainer2.querySelectorAll('.puzzle-slot');
    let isSolved = true;

    slots.forEach((slot, index) => {
        const piece = slot.querySelector('canvas');
        if (!piece || parseInt(piece.dataset.puzzleId) !== index) {
            isSolved = false;
        }
    });

    if (isSolved && puzzleContainer2.querySelectorAll('canvas').length === 16) {
        console.log('Puzzle rozwiązane!');

        // wysyłamy powiadomienie jeśli zgoda jest udzielona
            new Notification('Puzzle rozwiązane');
    }
}



