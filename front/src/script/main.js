
(async () => {
	const url = 'https://sparebola.ru/virtualsamp/api?action=respond';
	// const url = 'http://localhost:80/virtualsamp/api?action=respond';

	let response = await fetch(url);
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = await response.json();
		
		let element = document.getElementById("responseBot");
		if (json.respondBot) {
			element.innerHTML = "Работает!";
			element.style.width = "73px";
			element.style.borderBottom = "1px solid rgb(0, 151, 63)";
		} else {
			element.innerHTML = "Отключён";
			element.style.width = "76px";
			element.style.borderBottom = "1px solid rgb(151, 0, 0)";
		}

		element = document.getElementById("responseServer");
		if (json.respondBot && !json.responseServer) {
			element.innerHTML = "Отключён";
			element.style.width = "76px";
			element.style.borderBottom = "1px solid rgb(151, 0, 0)";
		} else if (!json.respondBot && !json.respondBot) {
			element.innerHTML = "Нет данных";
			element.style.width = "89px";
			element.style.borderBottom = "1px solid rgb(151, 0, 0)";
		} else if (json.respondBot && json.responseServer) {
			element.innerHTML = "Работает!";
			element.style.width = "73px";
			element.style.borderBottom = "1px solid rgb(0, 151, 63)";
		}
	} else {
		console.log("Ошибка HTTP: " + response.status);
	}
})();