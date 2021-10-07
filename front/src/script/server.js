function testDinamic() {
	const text = '';
	return JSON.parse(text);
}

function testStatic() {
	const text = '';
	return JSON.parse(text);
}

function createChatLine(text, color) {
    const div = document.createElement('div');
    	div.className = "chat__line";
		div.style.color = "#" + color;
	chatList.append(div);

	// Ниже полный капец. Столько костылей я не ставил никогда... Я точно знаю, что можны было проще, но я хз как. Простите :с
	let i = 0;
	const colorTab = [];
	// Во всей строке меняем цвета на порядковый номер: "{FFFFFF}Test{FFFFFF}test..." -> "#1#TestTest#2#test..."
	text = text.replace(/{......}/gi, function(repl) {
		colorTab.push(repl.slice(1, -1)); // Запоминаем цвет по порядковому номеру
		return "#" + (++i) + "#";
	})

	if (i == 0) {
		// Если строка без цветных префиксов, просто создаём 1 блок чата
		div.innerHTML = text;
	} else {
		// Если в строке есть префиксы, то меняем все пробелы на коды пробела. Нужно что бы пробелы по краям не исчезали.
		text = text.replace(/\s/gi, function(repl) {
			return "&nbsp;";
		})

		// Начинаем парсить части слов, к которому был присвоен тег
		for (let index = 1; index < i + 1; index++) {
			let found = "";
			
			// Если текст == "test#1#...", то создаём начальный блок текста
			if (index == 1) {
				found = text.match(new RegExp("(.+)" + "#1#"));

				let chat = document.createElement('p');
					chat.innerHTML = found[1];
				div.append(chat);
			}

			if (index == i) {
				// Если это последний тег, который нужно обработать, то вырезаем всё после тега "...#3#test"
				found = text.match(new RegExp("#" + index + "#(.+)"));
			} else {
				// Если если начальный и конечный тег, то вырезаем текст между ними. "...#1#test#2#..."
				found = text.match(new RegExp("#" + index + "#(.+)#" + (index + 1) + "#"));
			}

			// Создаём блок вырезанного текста с цветом, который был у тега
			let chat = document.createElement('p');
				chat.style.color = "#" + colorTab[index - 1];
				chat.innerHTML = found[1];
			div.append(chat);
		}
	}
}

function diffDates(day_one, day_two) {
	return Math.abs(day_one - day_two) / 1000;
};

function getMoscowDateUpdate() {
    const offset = +3;
    return new Date( new Date().getTime() + offset * 3600 * 1000);
};

function getStringDateByDate(date) {
    const day = date.getDate();
    const mon = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    return (day < 10 ? "0" + day : day) + "." + (mon < 10 ? "0" + mon : mon) + "." + (year < 10 ? "0" + year : year) + " " + (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
}

function createKillLine(killer, killed, weapon, killerColor, killedColor) {
	const div = document.createElement('div');
		div.className = "kill-list__line";
	killList.append(div);

	const divKiller = document.createElement('p');
		divKiller.className = "line__killer";
		divKiller.innerHTML = killer;
		divKiller.style.color = "#" + killerColor
	div.append(divKiller);

	const divWeap = document.createElement('div');
		divWeap.className = "line__weapon";
		divWeap.style.background = `url(assets/img/Fists/${weapon}.png) no-repeat`;
		divWeap.style.backgroundSize = `cover`;
	div.append(divWeap);

	const divKilled = document.createElement('p');
		divKilled.className = "line__killed";
		divKilled.innerHTML = killed;
		divKilled.style.color = "#" + killedColor
	div.append(divKilled);
} 

const url = 'https://sparebola.ru/virtualsamp/api?action=server&block=';
// const url = 'http://localhost:80/virtualsamp/api?action=server&block=';

let setScroll = false;
function updateChatKillStat() {
    (async () => {
		const response = await fetch(url + "dinamic");

		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			const tab = await response.json();
			// const tab = testDinamic();

			// Чистим килл блоки
			let element = document.getElementById("killList");
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}

			// Чистим чат блоки
			element = document.getElementById("chatList");
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}

			// Выключаем варнинги
			warningChatText.innerHTML = "&nbsp;";
			warningChatDate.innerHTML = "&nbsp;";
			warningKillListText.innerHTML = "&nbsp;";
			warningKillListDate.innerHTML = "&nbsp;";
			warningChat.style.display = "none";
			warningKillList.style.display = "none";


			// Создаём чат блоки
			for (let index = 0; index < tab.chat.length; index++) {
				const element = tab.chat[index];
				createChatLine("[" + element.time + "] " + element.text, element.color);
			}


			const currectTime = getMoscowDateUpdate().getTime();
			let warningActive = false;

			// Создаём предупреждение если информация чата старая
			const updateChat = new Date(tab.update.chat);
	        let diff = diffDates(currectTime, updateChat.getTime());
            if (diff > 600) { // 10 минут
				warningActive = true;
				const time = new Date((tab.update.chat).slice(0, -5));
				warningChatText.innerHTML = "Информация не обновлялась с&nbsp;";
				warningChatDate.innerHTML = getStringDateByDate(time);
            }

			// Создаём предупреждение если информация киллстата старая
			const updatekillstat = new Date(tab.update.killstat);
	        diff = diffDates(currectTime, updatekillstat.getTime());
            if (diff > 600) { // 10 минут
				warningActive = true;
				const time = new Date((tab.update.killstat).slice(0, -5));
				warningKillListText.innerHTML = "Информация не обновлялась с&nbsp;";
				warningKillListDate.innerHTML = getStringDateByDate(time);
            }

			// Если варнинг есть на чате или на киллстате
			if (warningActive) {
				warningChat.style.display = "flex";
				warningKillList.style.display = "flex";
			}
			
			if (!setScroll) {
				// Ствим положения скролла вниз 1 раз
				const scroll =  document.getElementById("chatList");
				scroll.scrollTop = scroll.scrollHeight - scroll.clientHeight;
				setScroll = true;
			}


			// Создаём килл блоки
			for (let index = 0; index < tab.killList.length; index++) {
				const element = tab.killList[index];

				// Если иконки нет
				if (element.weapon < 0 || (element.weapon > 18 && element.weapon < 22) || element.weapon > 46) {
					element.weapon = "invalid";
				}

				createKillLine(element.killer, element.killed, element.weapon, element.killerColor, element.killedColor);
			}
        } else {
			console.log("Ошибка HTTP: " + response.status);
		}
	})();
}

