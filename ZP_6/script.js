var sortedData = {};
var draggedElement = null;
var originalColors = {};
var clickedWords = [];

document.getElementById('parseBtn').addEventListener('click', parseWords);

function parseWords() {
    var input = document.getElementById('textInput').value.trim();
    if (!input) {
        alert('Введите строку!');
        return;
    }

    var words = input.split('-');
    var lowercase = [];
    var uppercase = [];
    var numbers = [];

    for (var i = 0; i < words.length; i++) {
        var word = words[i].trim();
        if (word === '') continue;

        if (!isNaN(word)) {
            numbers.push(word);
        } else if (word[0] === word[0].toLowerCase()) {
            lowercase.push(word);
        } else {
            uppercase.push(word);
        }
    }

    lowercase.sort();
    uppercase.sort();
    numbers.sort(function(a, b) { return Number(a) - Number(b); });

    sortedData = {};

    for (var i = 0; i < lowercase.length; i++) {
        sortedData['a' + (i + 1)] = lowercase[i];
    }

    for (var i = 0; i < uppercase.length; i++) {
        sortedData['b' + (i + 1)] = uppercase[i];
    }

    for (var i = 0; i < numbers.length; i++) {
        sortedData['n' + (i + 1)] = numbers[i];
    }

    displayInBlock2();
}

function displayInBlock2() {
    var block2 = document.getElementById('dropZone2');
    block2.innerHTML = '';
    originalColors = {};

    for (var key in sortedData) {
        var wordElement = createWordElement(key, sortedData[key]);
        block2.appendChild(wordElement);
    }
}

function createWordElement(key, value) {
    var wordElement = document.createElement('div');
    wordElement.className = 'word-item';

    var textSpan = document.createElement('span');
    textSpan.className = 'word-text';
    textSpan.textContent = key + ' ' + value;
    wordElement.appendChild(textSpan);

    wordElement.draggable = true;
    wordElement.setAttribute('data-key', key);
    wordElement.setAttribute('data-value', value);
    wordElement.setAttribute('data-origin', 'block2');

    var color = '#79e145';
    wordElement.style.backgroundColor = color;
    originalColors[key] = color;

    wordElement.addEventListener('dragstart', dragStart);

    return wordElement;
}

function dragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-key'));
    e.target.style.opacity = '0.5';
    e.stopPropagation();
}

function handleCardClick(event) {
    if (event.target.closest('.drop-zone').id === 'dropZone1'){
        var value = this.getAttribute('data-value');
        clickedWords.push(value);
        updateDisplayArea();
    }
}

var dropZone1 = document.getElementById('dropZone1');
var dropZone2 = document.getElementById('dropZone2');

dropZone1.addEventListener('dragover', dragOver);
dropZone1.addEventListener('drop', function(e) { dragDropToBlock1(e); });
dropZone1.addEventListener('dragend', dragEnd);

dropZone2.addEventListener('dragover', dragOver);
dropZone2.addEventListener('drop', function(e) { dragDrop(e, 'block2'); });
dropZone2.addEventListener('dragend', dragEnd);

function getRandomColor() {
    var colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function dragDropToBlock1(e) {
    e.preventDefault();

    if (!draggedElement) return;

    var dropZone = e.target;
    if (!dropZone.classList.contains('drop-zone')) {
        dropZone = dropZone.closest('.drop-zone');
        if (!dropZone || dropZone.id !== 'dropZone1') return;
    }

    var currentOrigin = draggedElement.getAttribute('data-origin');

    if (currentOrigin === 'block2') {
        draggedElement.style.backgroundColor = getRandomColor();
        draggedElement.setAttribute('data-origin', 'block1');

        var key = draggedElement.getAttribute('data-key');
        var value = draggedElement.getAttribute('data-value');
        var textSpan = draggedElement.querySelector('.word-text');
        if (textSpan) {
            textSpan.textContent = key + ' ' + value;
        }

        draggedElement.addEventListener('click', handleCardClick);

        if (draggedElement.parentNode !== dropZone) {
            dropZone.appendChild(draggedElement);
        }
    }

    draggedElement.style.opacity = '1';

    var rect = dropZone.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var cardRect = draggedElement.getBoundingClientRect();
    var cardWidth = cardRect.width;
    var cardHeight = cardRect.height;

    x = x - (cardWidth / 2);
    y = y - (cardHeight / 2);

    x = Math.max(0, Math.min(x, rect.width - cardWidth));
    y = Math.max(0, Math.min(y, rect.height - cardHeight*1.5));

    draggedElement.style.left = x + 'px';
    draggedElement.style.top = y + 'px';

    draggedElement = null;
}


function updateDisplayArea() {
    var displayArea = document.getElementById('displayArea');
    displayArea.textContent = clickedWords.join(' ');
}

function dragEnd(e) {
    if (draggedElement) {
        draggedElement.style.opacity = '1';
    }
    var items = document.querySelectorAll('.word-item');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('drag-over');
    }
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop(e, targetBlock) {
    if (!e.target.classList.contains('drop-zone')) return;

    var key = e.dataTransfer.getData('text/plain');

    if (!draggedElement) return;
    draggedElement.style.opacity = '1';

    var currentOrigin = draggedElement.getAttribute('data-origin');

    if (targetBlock === 'block2' && currentOrigin === 'block1') {
        draggedElement.style.backgroundColor = '#79e145';
        draggedElement.style.opacity = '1';
        draggedElement.setAttribute('data-origin', 'block2');
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';

        var value = draggedElement.getAttribute('data-value');
        var textSpan = draggedElement.querySelector('.word-text');
        if (textSpan) {
            textSpan.textContent = key + ' ' + value;
        }

        var allItems = dropZone2.querySelectorAll('.word-item');
        var inserted = false;

        for (var i = 0; i < allItems.length; i++) {
            var itemKey = allItems[i].getAttribute('data-key');
            if (key < itemKey) {
                console.log('Переносимое ' + key)
                console.log('Старшее' + itemKey)
                dropZone2.insertBefore(draggedElement, allItems[i]);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            dropZone2.appendChild(draggedElement);
        }
    }

    draggedElement = null;
}