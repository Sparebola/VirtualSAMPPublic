function getGangZonePos(gangZoneId) {
	const array = {
		0: { left: 573,
			top: 700,
			width: 28,
			height: 12, }, // Респа ЛКН
		1: { left: 105,
			top: 318,
			width: 15,
			height: 22, }, // Респа яков
		2: { left: 63,
			top: 87,
			width: 12,
			height: 7, }, // Респа РМ
		3: { left: 695,
			top: 574,
			width: 15,
			height: 8, }, // Респа баллас
		4: { left: 809,
			top: 582,
			width: 12,
			height: 11, }, // Респа вагосов
		5: { left: 663,
			top: 683,
			width: 12,
			height: 11, }, // Респа короносов
		6: { left: 759,
			top: 649,
			width: 17,
			height: 13, }, // Респа грув
		7: { left: 549,
			top: 113,
			width: 14,
			height: 21, }, // Респа стритов
		8: { left: 71,
			top: 431,
			width: 10,
			height: 13, }, // Респа рифы
		9: { left: 773,
			top: 149,
			width: 23,
			height: 30, }, // Респа ТТМ
		10: { left: 682,
			top: 312,
			width: 17,
			height: 20, }, // Респа байкеров
		11: { left: 620,
			top: 27,
			width: 17,
			height: 11, }, // Респа бк
		12: { left: 608,
			top: 587,
			width: 10,
			height: 22, }, // Центр аммо 0
		13: { left: 51,
			top: 388,
			width: 6,
			height: 8, }, // Аммо яков 1
		14: { left: 143,
			top: 350,
			width: 7,
			height: 20, }, // Ресторан рм 2
		15: { left: 774,
			top: 269,
			width: 12,
			height: 9, }, // Старая респа байкеров 3
		16: { left: 718,
			top: 84,
			width: 11,
			height: 9, }, // 4
		17: { left: 44,
			top: 218,
			width: 17,
			height: 11, }, // 5
		18: { left: 752,
			top: 587,
			width: 13,
			height: 11, }, // 6
		19: { left: 107,
			top: 431,
			width: 10,
			height: 9, }, // 7
		20: { left: 742,
			top: 638,
			width: 9,
			height: 16, }, // 8
		21: { left: 675,
			top: 647,
			width: 17,
			height: 20, }, // 9
		22: { left: 750,
			top: 121,
			width: 14,
			height: 8, }, // 10
		23: { left: 61,
			top: 381,
			width: 7,
			height: 18, }, // 11
		24: { left: 621,
			top: 630,
			width: 19,
			height: 15, }, // 12
		25: { left: 296,
			top: 199,
			width: 8,
			height: 11, }, // 13
		26: { left: 748,
			top: 692,
			width: 12,
			height: 11, }, // 14
		27: { left: 720,
			top: 282,
			width: 14,
			height: 12, }, // 15
		28: { left: 373,
			top: 295,
			width: 10,
			height: 13, }, // 16
		29: { left: 203,
			top: 51,
			width: 9,
			height: 7, }, // 17
		30: { left: 525,
			top: 151,
			width: 11,
			height: 13, }, // 18
		31: { left: 772,
			top: 125,
			width: 14,
			height: 9, }, // 19
		32: { left: 742,
			top: 406,
			width: 8,
			height: 19, }, // 20
		33: { left: 453,
			top: 439,
			width: 7,
			height: 12, }, // 21
		34: { left: 760,
			top: 245,
			width: 14,
			height: 8, }, // 22
		35: { left: 615,
			top: 53,
			width: 13,
			height: 5, }, // 23
		36: { left: 649,
			top: 170,
			width: 11,
			height: 12, }, // 24
		37: { left: 141,
			top: 289,
			width: 19,
			height: 12, }, // 25
		38: { left: 709,
			top: 587,
			width: 15,
			height: 6, }, // 26
		39: { left: 599,
			top: 369,
			width: 10,
			height: 9, }, // 27
		40: { left: 95,
			top: 91,
			width: 12,
			height: 15, }, // 28
		41: { left: 181,
			top: 227,
			width: 8,
			height: 10, }, // 29
		42: { left: 689,
			top: 707,
			width: 14,
			height: 16, }, // 30
		43: { left: 694,
			top: 597,
			width: 17,
			height: 11, }, // 31
		44: { left: 533,
			top: 658,
			width: 15,
			height: 12, }, // 32
		45: { left: 556,
			top: 573,
			width: 12,
			height: 8, }, // 33
		46: { left: 718,
			top: 174,
			width: 27,
			height: 30, }, // 34
		47: { left: 511,
            top: 136,
            width: 13,
            height: 16, }, // 37
		48: { left: 393,
            top: 265,
            width: 17,
            height: 12, }, // 39
		49: { left: 815,
            top: 630,
            width: 8,
            height: 12, }, // 40
		50: { left: 571,
            top: 600,
            width: 12,
            height: 17, }, // 41
		51: { left: 813,
            top: 72,
            width: 17,
            height: 26, }, // 42
		52: { left: 511,
            top: 482,
            width: 9,
            height: 12, }, // 43
		53: { left: 474,
            top: 669,
            width: 6,
            height: 13, }, // 44
		54: { left: 96,
            top: 413,
            width: 9,
            height: 11, }, // 45
		55: { left: 791,
            top: 596,
            width: 13,
            height: 11, }, // 46
		56: { left: 142,
            top: 377,
            width: 10,
            height: 9, }, // 48
		57: { left: 64,
            top: 504,
            width: 8,
            height: 17, }, // 49
		58: { left: 437,
            top: 213,
            width: 24,
            height: 20, }, // 50
		59: { left: 314,
            top: 119,
            width: 30,
            height: 27, }, // 51
		60: { left: 754,
            top: 771,
            width: 14,
            height: 22, }, // 52
		61: { left: 163,
            top: 204,
            width: 16,
            height: 21, }, // 53
		62: { left: 550,
            top: 163,
            width: 10,
            height: 29, }, // 54
		63: { left: 762,
            top: 624,
            width: 15,
            height: 16, }, // 55
		64: { left: 158,
            top: 398,
            width: 8,
            height: 26, }, // 56
		65: { left: 563,
            top: 542,
            width: 17,
            height: 12, }, // 59
		66: { left: 811,
            top: 278,
            width: 15,
            height: 25, }, // 64
		67: { left: 204,
            top: 456,
            width: 22,
            height: 27, }, // 65
		68: { left: 680,
            top: 726,
            width: 23,
            height: 25, }, // 66
		69: { left: 643,
            top: 191,
            width: 20,
            height: 18, }, // 67
		70: { left: 557,
            top: 258,
            width: 27,
            height: 24, }, // 68
		71: { left: 815,
            top: 615,
            width: 9,
            height: 13, }, // 73
	}
	return array[gangZoneId];
}

