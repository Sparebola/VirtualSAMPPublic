const mysql = require('mysql2/promise');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const fs = require("fs");
const { isArray } = require('util');

const AUTH_KEY = "";
const APPLICATION_PORT = 80;

const DATABASE_OPTIONS = Object.freeze({
	host: '',
	database: '',
	user: '',
	timezone: 'Z',
	password: '',
});

const GANGZONES_COUNT = 71;
const MAX_LAST_ACTIVITY_IN_SECONDS = 180; // 3 минуты
const MILLISECONDS_IN_SECOND = 1_000;

const CHAT = [];
const MAX_CHAT_MESSAGES_COUNT = 25;

const KILLSTAT = [];
const MAX_KILLSTAT_LENGTH = 8;

const createGangZone = (id) => ({
	id,
	color1: '#ffffff',
	color2: '#ffffff',
	flash: 0,
	date: new Date().getTime(),
});

const GANGZONES = [];
for (let index = 0; index <= GANGZONES_COUNT; index++) {
	GANGZONES.push(createGangZone(index));
}

let ONLINE_PLAYERS = [];

const UPDATE_DATA = {
	players: 0,
	top: {
		joinz: 0,
		joinr: 0,
		paintBall: 0,
		tags: 0,
	},
	server: {
		chat: 0,
		killstat: 0,
		x2: 0,
		time: 0,
		ping: 0,
		deliver: 0,
		lotto: 0,
	},
	gangZone: 0,
};

const RATING_LISTS = {
	joinz: [],
	joinr: [],
	paintBall: [],
	tags: [],
};

const LAST_ACTIVITIES = {
	server: null,
	rakbot: null,
};

const SERVER_INFO = {
	deliver: '-',
	ping: '0',
	x2: 'Завершено',
	time: '2021-06-15 00:00'
};

const LOTTO = {
	winningNumber: '-',
	won: '-',
	newJackpot: '-',
	enact: '-',
};

const createLogger = (type) => (message) => {
	fs.appendFileSync('errors.log', `[${type}]: ${message}\n`);
};

const logger = Object.freeze({
	info: createLogger('info'),
	error: createLogger('error'),
});

const createDatabaseConnection = async () => {
	try {
		const connection = await mysql.createConnection(DATABASE_OPTIONS);
		// logger.info('Соединение с базой данных установлено.');
		// console.log('Соединение с базой данных установлено.');

		return connection;
	}
	catch (error) {
		logger.error('Не удалось установить соединение с базой данных.');
		logger.error(error.message);

		// process.exit(-1);
	}
};

const createSQLExecutor = (connection) => (query, params) => (
	connection.query(query, params)
		.catch((error) => {
			const text = 'Не удалось выполнить SQL запрос:';
			delete error.sqlMessage;
			error.query = query;
			const errors = JSON.stringify(error);
			console.log(text);
			logger.error(text);
			console.log(error);
			logger.error(errors);
		})
);

const validateAuthKey = (ctx, next) => {
	const key = ctx.request.body.key || ctx.request.query.key;

	if (key !== AUTH_KEY) {
		ctx.status = 404;
		ctx.body = 'У вас недостаточно прав.';

		return;
	}

	next();
};

const getMoscowTime = () => {
	const today = new Date();
	const hour = String(today.getUTCHours() + 3);
	const min = String(today.getUTCMinutes());
	const sec = String(today.getUTCSeconds());
	return (hour < 10 ? 0 + hour : hour) + ":" + (min < 10 ? 0 + min : min) + ":" + (sec < 10 ? 0 + sec : sec);
};

function getMoscowDate() {
    const offset = +3;
    return new Date( new Date().getTime() + offset * 3600 * 1000);
};

const sendSQLrequest = async (sql) => {
	const databaseConnection = await createDatabaseConnection();
	const executeSQL = createSQLExecutor(databaseConnection);
	const response = await executeSQL(sql);
	databaseConnection.end();
	return response;
}

