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

    var color = '#e0e0e0';
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

function dragOverItem(e) {
    if (e.target.classList.contains('word-item') && e.target !== draggedElement) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add('drag-over');
    }
}

function dragLeaveItem(e) {
    if (e.target.classList.contains('word-item')) {
        e.target.classList.remove('drag-over');
    }
}

function dropOnItem(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedElement || e.target === draggedElement) return;

    var targetItem = e.target.closest('.word-item');
    if (targetItem) {
        targetItem.classList.remove('drag-over');
    }

    if (targetItem && targetItem !== draggedElement) {
        var container = targetItem.querySelector('.nested-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'nested-container';
            targetItem.appendChild(container);
        }

        draggedElement.style.opacity = '1';
        container.appendChild(draggedElement);

        var currentOrigin = draggedElement.getAttribute('data-origin');
        if (currentOrigin === 'block2') {
            var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            draggedElement.style.backgroundColor = randomColor;
            draggedElement.setAttribute('data-origin', 'block1');

            var key = draggedElement.getAttribute('data-key');
            var value = draggedElement.getAttribute('data-value');
            var textSpan = draggedElement.querySelector('.word-text');
            if (textSpan) {
                textSpan.textContent = key + ' ' + value;
            }

            draggedElement.addEventListener('click', handleCardClick);
        }
    }

    draggedElement = null;
}

function handleCardClick(event) {
    event.stopPropagation();
    var value = this.getAttribute('data-value');
    clickedWords.push(value);
    updateDisplayArea();
}

function updateDisplayArea() {
    var displayArea = document.getElementById('displayArea');
    displayArea.textContent = clickedWords.join(' ');
}

var dropZone1 = document.getElementById('dropZone1');
var dropZone2 = document.getElementById('dropZone2');

dropZone1.addEventListener('dragover', dragOver);
dropZone1.addEventListener('drop', function(e) { dragDropToBlock1(e); });
dropZone1.addEventListener('dragend', dragEnd);

dropZone2.addEventListener('dragover', dragOver);
dropZone2.addEventListener('drop', function(e) { dragDrop(e, 'block2'); });
dropZone2.addEventListener('dragend', dragEnd);

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
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        draggedElement.style.backgroundColor = randomColor;
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
    y = Math.max(0, Math.min(y, rect.height - cardHeight));

    draggedElement.style.left = x + 'px';
    draggedElement.style.top = y + 'px';

    draggedElement = null;
}

function handleCardClick(event) {
    event.stopPropagation();
    var value = this.getAttribute('data-value');
    clickedWords.push(value);
    updateDisplayArea();
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

    e.preventDefault();
    var key = e.dataTransfer.getData('text/plain');

    if (!draggedElement) return;

    var currentOrigin = draggedElement.getAttribute('data-origin');

    if (targetBlock === 'block2' && currentOrigin === 'block1') {
        draggedElement.style.backgroundColor = originalColors[key];
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