function getGangZoneName(gangZoneID) {
	let capinfo = getCapinfo(gangZoneID);
	if (capinfo == "N/A") {
		return capinfo;
	}
	
	const capInfoTab = {
		0: "Ц. Аммо LS",
		1: "Ц. Аммо SF",
		2: "Ресторан SF",
		3: "Бар ст. респы байкеров",
		4: "Бар Emerald",
		5: "Бар Jizzy",
		6: "Бар Pig Pen",
		7: "Бар Deliver",
		8: "Бар Grove",
		9: "Альхамбра",
		10: "Бар ТТМ",
		11: "Бар Yakuza",
		12: "Ресторан LSPD",
		13: "Бар Буренки",
		14: "Аммо Grove",
		15: "Аммо 4 драконов",
		16: "Аммо Карьера",
		17: "Аммо деревни РМ",
		18: "Аммо Street Racers",
		19: "Аммо ТТМ",
		20: "Аммо КХ",
		21: "Аммо ДБ",
		22: "Бар Баскет",
		23: "Аммо Black Kings",
		24: "Ц.Бинко LV",
		25: "Ц.Бинко SF",
		26: "Ц.Бинко LS",
		27: "Аммо Закупки",
		28: "Аммо РМ",
		29: "Новое аммо SF",
		30: "Аммо El Coronos",
		31: "Аммо Ballas",
		32: "Аммо LCN",
		33: "Казино 4 дракона",
		34: "Казино Калигула",
		37: "Бар Street Racers",
		39: "Бар Кактус",
		40: "Бар Вагос",
		41: "Новое бинко LS",
		42: "Новое бинко LV",
		43: "Бар Dilimore",
		44: "Бар Santa Maria",
		45: "Бинко Рифы",
		46: "Аммо Vagos",
		48: "Аренда авто SF",
		49: "Телефонная компания",
		50: "Нефтебаза",
		51: "Электростанция",
		52: "Car Delivery",
		53: "House Upgrade",
		54: "Студия CNN",
		55: "Fixcar",
		56: "General Store (24/7)",
		59: "Тюнинг дом.транспорта",
		64: "KFC штата",
		65: "Аэропорт SF",
		66: "Аэропорт LS",
		67: "Аэропорт LV",
		68: "Банк San Andreas",
		73: "Бинко Vagos",
	}
	return capInfoTab[capinfo];
}

