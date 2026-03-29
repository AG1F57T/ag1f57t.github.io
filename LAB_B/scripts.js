class Scripts {
    constructor() {
        this.tasks = [];
        this.term = '';
        this.load();
        this.initEvents();
        this.draw();
    }

    initEvents() {
        const addBtn = document.getElementById('add-btn');
        addBtn.addEventListener('click', () => this.addFromForm());
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => this.setSearch(searchInput.value));
    }

    draw() {
        const list = document.getElementById('task-list');
        list.innerHTML = '';
        const zadaniaDoWyswietlenia = this.getFilteredTasks();
        if (zadaniaDoWyswietlenia.length === 0) {
            list.innerHTML = '<li>Brak zadań.</li>';
            return;
        }
        zadaniaDoWyswietlenia.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
            <span class="task-text">${this.highlightTerm(task.text)}</span>
            <span class="task-date">${task.date ? this.formatDate(task.date) : ''}</span>
            <button class="btn-delete">🗑 Usuń</button>
          `;
            li.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete')) return;
                if (li.querySelector('.task-edit-input')) return;
                this.startEdit(li, task);
            });
            li.querySelector('.btn-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.remove(task.id);
            });
            list.appendChild(li);
        });
    }

    startEdit(li, task) {
        li.innerHTML = `
          <input class="task-edit-input" type="text"
                 value="${this.escapeHtml(task.text)}" maxlength="255">
          <input class="task-edit-date" type="datetime-local"
                 value="${task.date || ''}">
          <button class="btn-delete">🗑 Usuń</button>
        `;

        const inputText = li.querySelector('.task-edit-input');
        const inputDate = li.querySelector('.task-edit-date');

        inputText.focus();

        li.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(task.id);
        });

        const zapiszZmiany = (e) => {
            if (li.contains(e.target)) return;

            document.removeEventListener('mousedown', zapiszZmiany);

            const nowyTekst = inputText.value.trim();

            if (nowyTekst.length >= 3 && nowyTekst.length <= 255) {
                this.edit(task.id, nowyTekst, inputDate.value);
            } else {
                this.draw();
            }
        };

        document.addEventListener('mousedown', zapiszZmiany);
    }

    addFromForm() {
        const poletekstowe = document.getElementById('new-task-input');
        const poleData = document.getElementById('new-task-date');
        const komunikatBledu = document.getElementById('error-msg');

        const tekst = poletekstowe.value.trim();
        const data = poleData.value;

        if (tekst.length < 3) {
            komunikatBledu.textContent = 'Zadanie musi mieć co najmniej 3 znaki!';
            return;
        }

        if (tekst.length > 255) {
            komunikatBledu.textContent = 'Zadanie nie może mieć więcej niż 255 znaków!';
            return;
        }

        if (data !== '') {
            const wybranaData = new Date(data);
            const teraz = new Date();

            if (wybranaData <= teraz) {
                komunikatBledu.textContent = 'Data musi być w przyszłości!';
                return;
            }
        }

        komunikatBledu.textContent = '';
        this.add(tekst, data);
        poletekstowe.value = '';
        poleData.value = '';
    }

    add(text, date = '') {
        const nowezadanie = {
            id: Date.now(),
            text: text,
            date: date
        };

        this.tasks.push(nowezadanie);
        this.save();
        this.draw();
    }

    remove(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.save();
        this.draw();
    }

    edit(id, nowyTekst, nowaData) {
        const zadanie = this.tasks.find(task => task.id === id);

        if (!zadanie) return;

        zadanie.text = nowyTekst;
        zadanie.date = nowaData;

        this.save();
        this.draw();
    }

    setSearch(term) {
        this.term = term.trim();
        this.draw();
    }

    getFilteredTasks() {
        if (this.term.length < 2) {
            return this.tasks;
        }

        return this.tasks.filter(task => {
            return task.text.toLowerCase().includes(this.term.toLowerCase());
        });
    }

    highlightTerm(text) {
        const bezpiecznyTekst = this.escapeHtml(text);

        if (this.term.length < 2) {
            return bezpiecznyTekst;
        }

        const bezpiecznaTerm = this.escapeHtml(this.term);
        const wzorzec = new RegExp(`(${bezpiecznaTerm})`, 'gi');

        return bezpiecznyTekst.replace(wzorzec, '<mark>$1</mark>');
    }

    formatDate(dateString) {
        if (!dateString) return '';

        const d = new Date(dateString);
        const data = d.toLocaleDateString('pl-PL');
        const czas = d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

        return data + ' ' + czas;
    }

    escapeHtml(str) {
        const tymczasowyDiv = document.createElement('div');
        tymczasowyDiv.appendChild(document.createTextNode(str));
        return tymczasowyDiv.innerHTML;
    }

    save() {
        const jsonString = JSON.stringify(this.tasks);
        localStorage.setItem('todo-tasks', jsonString);
    }

    load() {
        const zapisaneDane = localStorage.getItem('todo-tasks');

        if (zapisaneDane !== null) {
            this.tasks = JSON.parse(zapisaneDane);
        }
    }
}

document.todo = new Scripts();