const init = async (app, router) => {

	// localhost
	const cors = require('@koa/cors');
	app.use(cors());

	// Middlewares, устанавливаем лимиты
	app.use(koaBody({
		formLimit: "1mb"
	}));

	app.use(async (ctx, next) => {
		try {
			await next();
		}
		catch (error) {
			logger.error(error.message);
			console.log(error);

			ctx.status = 500;
			ctx.body = 'Error!';
		}
	});

	// Routes
	router.post('/', validateAuthKey, async (ctx) => {
		if (ctx.request.body) {
			if (ctx.request.body.tab && ctx.request.body.date) {
				const tab = JSON.parse(ctx.request.body.tab);

				if (typeof(tab) == "object") {
					const sql = ``;

					// Костыль. Помогите пофиксить. Ответ приходит первее чем обрабатывается запрос к БД
					ctx.status = 200;
					ctx.body = 'Done!';
					const executeResult = await sendSQLrequest(sql);
					
					if (executeResult[0].warningStatus === 0) {
						// ctx.status = 200;
						// ctx.body = 'Done!';
					}
				}
				else {
					ctx.status = 400;
					ctx.body = 'Нет body.tab!';
				}
			} 
			else {
				ctx.status = 400;
				ctx.body = 'Неверные параметры!';
			}
		} 
		else {
			ctx.status = 400;
			ctx.body = 'Нет body!';
		}
	});

	router.post('/', validateAuthKey, (ctx) => {
		if (ctx.request.body) {
			if (ctx.request.body.tab) {
				const chatLine = JSON.parse(ctx.request.body.tab);

				if (Array.isArray(chatLine)) {
					Array.prototype.push.apply(CHAT, chatLine);
					UPDATE_DATA.server.chat = getMoscowDate();

					if (CHAT.length > MAX_CHAT_MESSAGES_COUNT) {
						const offs = CHAT.length - MAX_CHAT_MESSAGES_COUNT;
						CHAT.splice(0, offs);
					}

					ctx.status = 200;
					ctx.body = 'Done!';
				}
				else {
					ctx.status = 400;
					ctx.body = 'Неверные параметры!';
				}
			} 
			else {
				ctx.status = 400;
				ctx.body = 'Нет body.tab!';
			}
		} 
		else {
			ctx.status = 400;
			ctx.body = 'Нет body!';
		}
	});

	router.post('/', validateAuthKey, (ctx) => {
		if (ctx.request.body) {
			if (ctx.request.body.tab) {
				const scoreboard = JSON.parse(ctx.request.body.tab);
			
				if (Array.isArray(scoreboard)) {
					ONLINE_PLAYERS = scoreboard;
					UPDATE_DATA.players = getMoscowDate();

					ctx.status = 200;
					ctx.body = 'Done!';
				}
				else {
					ctx.status = 400;
					ctx.body = 'Неверные параметры!';
				}
			} 
			else {
				ctx.status = 400;
				ctx.body = 'Нет body.tab!';
			}
		} 
		else {
			ctx.status = 400;
			ctx.body = 'Нет body!';
		}
	});

	router.post('/', validateAuthKey, (ctx) => {
		if (ctx.request.body.tab) {
			const gangZones = JSON.parse(ctx.request.body.tab);

			if (Array.isArray(gangZones)) {

				let noneValidID = "";
				for (const gangZone of gangZones) {
					const zone = GANGZONES.find((zone) => zone.id === Number(gangZone.gangZoneID));
	
					if (zone) {
						zone.date = gangZone.date;
						zone.color1 = gangZone.color1;
						zone.flash = 0;
					}
					else {
						noneValidID = noneValidID + Number(gangZone.gangZoneID) + ", ";
					}
				}

				ctx.status = noneValidID == "" ? 200 : 400;
				ctx.body = noneValidID == "" ? 'Done!' : "Невалидные территории: " + noneValidID;
			}
			else {
				ctx.status = 400;
				ctx.body = 'Невалидный body!';
			}
		}
		else {
			ctx.status = 400;
			ctx.body = 'Неверные параметры!';
		}
	});

	router.get('/', validateAuthKey, (ctx) => {
		const { gangZoneID, color2, flash } = ctx.request.query;

		if (gangZoneID && color2 && flash) {
			const zone = GANGZONES.find((zone) => zone.id === Number(gangZoneID));

			if (zone) {
				zone.date = new Date().getTime();
				zone.color2 = color2;
				zone.flash = Number(flash);

				ctx.status = 200;
				ctx.body = 'Done!';
			}
			else {
				ctx.status = 400;
				ctx.body = 'Невалидная территория: ' + Number(gangZoneID);
			}
		}
		else {
			ctx.status = 400;
			ctx.body = 'Неверные параметры!';
		}
	});

	router.post('/', validateAuthKey, (ctx) => {
		const ratingBodyLists = ctx.request.body;

		if (typeof(ratingBodyLists) == "object") {
			let success = false; 

			for (const list in ratingBodyLists) {
				if (Array.isArray(RATING_LISTS[list])) {
					success = true;
					const topTable = JSON.parse(ratingBodyLists[list]);
					UPDATE_DATA.top[list] = getMoscowDate();

					if (topTable.length > 0) {
						const tab = topTable.map((item) => ({
							nick: item.nick,
							points: item.points,
						}));
	
						RATING_LISTS[list] = tab.sort((p1, p2) => p1.points - p2.points);
					}
				}
			}

			ctx.status = success ? 200 : 400;
			ctx.body = success ? 'Done!' : "Error!";
		}
		else {
			ctx.status = 400;
			ctx.body = 'Неверные параметры!';
		}
	});

	router.post('/', validateAuthKey, (ctx) => {
		if (ctx.request.body.tab) {
			const killList = JSON.parse(ctx.request.body.tab);

			if (Array.isArray(killList)) {
				Array.prototype.push.apply(KILLSTAT, killList);
				UPDATE_DATA.server.killstat = getMoscowDate();

				if (KILLSTAT.length > MAX_KILLSTAT_LENGTH) {
					const offs = KILLSTAT.length - MAX_KILLSTAT_LENGTH;
					KILLSTAT.splice(0, offs);
				}

				ctx.status = 200;
				ctx.body = 'Done!';
			}
			else {
				ctx.status = 400;
				ctx.body = 'Невалидный body!';
			}
		}
		else {
			ctx.status = 400;
			ctx.body = 'Неверные параметры!';
		}
	});

	router.get('/', validateAuthKey, (ctx) => {
		const { respondServer } = ctx.request.query;

		if (typeof(respondServer) == "string") {
			const currentDate = new Date().getTime();
			LAST_ACTIVITIES.rakbot = currentDate;

			if (+respondServer) {
				LAST_ACTIVITIES.server = currentDate;
			}

			ctx.status = 200;
			ctx.body = 'Done!';
		}
		else {
			ctx.status = 400;
			ctx.body = 'Неверные параметры!';
		}
	});

	router.get('/', validateAuthKey, (ctx) => {
		const { field, param } = ctx.request.query;

		if (field && param) {
			if (SERVER_INFO[field]) {
				SERVER_INFO[field] = param;
				UPDATE_DATA.server[field] = getMoscowDate();

				ctx.status = 200;
				ctx.body = 'Done!';
			}
			else {
				ctx.status = 400;
				ctx.body = 'Невалидный field: ' + field;
			}
		}
		else {
			ctx.status = 400;
			ctx.body = 'Неверные параметры!';
		}
	});

	router.post('/', (ctx) => {
		const { action, newJackpot, won, winningNumber, enact } = ctx.request.body;

		switch (action) {
			case 'newJackpot':
				LOTTO.winningNumber = winningNumber;
				LOTTO.won = won;
				LOTTO.newJackpot = newJackpot;

				UPDATE_DATA.server.lotto = getMoscowDate();
				ctx.status = 200;
				ctx.body = 'Done!';
				break;

			case 'newLotto':
				LOTTO.enact = enact;
				LOTTO.winningNumber = '-';
				LOTTO.won = '-';
				LOTTO.newJackpot = '-';

				UPDATE_DATA.server.lotto = getMoscowDate();
				ctx.status = 200;
				ctx.body = 'Done!';
				break;

			default:
				ctx.status = 400;
				ctx.body = 'Неверные параметры!';
				break;
		}
	});

	const API_ACTIONS = Object.freeze({
		respond: (ctx) => {
			const currectTime = new Date().getTime();
			const lastRakBotActivity = (currectTime - LAST_ACTIVITIES.rakbot) / MILLISECONDS_IN_SECOND;
			const lastServerActivity = (currectTime - LAST_ACTIVITIES.server) / MILLISECONDS_IN_SECOND;

			const result = {
				respondBot: lastRakBotActivity <= MAX_LAST_ACTIVITY_IN_SECONDS,
				responseServer: lastServerActivity <= MAX_LAST_ACTIVITY_IN_SECONDS,
			};

			ctx.status = 200;
			ctx.body = result;
		},
		players: (ctx) => {
			const sortedPlayers = [...ONLINE_PLAYERS].sort((p1, p2) => p1.id - p2.id);
			const obj = {
				update: UPDATE_DATA.players,
				players: sortedPlayers.reverse()
			};

			ctx.status = 200;
			ctx.body = obj;
		},
		top: (ctx) => {
			const obj = {
				update: UPDATE_DATA.top,
				tab: RATING_LISTS
			};

			ctx.status = 200;
			ctx.body = obj;
		},
		gangzone: (ctx) => {
			ctx.status = 200;
			ctx.body = GANGZONES.map(({ id, ...rest }) => ({ ...rest, gangZoneID: id }));
		},
		gangzoneBD: async (ctx) => {
			const { minDate, maxDate } = ctx.request.query;
			if (minDate && maxDate) {
				const executeResult = await sendSQLrequest(``);

				let requestSucc = false;
				let status = 400;
				const tab = executeResult[0];
				if (tab) {
					if (Array.isArray(tab)) {
						status = 418;
						if (tab.length > 0) {
							status = 200;
							requestSucc = true;
						}
					}
				}
				
				ctx.status = status;
				ctx.body = requestSucc ? JSON.stringify(tab) : "Error!";
			}
			else {
				ctx.status = 400;
				ctx.body = "Неверные параметры!";
			}
		},
		server: async (ctx) => {
			const { block } = ctx.request.query;

			if (block === 'dinamic') {
				const obj = {
					update: {
						chat: UPDATE_DATA.server.chat,
						killstat: UPDATE_DATA.server.killstat
					},
					chat: CHAT, 
					killList: KILLSTAT
				};

				ctx.status = 200;
				ctx.body = obj;
			}
			else if (block === 'static') {
				const obj = {
					update: {
						x2: UPDATE_DATA.server.x2,
						time: UPDATE_DATA.server.time,
						ping: UPDATE_DATA.server.ping,
						deliver: UPDATE_DATA.server.deliver,
						lotto: UPDATE_DATA.server.lotto,
					},
					lotto: LOTTO, 
					ping: SERVER_INFO.ping, 
					deliver: SERVER_INFO.deliver, 
					time: SERVER_INFO.time,
					x2: SERVER_INFO.x2
				};

				ctx.status = 200;
				ctx.body = obj;
			}
			else {
				ctx.status = 400;
				ctx.body = 'Неверные параметры block!';
			}
		}
	});

	router.get('/virtualsamp/api', async (ctx) => {
		const { action } = ctx.request.query;
		const callback = API_ACTIONS[action];

		if (typeof callback === 'function') {
			await callback(ctx);
		}
		else {
			ctx.status = 400;
			ctx.body = 'Неверные параметры!';
		}
	});

	app.use(router.routes())
	app.use(router.allowedMethods());

	// Application
	app.listen(APPLICATION_PORT, () => {
		logger.info('Сервер запущен ' + getMoscowTime());
		console.log('Сервер запущен.');
	});
};

const router = new Router();
const app = new Koa();

init(app, router);