function getFracOnColor(color) {
	const fracColor = {
		"#057F94": "La Cosa Nostra",
		"#8A2CD7": "The Ballas Gang",
		"#FAFB71": "Yakuza",
		"#20D4AD": "San Fierro Rifa",
		"#4C436E": "Black Kings",
		"#FA24CC": "The Triads Mafia",
		"#70524D": "Hell Angels",
		"#0FD9FA": "El Coronos",
		"#6495ED": "Street Racers",
		"#FFD720": "Los Santos Vagos",
		"#778899": "Russian Mafia",
		"#10DC29": "The Grove Street",
	};
	let frac = fracColor[color];
	return frac ? frac : "N/A";
}

function getCapinfo(gangZoneID) {
	let offset = 0;
	if (gangZoneID >= 12 && gangZoneID <= 46) {
		offset = 12;
	} else if (gangZoneID == 47) {
		offset = 10;
	} else if (gangZoneID >= 48 && gangZoneID <= 55) {
		offset = 9;
	} else if (gangZoneID >= 56 && gangZoneID <= 64) {
		offset = 8;
	} else if (gangZoneID == 65) {
		offset = 6;
	} else if (gangZoneID >= 66 && gangZoneID <= 70) {
		offset = 2;
	} else if (gangZoneID == 71) {
		offset = -2;
	}
	return offset != 0 ? gangZoneID - offset : "N/A";
}

let updateTimer = null;

function secondToTime(time) {
	if (time >= 0) {
		let hour = Math.floor(time / 3600);
		let min = Math.floor((time % 3600) / 60);
		let sec = Math.floor((time % 3600) % 60);
		return ((hour < 10) ? "0" + hour : hour) + ":" + ((min < 10) ? "0" + min : min) + ":" + ((sec < 10) ? "0" + sec : sec)
	} else {
		return "00:00:00";
	}
}

function getMoscowDate() {
    var offset = +3;
	// var offset = +3;
    return new Date( new Date().getTime() + offset * 3600 * 1000);
}

function diffDates(day_one, day_two) {
	return Math.abs(day_one - day_two) / 1000;
};

function getGangZoneTime(time) {
    const currectTime = new Date().getTime();
	const diff = diffDates(currectTime, time);

	return secondToTime(diff);
}

function convertColor(color) {
	/* Check for # infront of the value, if it's there, strip it */
  
	if(color.substring(0,1) == '#') {
	   color = color.substring(1);
	 }
  
	var rgbColor = {};
  
	/* Grab each pair (channel) of hex values and parse them to ints using hexadecimal decoding */
	rgbColor.r = parseInt(color.substring(0,2),16);
	rgbColor.g = parseInt(color.substring(2,4),16);
	rgbColor.b = parseInt(color.substring(4),16);
  
	return "rgb(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ")"
}

function createGangZone(gangZoneId) {
	const arr = getGangZonePos(gangZoneId);
	const div = document.createElement('div');
		div.className = "image__gangZone";
		div.id = gangZoneId + " gangZone";
		div.style.left = arr.left + "px";
		div.style.top = arr.top + "px";
		div.style.width = arr.width + "px";
		div.style.height = arr.height + "px";
		div.style.background = "#FFFFFF";
	gangZone.prepend(div);
}

function changeGangZone(color, gangZoneId) {
	const el = document.getElementById(gangZoneId + " gangZone");
	el.style.background = color;
}

