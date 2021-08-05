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

function getTimer(time) {
    const passedSec = new Date().getTime() / 1000 - time;
    return secondToTime(passedSec);
}

const interval = [];
function createBoardLine(id, nick, lvl, color, connectDate, afkTime) {
    const div = document.createElement('div');
        div.className = "table__body";
    table.after(div);

    const divId = document.createElement('div');
        divId.className = "table-min";
        divId.innerHTML = id;
    div.append(divId);

    const divNick = document.createElement('div');
        divNick.className = "table-b";
        divNick.innerHTML = nick;
        divNick.style.color = "#" + color;
    div.append(divNick);

    const divLvl = document.createElement('div');
        divLvl.className = "table-min";
        divLvl.innerHTML = lvl;
    div.append(divLvl);

    const divConnect = document.createElement('div');
        divConnect.className = "table-min";
        divConnect.innerHTML = connectDate == "Unknown" ? "Неизвестно" : connectDate;
    div.append(divConnect);

    const interpretation = {
        Unknown: "Неизвестно",
        notAfk: "Не афк",
        moreHour: "Больше часа"
    }
    let afkText = "";

    if (typeof(afkTime) == "number") {
        afkText = getTimer(afkTime);

        interval[interval.length++] = setInterval(function() {
            const element = document.getElementById(nick + "_timer");
            element.innerHTML = getTimer(afkTime);
        }, 950);
    } else {
        afkText = interpretation[afkTime];
    }

    const divAfk = document.createElement('div');
        divAfk.className = "table-min";
        divAfk.innerHTML = afkText;
        divAfk.id = nick + "_timer";
    div.append(divAfk);
}

function changeAllOnline(online) {
    allOnl.innerHTML = online;
}

function changeAfkOnline(online) {
    afkOnl.innerHTML = online;
}

function changeClearOnline(online) {
    clearOnl.innerHTML = online;
}

function diffDates(day_one, day_two) {
	return Math.abs(day_one - day_two) / 1000;
};

function getMoscowDate() {
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

function request() {
    (async () => {
        const url = 'https://sparebola.ru/virtualsamp/api?action=players';
        // const url = 'http://localhost:80/virtualsamp/api?action=players';

        const response = await fetch(url);
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
            const json = await response.json();

            // Удаляем все таймеры мигания терр и захвата
			for (let index = 0; index < interval.length; index++) {
				const element = interval[index];
				clearInterval(element);
			}

            // Чистим блоки игроков
			const div = document.getElementsByClassName('table__body');
            while (div[0]) {
                div[0].parentNode.removeChild(div[0]);
            }

            // Удаляем варнинг
            warning.style.display = "none";

            const playerTab = json.players;
            let afkOnl = 0;
            for (let i = 0; i < playerTab.length; i++) {
                const index = playerTab[i];
                createBoardLine(index.individualId, index.nick, index.lvl, index.color, index.connectDate, index.afkTime);

                // Устанавливаем игроков афк
                if (typeof(index.afkTime) != "number") {
                    ++afkOnl
                }
            }

            // Устанавливаем общий онлайн
            changeAllOnline(playerTab.length);

            // Устанавливаем афк онлайн
            changeAfkOnline(afkOnl);

            // Устанавливаем чистый онлайн
            changeClearOnline(playerTab.length - afkOnl);

            // Если игроки не обновлялись 3 минуты, создаём предупреждение
            const update = new Date(json.update);
            const currectTime = getMoscowDate().getTime();
	        const diff = diffDates(currectTime, update.getTime());
            if (diff > 180) {
                warning.style.display = "flex";
                const time = new Date((json.update).slice(0, -5));
                warningDate.innerHTML = getStringDateByDate(time);
            }
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    })();
};

document.addEventListener('DOMContentLoaded', () => {
    request();

    setInterval(function(){
		request();
	}, 5000);
});