function secondToTime(time) {
	if (time < 0) {
		time = time * -1;
	}
	let hour = Math.floor(time / 3600);
	let min = Math.floor((time % 3600) / 60);
	return ((hour < 10) ? "0" + hour : hour) + ":" + ((min < 10) ? "0" + min : min);
}

function getMoscowDate() {
    const offset = +3;
    return new Date( new Date().getTime() + offset * 3600 * 1000 ).toUTCString().replace(/:\d\d GMT$/, "" );
}

function getMoscowDateGG() {
	const offset = 180; // в минутах часовой пояс Москвы +3 часа = +180 минут
	const D = new Date();
	D.setMinutes( D.getMinutes() + D.getTimezoneOffset() + offset);
	return D;
}

function setStaticContent() {
	(async () => {
		const response = await fetch(url + "static");

		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			const tab = await response.json();
			// const tab = testStatic();

			// Двойная оплата:
			x2.innerHTML = tab.x2;

			// Время на сервере:
			const currectServerTime = new Date(tab.time).getTime();
			let currectTime = new Date(getMoscowDate()).getTime();
			let diff = (currectTime - currectServerTime) / 1000;

			let diffText = " (совпадает с МСК)";
			if (Math.floor(diff) != 0) {
				let mark = (diff < 0) ? "+" : "-";
				diffText = " (" + mark + secondToTime(diff) + " от МСК)";
			}
			time.innerHTML = tab.time + diffText;

			// Средний пинг на сервере:
			ping.innerHTML = tab.ping + " мс";

			// Матов на /deliver:
			deliver.innerHTML = tab.deliver;


			// Lotto
			// Cумма Джекпота
			// let money = new Intl.NumberFormat("de-DE").format(tab.lotto.enact);
			// enact.innerHTML = tab.lotto.enact == "-" ? tab.lotto.enact : money + "$";

			// Выигрышный номер
			// winningNumber.innerHTML = tab.lotto.winningNumber;

			// Выиграли
			// won.innerHTML = tab.lotto.won;

			// Новый Джекпот
			// money = new Intl.NumberFormat("de-DE").format(tab.lotto.newJackpot);
			// newJackpot.innerHTML = tab.lotto.newJackpot == "-" ? tab.lotto.newJackpot : money + "$";

			// Ставим предупреждения если информация старая
			const update = tab.update;
            currectTime = getMoscowDateUpdate().getTime();
			const diffTimeTab = {
				x2: 3690,
				time: 70,
				ping: 60,
				deliver: 1200,
				// lotto: 3630
			}

            for (const list in update) {
                // Если в колонке есть информация
				const updateTime = new Date(update[list]);
				const diff = diffDates(currectTime, updateTime.getTime());
				if (diff > diffTimeTab[list]) {

					let isCurrectWarning = true;
					// x2 только в 8 и 12 часов. Варнинг в остальное время не нужен
					if (list == "x2") {
						const hour = getMoscowDateGG().getHours();
						if (hour != 8 && hour != 12) {
							isCurrectWarning = false;
						} 
					}

					if (isCurrectWarning) {
						// Ставим видимость блоку с предупреждением
						let el = document.getElementById("warning_" + list);
						el.style.display = "flex";

						// Записываем время ласт обновления
						const time = new Date((update[list]).slice(0, -5));
						el = document.getElementById("warning_" + list + "Text");
						el.innerHTML = getStringDateByDate(time);
					}
				}
            };
        } else {
			console.log("Ошибка HTTP: " + response.status);
		}
	})();
}

document.addEventListener('DOMContentLoaded', () => {
	setStaticContent();
	// setInterval(function(){
	// 	setStaticContent();
	// }, 10000);

	updateChatKillStat();
	setInterval(function(){
		updateChatKillStat();
	}, 3000);
});