function createNumberTerr(frac, int, color) {
	const div = document.createElement('div');
		div.className = "num-territories__line";
	numberTerr.append(div);

	const divInt = document.createElement('div');
		divInt.className = "line__int";
		divInt.innerHTML = int;
	div.prepend(divInt);

	const divFrac = document.createElement('div');
		divFrac.className = "line__frac";
		divFrac.innerHTML = frac;
		divFrac.style.color = color;
	div.prepend(divFrac);
}

function changeNumberTerr(frac, int) {
	const el = document.getElementById(frac + " numberTerr");
	el.innerHTML = int;
}

function createCapInfo(gangZoneID, color1, color2, time) {
	let gangZoneName = getGangZoneName(gangZoneID);
	let ownerFrac = getFracOnColor(color1);
	let attackedFrac = getFracOnColor(color2);
	let howGoesTime = getGangZoneTime(time)

	// The Triads Mafia vs Los Santos Vagos<br>Аммо 4 дракона | 05:37
	const div = document.createElement('div');
		div.className = "capture__line";
		div.id = gangZoneID + " line";
	capInfoTerr.prepend(div);

	let p = document.createElement('p');
		p.style.color = color1;
		p.innerHTML = ownerFrac;
	div.append(p);

	p = document.createElement('p');
		p.innerHTML = "&nbsp;vs&nbsp;";
	div.append(p);

	p = document.createElement('p');
		p.style.color = color2;
		p.innerHTML = attackedFrac + "&nbsp;";
	div.append(p);

	p = document.createElement('p');
		p.style.width = "100%";
		p.innerHTML = gangZoneName + " | " + howGoesTime;
	div.append(p);
}

function createNoneCapture(text) {
	const div = document.createElement('div');
		div.className = "capture__line";
		div.innerHTML = text;
	capInfoTerr.prepend(div);
}

const interval = [];
const numberTerrTab = [
	{frac: "La Cosa Nostra", color: "#057F94", int: -1},
	{frac: "The Ballas Gang", color: "#8A2CD7", int: -1},
	{frac: "Yakuza", color: "#FAFB71", int: -1},
	{frac: "San Fierro Rifa", color: "#20D4AD", int: -1},
	{frac: "Black Kings", color: "#4C436E", int: -1},
	{frac: "The Triads Mafia", color: "#FA24CC", int: -1},
	{frac: "Hell Angels", color: "#70524D", int: -1},
	{frac: "El Coronos", color: "#0FD9FA", int: -1},
	{frac: "Street Racers", color: "#6495ED", int: -1},
	{frac: "Los Santos Vagos", color: "#FFD720", int: -1},
	{frac: "Russian Mafia", color: "#778899", int: -1},
	{frac: "The Grove Street", color: "#10DC29", int: -1}
];

function clearArrayGangZone() {
	numberTerrTab.map((tab) => {
		tab.int = -1;
		return tab;
	});
}

function createGangZoneInMap(gangZoneID, color1, color2, date) {
	interval[interval.length++] = setInterval(function() {
		let el = document.getElementById(gangZoneID + " gangZone");
		if (el.style.background == convertColor(color1)) {
			el.style.background = color2
		} else {
			el.style.background = color1
		}

		el = document.getElementById(gangZoneID + " line");
		const str = el.innerHTML;
		const match = str.match(/.* | /g);
		if (match.length >= 1) {
			el.innerHTML = match[0] + getGangZoneTime(date);
		}
	}, 500);
}

function clearAllPage() {
	// Удаляем все Активные захваты
	let element = document.getElementById("capInfoTerr");
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}

	// Удаляем все Количество территорий:
	element = document.getElementById("numberTerr");
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}

	// Удаляем все таймеры мигания терр и захвата
	for (let index = 0; index < interval.length; index++) {
		const element = interval[index];
		clearInterval(element);
	}
	interval.length = 0;

	// Чистим кол-во терр в массиве
	clearArrayGangZone();
}

function createFracNumberTerritories() {
	numberTerrTab.sort((a, b) => {
		if (a.int > b.int) {
			return -1;
		   }
	
	   if (a.int < b.int) {
			return 1;
		}
	
		return 0;
	});

	// Обновляём Количество территорий
	for (let index = 0; index < numberTerrTab.length; index++) {
		const element = numberTerrTab[index];
		createNumberTerr(element.frac, element.int, element.color)
	}
}

// const url = 'http://localhost:80/virtualsamp/api?action=';
const url = 'https://sparebola.ru/virtualsamp/api?action=';

