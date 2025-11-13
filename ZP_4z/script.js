var fuelRange = document.getElementById('fuelRange');
var fuelValue = document.getElementById('fuelValue');
var distanceInput = document.getElementById('distanceInput');
var motorcycleBtn = document.getElementById('motorcycleBtn');
var carBtn = document.getElementById('carBtn');
var resultText = document.getElementById('resultText');
var resultIcon = document.querySelector('.emoji-icon');

var MOTORCYCLE_CONSUMPTION = 5;
var CAR_CONSUMPTION = 10;

window.addEventListener('load', () => {
    var userConfirm = confirm('Приступаем?');

    if (userConfirm) {
        alert('Жизнь продолжается, и мы должны двигаться дальше');
    } else {
        alert('Камень остается на месте');
    }
});

fuelRange.addEventListener('input', () => {
    fuelValue.textContent = fuelRange.value;
});

var calculateFuelNeeded = (distance, consumption) => { return (distance / 100) * consumption; };

var checkFuel = (vehicleType) => {
    var availableFuel = parseFloat(fuelRange.value);
    var distance = parseFloat(distanceInput.value);

    if (isNaN(distance) || distance <= 0) {
        resultText.textContent = 'Ты пытаешься кого-то надурить, топай пешком!!';
        resultIcon.src = "./images/boot2.png"
        alert('Пожалуйста, введите корректное расстояние!');
        return;
    }

    var consumption = vehicleType === 'motorcycle' ? MOTORCYCLE_CONSUMPTION : CAR_CONSUMPTION;

    var fuelNeeded = calculateFuelNeeded(distance, consumption);

    if (availableFuel >= fuelNeeded) {
        resultText.textContent = '+';
        resultIcon.src = "./images/sm_1.png"

        var fuelLeft = availableFuel - fuelNeeded;
        setTimeout(() => {
            alert(`Топлива хватит!\n\nНеобходимо: ${fuelNeeded.toFixed(2)} л\nДоступно: ${availableFuel} л\nОстанется: ${fuelLeft.toFixed(2)} л`);
        }, 100);
    } else {
        resultText.textContent = '-';
        resultIcon.src = "./images/sm_2.png"

        var fuelShortage = fuelNeeded - availableFuel;
        setTimeout(() => {
            alert(`Топлива не хватит!\n\nНеобходимо: ${fuelNeeded.toFixed(2)} л\nДоступно: ${availableFuel} л\nНе хватает: ${fuelShortage.toFixed(2)} л`);

        }, 100);
    }
};

motorcycleBtn.addEventListener('click', () => {
    checkFuel('motorcycle');
});

carBtn.addEventListener('click', () => {
    checkFuel('car');
});
