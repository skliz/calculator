const weatherBlock = document.querySelector('.weather');
// loadData
const loadData = async () => {
	const url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=Novomoskovsk&appid=a68f1c86e0b5ee48a587c1956f921a58';
	try {
		weatherBlock.innerHTML = `
		<div class="weather__loading">
		<img src="img/loading.gif" alt="loading...">
		</div>`;

		const response = await fetch(url, {})
			.then(res => res.json())
			.then(data => getData(data))
	} catch (err) {
		console.log('Error >>>', err)
		throw err;
	}
}
loadData();
// getData
const getData = (data) => {
	console.log(data);
	const location = data.name.replace('Novomoskovsk', 'Новомосковск');
	const temp = Math.round(data.main.temp);
	const feelsLike = Math.round(data.main.feels_like);
	const weatherStatus = data.weather[0].description.toLowerCase();
	const weatherIcon = data.weather[0].icon;
	const visibility = (data.visibility / 1000).toFixed(1);
	const weather = {
		'clouds': 'облака',
		'scattered clouds': 'рассеянные облака',
		'overcast clouds': 'пасмурные облака',
		'broken clouds': 'редкие облака',
		'few clouds': 'малая облачность',
		'snow': 'снег',
		'light snow': 'легкий снег',
		'moderate snow': 'умеренный снег',
		'heavy intensity snow': 'сильный интенсивный снег',
		'rain and snow': 'дождь и снег',
		'rain': 'дождь',
		'light rain': 'легкий дождь',
		'moderate rain': 'умеренный дождь',
		'heavy intensity rain': 'сильный интенсивный дождь',
		'clear sky': 'чистое небо',
	};
	// html шаблон
	const template = `
	<div class="weather__city">${location}</div>
	<div class="weather__status">${weather[weatherStatus]}</div>
	<div class="weather__icon">
		<img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherStatus}">
	</div>
	<div class="weather__temp">${temp}C</div>
	<div class="weather__feels-like">как будто ${feelsLike}C </div>
	<div class="weather__visibility">видимость ${visibility} км</div>
`;
	weatherBlock.innerHTML = template;
}

setInterval(() => {
	const date = new Date();
	const dateDay = date.getDate();
	const dateDayWeek = date.getDay();
	const dateMonth = date.getMonth();
	const dateYear = date.getFullYear();
	const dateHours = date.getHours();
	const dateMinutes = date.getMinutes();
	const dateSecundes = date.getSeconds();
	getDate(dateDay, dateDayWeek, dateMonth, dateYear, dateHours, dateMinutes, dateSecundes);
}, 1000);

// date
function getDate(...data) {
	const [day, dayweek, month, year, hours, min, sec] = data;
	const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
	const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
	const date = document.querySelector('.date');
	const time = document.querySelector('.time');

	// html шаблон
	const template = `
	<div class="date__wrap">
	<p class="date__item date__day">${day}</p>
	<p class="date__item">${months[month]}</p>
	<p class="date__item">${year} г.</p>
	</div>
	<p class="date__day">${days[dayweek]}</p>
	`;
	// html шаблон
	const template1 = `
	<p class="time__item">${hours < 10 ? '0' + hours : hours}:</p>
	<p class="time__item">${min < 10 ? '0' + min : min}:</p>
	<p class="time__item">${sec < 10 ? '0' + sec : sec}</p>
	`;

	date.innerHTML = template;
	time.innerHTML = template1;
}
// calculations
function calculations() {
	// Получаем DOM-элементы
	const $calc = document.querySelector('.calc');
	const $inputKilometr = document.getElementById('kilometr');
	const $inputDut = document.getElementById('dut');
	const $displayBenzin = document.getElementById('display-benzin');
	const $displayGaz = document.getElementById('display-gaz');
	const $displayConsumGaz = document.getElementById('consum-gaz');
	const $btnSeason = document.querySelector('.calc__season');
	const $btnCalculate = document.querySelector('.calc__calculate');
	const $btnClear = document.querySelector('.calc__clear');
	const $wrap1 = document.querySelector('.wrap_1');
	const $wrap2 = document.querySelector('.wrap_2');
	const $wrap3 = document.querySelector('.wrap_3');

	let flag = true;
	// Кнопка выбора сезона
	$btnSeason.addEventListener('click', (e) => {
		flag = !flag;
		flag ? $btnSeason.textContent = 'Лето' : $btnSeason.textContent = 'Зима';
	});
	// Создание подписей
	const labelBenzin = document.createElement('label');
	labelBenzin.classList.add('label');
	const labelGaz = document.createElement('label');
	labelGaz.classList.add('label');
	const labelConsumGaz = document.createElement('label');
	labelConsumGaz.classList.add('label');

	// Основной расчет
	$btnCalculate.addEventListener('click', (e) => {
		const km = +$inputKilometr.value;
		const dut = +$inputDut.value.replace(/,/g, `.`);
		// Расчет по бензину
		const kmBenzin = parseInt(dut / ($btnSeason.textContent === 'Лето' ? 17.8 : 19.6) * 100);
		$displayBenzin.textContent = `${kmBenzin} км.`;
		labelBenzin.textContent = 'Машина проехала на бензине';
		$wrap1.append(labelBenzin);
		// Расчет по газу
		const kmGaz = km - kmBenzin;
		$displayGaz.textContent = `${kmGaz} км.`;
		labelGaz.textContent = 'Машина проехала на газу';
		$wrap2.append(labelGaz);
		// Расход газа по норме
		const consumGaz = +(kmGaz * ($btnSeason.textContent === 'Лето' ? 17.8 : 19.6) / 100).toFixed(3);
		$displayConsumGaz.textContent = `${consumGaz} ед.`;
		labelConsumGaz.textContent = 'Расход газа по норме';
		$wrap3.append(labelConsumGaz);
	});
	// Кнопка отчистки
	$btnClear.addEventListener('click', (e) => {
		$displayBenzin.textContent = '';
		$displayGaz.textContent = '';
		$displayConsumGaz.textContent = '';
		labelBenzin.textContent = '';
		labelGaz.textContent = '';
		labelConsumGaz.textContent = '';
	});
}
calculations();

// calculator
const calcInput = document.querySelector('.calculator__input');
const calculator = document.querySelector('.calculator');

const insert = (num) => {
	return calcInput.value += num;
}

const clean = () => {
	calcInput.value = '';
}

const back = () => {
	let exp = calcInput.value;
	calcInput.value = exp.substring(0, exp.length - 1);
}

const equal = () => {
	const exp = calcInput.value;
	exp ? calcInput.value = eval(exp) : null;
}
// Кнопка калкулятор
document.querySelector('.btn-calc').addEventListener('click', (e) => {
	calculator.classList.toggle('show');
});