function main() {
	(async () => {
		let response = await fetch(url + "gangzone");

		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			const tab = await response.json();
			// Удаляем старую информацию
			clearAllPage();

			for (let i = 0; i < tab.length; i++) {
				const element = tab[i];
				// Изменяем территории
				changeGangZone(element.color1, element.gangZoneID);

				// Получаем Количество территорий
				for (let index = 0; index < numberTerrTab.length; index++) {
					const tab = numberTerrTab[index];

					if (tab.color == element.color1) {
						++tab.int
					}
				}


				if (element.flash) {
					// Создаём блоки в "Активные захваты:"
					createCapInfo(element.gangZoneID, element.color1, element.color2, element.date)

					// Каждую секунду территория мигает и идёт таймер захвата
					createGangZoneInMap(element.gangZoneID, element.color1, element.color2, element.date);
				}
			}

			// Если нет активных зх, пишем
			element = document.getElementById("capInfoTerr");
			if (!element.childElementCount) {
				createNoneCapture("Нет активных захватов");
			}

			// Создаём Количество территорий
			createFracNumberTerritories();
		} else {
			console.log("Ошибка HTTP: " + response.status);
		}
	})();
}

async function dateSchedule(formattedDate, date, inst) {
	if (date) {
		if (date.length == 2) {
			const request = await getGangZoneBD(rusDateToUa(date[0]), rusDateToUa(date[1]));

			if (request) {
				// console.log(request);

				const labels = [];
				const datasets = [];
				const dataFrac = {
					"La Cosa Nostra": [],
					"The Ballas Gang": [],
					"Yakuza": [],
					"San Fierro Rifa": [],
					"Black Kings": [],
					"The Triads Mafia": [],
					"Hell Angels": [],
					"El Coronos": [],
					"Street Racers": [],
					"Los Santos Vagos": [],
					"Russian Mafia": [],
					"The Grove Street": []
				};

				// datasets: [
				// 	{
				// 		label: "La Cosa Nostra",
				// 		data: [12, 19, 3, 5, 2, 3],
				// 		backgroundColor: "#057F94",
				// 		borderColor: "#057F94",
				// 		borderWidth: 1.5
				// 	},

				for (let index = 0; index < request.length; index++) {
					const element = request[index];
					
					// Считаем кол-во территорий за выбранные дни у каждой фракции
					const terr = {
						"La Cosa Nostra": -1,
						"The Ballas Gang": -1,
						"Yakuza": -1,
						"San Fierro Rifa": -1,
						"Black Kings": -1,
						"The Triads Mafia": -1,
						"Hell Angels": -1,
						"El Coronos": -1,
						"Street Racers": -1,
						"Los Santos Vagos": -1,
						"Russian Mafia": -1,
						"The Grove Street": -1
					};
					for (let key in element.territory) {
						const frac = element.territory[key];
						++terr[frac]
					}

					// Записываем кол-во территорий за день у фракции
					for (let key in terr) {
						const int = terr[key];
						(dataFrac[key]).push(int)
					}

					// Формируем колонки дат
					labels.push(new Date(element.date).toLocaleDateString())
				}

				// Создаём информацию для графика
				for (let index = 0; index < numberTerrTab.length; index++) {
					const tab = numberTerrTab[index];

					datasets.push({
						label: tab.frac,
						data: dataFrac[tab.frac],
						backgroundColor: tab.color,
						borderColor: tab.color,
						borderWidth: 1.5
					})
				}
				
				createSchedule(labels, datasets)
			}
			else {
				alert("За выбранную дату нет информации");
			}
		}
	}
}

