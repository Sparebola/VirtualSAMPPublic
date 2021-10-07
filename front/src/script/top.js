function createDiv(tab, element) {
    let int = tab.length;
    if (int > 0) {
        for (let i = 0; i < tab.length; i++) {
            const tabi = tab[i];
            let el = document.getElementById(element);
    
            const divSub = document.createElement('div');
                divSub.className = "top-lines";
                divSub.style.color = getColorInPlace(tab.length - i - 1);
            el.prepend(divSub);
    
            const vidLines2 = document.createElement('div');
                vidLines2.innerHTML = tabi.points;
            divSub.prepend(vidLines2);
    
            const vidLines = document.createElement('div');
                vidLines.innerHTML = int + ". " + tabi.nick;
            divSub.prepend(vidLines);
            int = --int
        }
    } else {
        let el = document.getElementById(element);
    
        const divSub = document.createElement('div');
            divSub.style.display = "flex";
            divSub.style.justifyContent = "center";

            divSub.className = "top-lines";
            divSub.innerHTML = "Нет участников/информации";
        el.prepend(divSub);
    }
}

function getColorInPlace(place) {
    const colorPlace = [
        "#ffd700",
        "#c0c0c0",
        "#cd7f32"
    ];
    return colorPlace[place] || "#ffffff";
}

function getMoscowDate() {
    const offset = +3;
    return new Date( new Date().getTime() + offset * 3600 * 1000);
};

function diffDates(day_one, day_two) {
	return Math.abs(day_one - day_two) / 1000;
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
        const url = 'https://sparebola.ru/virtualsamp/api?action=top';
        // const url = 'http://localhost:80/virtualsamp/api?action=top';

        const response = await fetch(url);
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
            const json = await response.json();

            // Создаём все блоки с очками
            const tab = json.tab;
            createDiv(tab.joinz, "joinzTab")
            createDiv(tab.joinr, "joinrTab")
            createDiv(tab.paintBall, "paintballTab")
            createDiv(tab.tags, "graffTab")

            // Если не обновлялись 3 минуты, создаём предупреждение
            const update = json.update;
            const currectTime = getMoscowDate().getTime();

            for (const list in update) {
                // Если в колонке есть информация
                if (tab[list].length > 0) {
                    const updateTime = new Date(update[list]);
                    const diff = diffDates(currectTime, updateTime.getTime());
                    // console.log(diff);
                    if (diff > 180) {
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
};

request();
// setInterval(request, 3000);