let falsePickDate = true;
async function dateHandling(formattedDate, date, inst) {
	if (date && !falsePickDate) {
		if (date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
			main();
			updateTimer = setInterval(main, 10000);
		}
		else {
			const request = await getGangZoneBD(rusDateToUa(date), rusDateToUa(date));

			if (request) {
				// Удаляем обновление информации
				if (updateTimer) {
					clearInterval(updateTimer);
					updateTimer = null;
				}

				// Удаляем старую информацию
				clearAllPage();

				// Изменяем квадратики на карте
				const tab = request[0].territory;
				const fracColor = {
					"La Cosa Nostra": "#057F94",
					"The Ballas Gang": "#8A2CD7",
					"Yakuza": "#FAFB71",
					"San Fierro Rifa": "#20D4AD",
					"Black Kings": "#4C436E",
					"The Triads Mafia": "#FA24CC",
					"Hell Angels": "#70524D",
					"El Coronos": "#0FD9FA",
					"Street Racers": "#6495ED",
					"Los Santos Vagos": "#FFD720",
					"Russian Mafia": "#778899",
					"The Grove Street": "#10DC29",
				};
				for (key in tab) {
					const gangColor = fracColor[tab[key]];
					changeGangZone(gangColor, key);

					// Получаем Количество территорий
					for (let index = 0; index < numberTerrTab.length; index++) {
						const tab = numberTerrTab[index];

						if (tab.color == gangColor) {
							++tab.int
						}
					}
				}

				// Создаём блок в Активные захваты:
				createNoneCapture("Показана информация за " + formattedDate);

				// Создаём Количество территорий
				createFracNumberTerritories();
			}
		}
	}
	falsePickDate = false;
}

let myChart = null;
function createSchedule(labels, datasets) {
	const ctx = document.getElementById('myChart');
	if (myChart) {
		myChart.data.labels = labels;
		myChart.data.datasets = datasets;
		myChart.update();
	}
	else {
		myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					title: {
						text: " Кол-во территориий после каждого дня ",
						display: true,
						padding: 15
					},
					legend: {
						position: "bottom",
						labels: {
							boxWidth: 10,
							boxHeight: 10
						}
					}
				}
			}
		});
	}
}

function createDataPicker(name, date, tab, offset) {
	const datepicker = $(name).datepicker().data('datepicker');
	datepicker.update(tab);
	datepicker.selectDate(date);

	// Адаптация размера выбора дат
	const mediaQuery = window.matchMedia('(max-width: 464px)')
	if (mediaQuery.matches) {
		datepicker.update({
			position: "left top",
			offset: offset
		});
	}
	return datepicker;
}

const getGangZoneBD = async (minDate, maxDate) => {
	const response = await fetch(url + "gangzoneBD&minDate=" + minDate + "&maxDate=" + maxDate);

	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		return await response.json();
	}
	else if (response.status != 418) {
		console.log(console.log("Ошибка HTTP: " + response.status));
	}
}

function rusDateToUa(date) {
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

document.addEventListener('DOMContentLoaded', () => {

	// Создаём блоки Количество территорий
	for (let index = 0; index < numberTerrTab.length; index++) {
		const element = numberTerrTab[index];
		createNumberTerr(element.frac, 0, element.color)
	}

	// Создаём территории
	for (let i = 0; i < 72; i++) {
		createGangZone(i);
	}

	main();
	updateTimer = setInterval(main, 10000);

	
	// Date change GangZoneMap
	createDataPicker('#timepicker-actions-exmpl', new Date(), {
		minDate: new Date("2021/07/29"),
		maxDate: new Date(),
		autoClose: true,
		toggleSelected: false,
		onSelect: dateHandling
	}, -115);

	const currectDate = new Date();
	const diff = diffDates(new Date("2021/07/29").getTime(), currectDate.getTime()); // Сколько прошло секунд с 2021/07/29
	let passedDay = Math.floor(diff / 86400); // Переводим секунды в дни
	if (passedDay > 14) {
		// Максимум 7 дней назад
		passedDay = 14;
	}

	const sevenAgoDate = new Date();
	sevenAgoDate.setDate(currectDate.getDate() - passedDay); // Дата [1-7] дней назад
	currectDate.setDate(currectDate.getDate() - 1); // Дата 1 день назад
	createDataPicker('#timepicker-charts', [sevenAgoDate, currectDate], {
		range: true,
		multipleDatesSeparator: " - ",
		minDate: new Date("2021/07/29"),
		maxDate: currectDate,
		toggleSelected: false,
		autoClose: true,
		onSelect: dateSchedule
	}, -225);

	// График гангзон
	// createSchedule();
});

let currectMap = true;
function changeMap() {
	currectMap = !currectMap;
	// gangZone.style.background = currectMap ? `url("../img/samap.png") no-repeat` : `url("../img/samapCap.png") no-repeat`;
	// gangZone.style.backgroundSize = "cover";
	gangZone.className = currectMap ? `map__image` : `map__image-cap`;
}