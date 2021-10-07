-- RakBot fix
dofile(getRakBotPath() .. "\\scripts\\libs\\fix.lua");

local json = require('cjson');
local copas = require('copas');
local http = require('copas.http');
local requests = require('requests');
requests.http_socket, requests.https_socket = http, http;
local encoding = require("encoding");
encoding.default = "CP1251";
local u8 = encoding.UTF8;


local IS_NOP_SERVER_MSG = false;
local IS_ANTI_AFK = false;
local IS_REQUEST_SERVER_SEND = true;
local IS_SEND_TELEGRAM = false;
local ACCES_SEND = "";


local HOST = "https://sparebola.ru/virtualsamp/set";
local AUTH_KEY = "";
local OWNER_CHAT = "";
local TELEGRAM_TOCKEN = "";
local TELEGRAM_URL = ""..TELEGRAM_TOCKEN;

-- Таймеры
local timeRespond = 0;
local timeMain = 0;
local timePlayer = 0;
local timeCheckAfk = 0;
local timeTop = 0;

local state = getBotState();
local isSpawn = state == 1 or state == 2 or state == 3;
local currectServerYear = isBotSpawned() and os.date("%Y-%m-%d", os.time(os.date("!*t")) + 10800);
local currectDeliver = -1;
local accesSend = false;
local collectionTop = false;
local collectionTopTab = {
	joinz = {},
	joinr = {},
	paintBall = {},
	tags = {};
};
local pendengTable = {
	gangZoneSendTab = {},
	chatTab = {},
	killListTab = {},
}
local playerColor = {};
local gangZoneIntTab = {};
local gangZoneActiveCapture = {};
-- Уже понял как без этого, мне лень исправлять
local convertColor = {
	[-1433108731] = "#057F94", -- ЛКН
	[-1435370502] = "#FAFB71", -- Яки
	[-1432778633] = "#778899", -- РМ
	[-1428738934] = "#8A2CD7", -- Баллас
	[-1440688129] = "#FFD720", -- Вагос
	[-1426401009] = "#0FD9FA", -- Коронос
	[-1440097264] = "#10DC29", -- Грув
	[-1427270300] = "#6495ED", -- Стриты
	[-1431448544] = "#20D4AD", -- Рифа
	[-1429461766] = "#FA24CC", -- ТТМ
	[-1437773200] = "#70524D", -- Байкеры
	[-1435614388] = "#4C436E", -- БК
}
local lottoWinningNumber = 0;
local lottoWonNick = "";
local connectPlayerTime = {};
local afkPlayerTab = {};
local iterationsConnectPlayers = 0;
local gangZoneTab = {};
local currectServerTime
local nopSendChatCommand
local slapState = 0

-- Config Telegram --
function onDirectoryCreated(path)
	local function file_exists(file)
		local f=io.open(file,"r")
		   if f~=nil then io.close(f) return true else return false end
	end
	-- Мне лень делать что-то более
	if not file_exists(path) then
		setIniString(path, "config", "telegramLastMessageID", "-1");
		setIniString(path, "config", "telegramLastRoom", "-1");
		setIniString(path, "config", "sendError", "1");
	end
end

function isServerGalaxy()
    local galaxyIpTab = {
        ["176.32.39.200:7777"] = 1,
        ["176.32.39.199:7777"] = 2,
        ["176.32.39.198:7777"] = 3
    }
    return galaxyIpTab[getServerAddress()]
end

local INI_PATH = getRakBotPath().."\\scripts\\config\\VirtialSAMP.ini";
onDirectoryCreated(INI_PATH);
local telegramLastMessageID = getIniString(INI_PATH, "config", "telegramLastMessageID");
local telegramLastRoom = getIniString(INI_PATH, "config", "telegramLastRoom");
local telegramSendError = getIniString(INI_PATH, "config", "telegramLastRoom");

function getPlayerColor(playerId)
	return playerColor[playerId];
end

function convectFractions(frac)
	local tab = {
		["Yakuza"] = "Yakuza",
		["LCN"] = "La Cosa Nostra",
		["Russian Mafia"] = "Russian Mafia",
		["Vagos"] = "Los Santos Vagos",
		["Ballas"] = "The Ballas Gang",
		["Grove Street"] = "The Grove Street",
		["El Coronos"] = "El Coronos",
		["Street Racers"] = "Street Racers",
		["San Fierro Rifa"] = "San Fierro Rifa",
		["The Triads Mafia"] = "The Triads Mafia",
		["Hell Angels"] = "Hell Angels",
		["Black Kings"] = "Black Kings"
	};
	return tab[frac] or "N/A";
end

function gangZoneSaveTab(textDrawId, textDrawString)
	if textDrawId == 0 then
		local hour, min = textDrawString:match("%~w%~(%d+)%~y%~:%~w%~(%d+)");
		if hour and min then
			if min == "20" then
				local dayOfWeek = os.date("%A", os.time(os.date("!*t")) + 10800);
				local strHour = "00";
				if dayOfWeek == "Thursday" then
					strHour = "22";
				-- elseif strHour == "Sunday" then
				-- 	strHour = "00";
				end
				if hour == strHour then
					sendGangZoneSaveTab();
				end
			end
		end
	end
end

function sendGangZoneSaveTab()
	local i = 0;
	for k, v in pairs(gangZoneTab) do
		i = i + 1;
	end
	if i > 0 then
		loggerHttpRequest(HOST .. "/gangZoneSave", {
			method = "POST",
			headers = {
				["Accept"] = "*/*",
				["Content-Type"] = "application/x-www-form-urlencoded"
			},
			body = {
				tab = json.encode(gangZoneTab),
				date = os.date("%Y-%m-%d", os.time(os.date("!*t")) + 10800 - 86400), -- МСК дата вчера
				key = AUTH_KEY
			}
		});
	else
		local date = os.date("%d.%m.%Y %H:%M:%S", os.time(os.date("!*t")) + 10800);
		local text = [[ 
(%s МСК)
error: Ошибка внесения в БД гангзон.
param:
%s
 ]]
		local log = (text):format(date, dump_table(gangZoneTab));
		print("Ошибка внесения в БД гангзон. Пустая таблица, "..date);

		local path = getRakBotPath() .. "\\scripts\\VirtualSAMP.log";
		local file = io.open(path, "a");
		if file then
			file:write(log);
			file:close();
		end

		-- if telegramSendError == "1" then
			sendTelegramMessage(telegramLastRoom, "Ошибка внесения в БД гангзон. Пустая таблица, "..date);
		-- end
	end
end

function getAveragePing()
	local totalPing = 0;
	local playerCount = 0;
	
	for i = 0, 1000 do
		local playerInfo = getPlayer(i);
		if playerInfo then
			playerCount = playerCount + 1;
			totalPing = totalPing + playerInfo.ping;
		end
	end

	if playerCount > 0 then
		return math.floor(totalPing / playerCount);
	end
end

function getTopTab()
	collectionTopTab = {
		joinz = {},
		joinr = {},
		paintBall = {},
		tags = {};
	}
	local commandTab = {
		"/kpk",
		"/kpk",
		"/pbtop",
		"/tags"
	}
	collectionTop = true;
	collectionTopFlud = false;

	local i = 1;
	while true do Tasking.wait(0)
		if not nopSendChatCommand then
			collectionTopFlud = false;
			collectionTopTitle = i;

			sendInput(commandTab[i]);
			Tasking.wait(2000);

			if collectionTopFlud then
				Tasking.wait(2000);
			else
				i = i + 1; 
			end
			if i > #commandTab then break end
		end
	end

	collectionTop = false;
	return collectionTopTab;
end

function sendPendingGangzoneTwoPackage(wGangZoneID)
	if not gangZoneIntTab[wGangZoneID] then
		gangZoneIntTab[wGangZoneID] = 1;

		-- Ждём возможный 2 пакет
		Tasking.new(function()
			Tasking.wait(500);

			if gangZoneIntTab[wGangZoneID] == 1 then -- Если пакет пришел 1 раз (территорию не захватили)

				loggerHttpRequest(HOST .. "/gangzoneFlash", {
					query = {
						gangZoneID = wGangZoneID,
						color2 = "#FFFFFF",
						flash = 0,
						key = AUTH_KEY;
					}
				});
			end
			gangZoneIntTab[wGangZoneID] = nil;
		end)
	else
		-- Пакет пришел 2 раз
		gangZoneIntTab[wGangZoneID] = 2;
	end
end

function convertIntToHex(color)
	local hexa = bit.tohex(color);
	return hexRemoveClarity(hexa);
end

function getAfkTimer(id)
	if afkPlayerTab[id] then
		return (afkPlayerTab[id].afk) and afkPlayerTab[id].time or "notAfk";
	end 
end

function getConnectPlayers()
	local connectPlayer = {};
	local myID = getBotId();

	for i = 0, 1000 do
		local nick, lvl, lconnectDate;

		if i == myID then
			nick = getNickName();
			lvl = getScore();
			lconnectDate = connectDate;
		else
			local playerInfo = getPlayer(i);
			if playerInfo then
				nick = playerInfo.name;
				lvl = playerInfo.score;
				lconnectDate = connectPlayerTime[i];
			end
		end

		if nick and lvl then
			local color = getPlayerColor(i) or -255;
			local getAfkTimer = getAfkTimer(i);

			connectPlayer[#connectPlayer + 1] = {
				nick = nick,
				lvl = lvl,
				individualId = i,
				color = convertIntToHex(color),
				connectDate = lconnectDate or "Unknown",
				afkTime = getAfkTimer or "Unknown"
			}
		end
	end

	return #connectPlayer > 0, connectPlayer;
end

function sendPendingCollection(rout, strKey, time)
	local tab = pendengTable[strKey];
	if #tab == 1 then
		Tasking.new(function()
			Tasking.wait(time);

			loggerHttpRequest(HOST .. rout, {
				method = "POST",
				headers = {
					["Accept"] = "*/*",
					["Content-Type"] = "application/x-www-form-urlencoded";
				},
				body = {
					tab = json.encode(tab),
					key = AUTH_KEY;
				}
			});

			pendengTable[strKey] = {};
		end)
	end
end

function firstToUpper(str)
    function upper(s)
		local str=""
		for i=1,string.len(s) do
			local byte=string.byte(s,i)
			local char=string.char(byte)
			if(byte>= 97)and(byte<=122)then char=string.char(byte-32) end -- Латинские буквы
			if(byte>=224)and(byte<=255)then char=string.char(byte-32) end -- Русские буквы
			if(byte==184)              then char=string.char(byte-16) end -- Русская ё
			str=str..char
		end
		return str
    end
    
	local first = str:sub(1, 1)
	local string = str:sub(2)
    return upper(first) .. string
end

function loggerHttpRequest(url, options)
	Tasking.new(function()
		local response, code, headers, status = wrapperHttpRequest(url, options);
		if response ~= "Done!" then
			local path = getRakBotPath() .. "\\scripts\\VirtualSAMP.log";
			local file = io.open(path, "a");
			if file then
				local date = os.date("%d.%m.%Y %H:%M:%S", os.time(os.date("!*t")) + 10800);
				local text = [[ 
(%s МСК)
error: Отправляемый запрос не достиг сервера.
url: %s.
code: %s.
method: %s.
param:
%s
response:
%s
 ]]
				local log = (text):format(date, url, code, (options.method or "GET"), dump_table(options.body or options.query), response);
				print("[Новый лог]: " .. url);
				file:write(log);
				file:close();

				-- if telegramSendError == "1" then
					local text = [[ 
(%s МСК)
error: Отправляемый запрос не достиг сервера.
url: %s.
code: %s.
method: %s.
response:
%s]]
					local log = (text):format(date, url, code, (options.method or "GET"), response);
					sendTelegramMessage(telegramLastRoom, log);
				-- end
			end
		end
	end);
end


-- loggerHttpRequest("http://localhost:3000/Virtual", {
-- 	method = "POST",
-- 	headers = {
-- 		["Accept"] = "*/*",
-- 		["Content-Type"] = "application/x-www-form-urlencoded"
-- 	},
-- 	body = {
-- 		FYP = "loh",
-- 	}
-- })
-- loggerHttpRequest("http://localhost:3000/Virtual", { 
-- 	query = { 
-- 		key = "key" 
-- 	}
-- })
function httpRequest(method, request, args) -- lua-requests
    -- start polling task
    if not copas.running then
        copas.running = true
        Tasking.new(function()
            Tasking.wait(0)
            while not copas.finished() do
                local ok, err = copas.step(0)
                if ok == nil then error(err) end
                Tasking.wait(0)
            end
            copas.running = false
        end)
    end
    -- do request
	local results
	local thread = copas.addthread(function(m, r, a)
		copas.setErrorHandler(function(err) results = {nil, err} end)
		results = table.pack(requests.request(m, r, a))
	end, method, request, args)
	while coroutine.status(thread) ~= 'dead' do Tasking.wait(0) end
	return table.unpack(results)
end

function wrapperHttpRequest(url, options)
	local options = options or {};
	
	local method = options.method or "GET";
	local url = (method == "GET") and url .. "?" .. http_build_query(options.query) or url;
	local body = (options.body) and http_build_query(options.body) or nil;
	local headers = options.headers or {["Content-Type"] = "application/x-www-form-urlencoded"};

	local data = {
		url = url,
		data = body,
		headers = headers
	};

	local response, err = httpRequest(method, data);
	if err then
		return nil, nil, nil, err;
	else
		return u8:decode(response.text or ""), response.status_code, response.headers, response.status;
	end
end

function http_build_query(query)
	local buff = "";
	if type(query) == "table" then
		for k, v in pairs(query) do
			buff = buff .. string.format("%s=%s&", k, url_encode(u8:encode(tostring(v))));
		end
		buff = string.reverse(string.gsub(string.reverse(buff), "&", "", 1));
	end
	return buff;
end

function url_encode(str)
	local str = string.gsub(str, "\\", "\\");
	str = string.gsub(str, "([^%w])", function(text)
		return string.format("%%%02X", string.byte(text));
	end)
	return str;
end

function dump_table(o)
	if o then
		if type(o) == 'table' then
			local s = '{';
			local i = 1
			for k,v in pairs(o) do
				if type(k) ~= 'number' then k = '"'..k..'"' end
				if i > 1 then s = s .. ',' end
				s = s .. '['..k..'] = ' .. dump(v);
				i = i + 1
			end
			return s .. '}';
		else
			return tostring(o);
		end
	else
		return "NULL";
	end
end

function getCurrectDate(textDrawId, textDrawString)
	if textDrawId == 0 then
		local hour, min = textDrawString:match("%~w%~(%d+)%~y%~:%~w%~(%d+)");
		if hour and min then
			local time = hour .. ":" .. min;
			currectServerTime = {hour = tonumber(hour), min = tonumber(min)}

			if currectServerYear ~= -1 then
				local date = ("%s %s"):format(currectServerYear, time);
				loggerHttpRequest(HOST .. "/serverTab", {
					query = {
						param = date,
						field = "time",
						key = AUTH_KEY;
					}
				});
			end
		end

	elseif textDrawId == 1 then
		local day, month, year = textDrawString:match("%~w%~galaxy%-rpg%..+%~n%~(%d+)%.(%d+)%.(%d+)");
		if day and month and year then
			currectServerYear = ("%s-%s-%s"):format(year, month, day);
		end
	end
end

function sendSlapSync(x, y, z, x2, y2, z2)
    -- https://www.blast.hk/threads/27939/
    local speedv = -0.1
    local b = 0
    Tasking.new(function()
        while slapState ~= 0 do
            if slapState == 1 then
                if z2 ~= z then
                    if z2 >= z then z = z2 end
                    z = z + speedv
                    local spz = speedv / 3
                    setSpeed(0, 0, spz)
                    setPosition(x, y, z)
                    speedv = speedv - 0.8
                    if speedv < - 0.8 then
                        speedv = -0.8
                    end
                    sendSync()
                    if z2 >= z then
                        b = y2 + 1
                        speedv = -0.1
                        setPosition(x2, y2, z2)
                        sendSync()
                        slapState = 2
                    end
                end
            end
            if slapState == 2 then
                if y2 <= b then
                    y2 = y2 + 0.2
                    setSpeed(0, 0, 0.05)
                    setPosition(x2, y2, z2)
                    sendSync()
                else
                    slapState = 0
                end
            end
            Tasking.wait(100);
        end
    end)
end

function hexRemoveClarity(hex)
	return hex:sub(0, 6);
end

function notCrashRecconect()
		-- ID_DISCONNECTION_NOTIFICATION - ID: 32
		-- Parameters: UINT8 Packet_ID
		local bs = bitStreamNew();
		bitStreamWriteByte(bs, 32)
		sendPacket(bs);
		bitStreamDelete(bs);
end

-- Telegram
function getLastTelegramMesage()
	local response, code, headers, status = wrapperHttpRequest(TELEGRAM_URL .. "/getUpdates", { 
		query = { 
			offset = -1 
		}
	})

	if code == 200 and #response > 0 then
		local tab = json.decode(response);
		if tab then
			if tab.ok then
				local res_tab = tab.result[1];
				if res_tab then
					local currect_message_id = tostring(res_tab.update_id);

					if telegramLastMessageID ~= currect_message_id then
						telegramLastMessageID = currect_message_id;
						setIniString(INI_PATH, "config", "telegramLastMessageID", tostring(telegramLastMessageID))
						return res_tab;
					end
				end
			end
		end
	end
	return false;
end

-- function whileGetLastTelegramMesage()
-- 	while true do Tasking.wait(0)
-- 		if telegramLastMessageID and accesSend and IS_SEND_TELEGRAM then
-- 			local response = getLastTelegramMesage()
-- 			if response then	
-- 				telegramMessageHandler(response.message.text, response.message)
-- 			end
-- 			Tasking.wait(10000)
-- 		end
-- 	end
-- end
-- Tasking.new(whileGetLastTelegramMesage);

function telegramMessageHandler(text, table)
	if text:find("/newroom") then
		local key = text:match("/newroom (.+)");
		if key == AUTH_KEY then
			if telegramLastRoom ~= tostring(table.chat.id) then
				sendTelegramMessage(telegramLastRoom, "Я больше тебя не слушаю!");

				telegramLastRoom = tostring(table.chat.id);
				setIniString(INI_PATH, "config", "telegramLastRoom", telegramLastRoom);

				sendTelegramMessage(telegramLastRoom, "Ты мой новый слушатель!");
			else
				sendTelegramMessage(telegramLastRoom, "Я и так тебя прекрасно слушал!");
			end
		else
			sendTelegramMessage(table.chat.id, "Неверный ключ!");
		end
		return true;
	elseif text == "/help" then
		local text = [[
"/newroom [key]" - Указать боту в какой чат начать отправлять сообщения.
"/send" [msg] - Сказать что-то в чат.
"/getinfo" - Получить информацию о боте.
"/setafk" - Вкл/выкл анти-афк
"/senderr" - Вкл/выкл отправку ошибок.
		]]
		sendTelegramMessage(telegramLastRoom, text);
	end

	if telegramLastRoom == tostring(table.chat.id) then
		if text == "/senderr" then
			telegramSendError = (telegramSendError == "1" and "0" or "1");
			local send = telegramSendError == "1" and "Теперь я буду отсылать ошибки." or "Больше не буду отсылать ошибки.";
			setIniString(INI_PATH, "config", "sendError", telegramSendError);

			sendTelegramMessage(telegramLastRoom, send);
		elseif text:find("/send") then
			local msg = text:match("/send (.+)");
			if msg then
				-- local block = {
				-- 	["/pm"] = 1,
				-- 	["/o"] = 1,
				-- 	["/report"] = 1,
				-- 	["/n"] = 1,
				-- 	["/s"] = 1,
				-- 	["/c"] = 1
				-- }
				-- local command = msg:match("(/%a+)%s");
				-- if not block[command] then
					sendInput(msg);
					sendTelegramMessage(telegramLastRoom, "Сообщение: " .. msg .. ". Отправлено!");
				-- else
				-- 	sendTelegramMessage(telegramLastRoom, "Я перестаю тебя слушать!");
				-- 	telegramLastRoom = OWNER_CHAT;
				-- 	setIniString(INI_PATH, "config", "telegramLastRoom", tostring(telegramLastRoom));
				-- 	sendTelegramMessage(telegramLastRoom, "Мне писали гадости, я пришел домой!");
				-- end
			else
				sendTelegramMessage(telegramLastRoom, "Введите сообщение!");
			end
		elseif text == "/getinfo" then
			local text = [[
Ник: %s,
Здоровье: %s,
Статус: %s,
Подключён: %s,
Заспавнен: %s,
Отправка: %s,
АФК: %s
			]]
			local status = {
				[0] = "Подключение",
				[1] = "Пешеход",
				[2] = "Водитель",
				[3] = "Пассажир",
				[4] = "Наблюдатель",
				[5] = "Садится в машину";
			}
			local stat = status[getBotState()] or getBotState();
			local connect = isBotConnected() and "Да" or "Нет";
			local spawn = isBotSpawned() and "Да" or "Нет";
			local afk = not IS_ANTI_AFK and "Да" or "Нет";
			local grant = IS_REQUEST_SERVER_SEND and "Включена" or "Выключена";
			sendTelegramMessage(telegramLastRoom, text:format(getNickName(), getHealth(), stat, connect, spawn, grant, afk));
		elseif text == "/setafk" then
			IS_ANTI_AFK = not IS_ANTI_AFK
			local afk = not IS_ANTI_AFK and "Теперь афк" or "Больше не афк";
			sendTelegramMessage(telegramLastRoom, afk);
		else
			sendTelegramMessage(table.chat.id, "Такой команды нет!");
		end
	else
		sendTelegramMessage(table.chat.id, "Кто ты? Я тебя не слушаю!");
	end
end

function sendTelegramMessage(id, text)
	if id and IS_REQUEST_SERVER_SEND and accesSend and IS_SEND_TELEGRAM then
		local currectWarning = true;

		if currectServerTime then
			if currectServerTime.min >= 0 and currectServerTime.min <= 20 and currectServerTime.hour == 6 then
				currectWarning = false;
			end
		end

		if currectWarning then
			Tasking.new(function()
				wrapperHttpRequest(TELEGRAM_URL .. "/sendMessage", { 
					query = { 
						chat_id = id,
						text = text;
					}
				});
			end)
		end
	end
end
-- Telegram -- 

-- events
function _onScriptUpdate() -- main loop -- _onScriptUpdate called on fix.lua
	if isSpawn then
		local state = getBotState();
		if state ~= 1 and state ~= 2 and state ~= 3 then
			isSpawn = false;
			print("Больше не заспавнен")
		end
	end

	accesSend = getNickName() == ACCES_SEND and isServerGalaxy();
	
	if IS_REQUEST_SERVER_SEND and accesSend then

		-- Каждую секунду пробиваем афк игроков
		if not collectionTop and not nopSendChatCommand then
			if os.time() - timeCheckAfk >= 1 and os.clock() > 15 then
				local playerInfo = getPlayer(iterationsConnectPlayers);
				if playerInfo then
					timeCheckAfk = os.time();
					sendInput("/id " .. iterationsConnectPlayers);
				end

				iterationsConnectPlayers = iterationsConnectPlayers + 1;
				if iterationsConnectPlayers > 1000 then iterationsConnectPlayers = 0 end
			end
		end

		-- Каждую 50 мек отправляем состояние бота и сервера
		if os.time() - timeRespond >= 50 and os.clock() > 30 then
			timeRespond = os.time();

			-- RespondBot
			loggerHttpRequest(HOST .. "/respond", {
				query = {
					respondServer = isBotConnected() and "1" or "0",
					key = AUTH_KEY;
				}
			});
		end

		if isSpawn and os.clock() > 20 then
			-- Каждую минуту чекаем игроков
			if os.time() - timePlayer >= 60 then
				local bool, connectPlayer = getConnectPlayers();

				if bool then
					timePlayer = os.time();
					loggerHttpRequest(HOST .. "/players", {
						method = "POST",
						headers = {
							["Accept"] = "*/*",
							["Content-Type"] = "application/x-www-form-urlencoded";
						},
						body = {
							tab = json.encode(connectPlayer),
							key = AUTH_KEY;
						}
					});
				end
			end

			-- Каждые 2 минуты чекаем топ
			if os.time() - timeTop >= 120 then
				Tasking.new(function()
					timeTop = os.time();
					local tab = getTopTab();

					loggerHttpRequest(HOST .. "/top", {
						method = "POST",
						headers = {
							["Accept"] = "*/*",
							["Content-Type"] = "application/x-www-form-urlencoded";
						},
						body = {
							joinz = json.encode(tab.joinz),
							joinr = json.encode(tab.joinr),
							paintBall = json.encode(tab.paintBall),
							tags = json.encode(tab.tags),
							key = AUTH_KEY;
						}
					});
				end)
			end

			-- Каждые 45 секунд отправляем деливер и пинг
			if os.time() - timeMain > 40 then
				timeMain = os.time();

				-- Deliver
				if currectDeliver ~= -1 then
					loggerHttpRequest(HOST .. "/serverTab", {
						query = {
							param = currectDeliver,
							field = "deliver",
							key = AUTH_KEY;
						}
					});
				end

				-- Ping
				local averagePing = getAveragePing();
				if averagePing then
					loggerHttpRequest(HOST .. "/serverTab", {
						query = {
							param = averagePing,
							field = "ping",
							key = AUTH_KEY;
						}
					});
				end
			end
		end
	end
end

function onRecvRpc(id, data, size)
	if id == 72 then -- SetPlayerColor
		-- UINT16 wPlayerID, 
		-- UINT32 dColor
		local bs = bitStreamInit(data, size);
		local pId = bitStreamReadWord(bs);
		local color = bitStreamReadDWord(bs);
		bitStreamDelete(bs);
		playerColor[pId] = color;
	end

	if IS_REQUEST_SERVER_SEND and accesSend then
		--[[
			Захват начинается:
				GangZoneFlash передает цвет "Кто захватывает"
			Захват кончился "территорию не захватили":
				GangZoneStopFlash
			Захват кончился "территорию захватили":
				GangZoneStopFlash
				AddGangZone
		]]
		
		if id == 121 then -- GangZoneFlash (начинается захват)
			-- UINT16 wGangZoneID, 
			-- UINT32 color

			local bs = bitStreamInit(data, size);
			local wGangZoneID = bitStreamReadWord(bs);
			local color = bitStreamReadDWord(bs);
			bitStreamDelete(bs);

			gangZoneActiveCapture[wGangZoneID] = true;
			loggerHttpRequest(HOST .. "/gangzoneFlash", {
				query = {
					gangZoneID = wGangZoneID,
					color2 = convertColor[color],
					flash = 1,
					key = AUTH_KEY;
				}
			});

		elseif id == 85 then -- GangZoneStopFlash
			-- UINT16 wGangZoneID

			local bs = bitStreamInit(data, size);
			local wGangZoneID = bitStreamReadWord(bs);
			bitStreamDelete(bs);

			if gangZoneActiveCapture[wGangZoneID] then
				gangZoneActiveCapture[wGangZoneID] = nil;
				sendPendingGangzoneTwoPackage(wGangZoneID);
			end

		elseif id == 108 then -- AddGangZone
			--[[
				UINT16 wGangZoneID, 
				float min_x, 
				float min_y, 
				float max_x, 
				float max_y, 
				UINT32 color
			]]
			local bs = bitStreamInit(data, size);
			local wGangZoneID = bitStreamReadWord(bs);
			bitStreamSetReadOffset(bs, 18);
			local color = bitStreamReadDWord(bs);
			bitStreamDelete(bs);

			gangZoneActiveCapture[wGangZoneID] = nil;

			local fracColor = convertColor[color];
			local fracColorToFrac = {
				["#057F94"] = "La Cosa Nostra",
				["#8A2CD7"] = "The Ballas Gang",
				["#FAFB71"] = "Yakuza",
				["#20D4AD"] = "San Fierro Rifa",
				["#4C436E"] = "Black Kings",
				["#FA24CC"] = "The Triads Mafia",
				["#70524D"] = "Hell Angels",
				["#0FD9FA"] = "El Coronos",
				["#6495ED"] = "Street Racers",
				["#FFD720"] = "Los Santos Vagos",
				["#778899"] = "Russian Mafia",
				["#10DC29"] = "The Grove Street",
			};
			gangZoneTab[wGangZoneID] = fracColorToFrac[fracColor];

			pendengTable.gangZoneSendTab[#pendengTable.gangZoneSendTab + 1] = {
				gangZoneID = wGangZoneID,
				color1 = convertColor[color];
			}

			sendPendingCollection("/gangzoneAdd", "gangZoneSendTab", 1000);

		elseif id == 93 then -- SendClientMessage
			--[[
				UINT32 d[Color,
				UINT32 dMessageLength,
				char[] Message]
			]]

			--[[
				7993002    Событие "Лёгкие деньги": Двойная оплата труда фермерам и сантехникам в течение часа.
				Событие "Лёгкие деньги" завершено!

				-169954390    Лотерея: Через 2 минуты начинаем розыгрыш, набери '/lotto [номер (1 - 80)]'. Разыгрывается $130322.

				-169954390    Лотерея: Сегодня выигрышный номер 73.
				-169954390    Лотерея: Победителей нет. ДжекПот поднят до $137924.

				-169954390    Лотерея: na.volne выиграл ДжекПот $43267.
				-169954390    Лотерея: Назначен новый ДжекПот: $34226.
			]]

			local bs = bitStreamInit(data, size);
			local color = bitStreamReadDWord(bs);
			local messageLength = bitStreamReadDWord(bs);
			local message = bitStreamReadString(bs, messageLength);
			bitStreamDelete(bs);

			if message:find("Событие \"Лёгкие деньги\": Двойная оплата труда .+ в течение часа%.") then
				local job = message:match("Событие \"Лёгкие деньги\": Двойная оплата труда (.+) в течение часа%.");

				loggerHttpRequest(HOST .. "/serverTab", {
					query = {
						param = firstToUpper(job),
						field = "x2",
						key = AUTH_KEY;
					}
				});

			elseif message:find("Событие \"Лёгкие деньги\" завершено%!") then
				loggerHttpRequest(HOST .. "/serverTab", {
					query = {
						param = "Завершено",
						field = "x2",
						key = AUTH_KEY;
					}
				});

			-- elseif message:find("Лотерея: Через 2 минуты начинаем розыгрыш%, набери %'%/lotto %[номер %(1 %- 80%)%]%'%. Разыгрывается %$%d+%.") then
			-- 	local enact = message:match("Лотерея: Через 2 минуты начинаем розыгрыш%, набери %'%/lotto %[номер %(1 %- 80%)%]%'%. Разыгрывается %$(%d+)%.");

			-- 	loggerHttpRequest(HOST .. "/lotto", {
			-- 		method = "POST",
			-- 		headers = {
			-- 			["Accept"] = "*/*",
			-- 			["Content-Type"] = "application/x-www-form-urlencoded";
			-- 		},
			-- 		body = {
			-- 			enact = enact,
			-- 			action = "newLotto",
			-- 			key = AUTH_KEY;
			-- 		}
			-- 	});

			-- elseif message:find("Лотерея: Сегодня выигрышный номер %d+%.") then
			-- 	lottoWinningNumber = message:match("Лотерея: Сегодня выигрышный номер (%d+)%.");
			-- 	lottoWonNick = "";

			-- elseif message:find("Лотерея: .+ выигра[л|ла]+ ДжекПот %$%d+%.") then
			-- 	local nick = message:match("Лотерея: (.+) выигра[л|ла]+ ДжекПот %$(%d+)%.");
			-- 	if lottoWonNick ~= "" then lottoWonNick = lottoWonNick .. ", " end
			-- 	lottoWonNick = lottoWonNick .. nick;

			-- elseif message:find("Лотерея: Назначен новый ДжекПот: %$%d+%.") then
			-- 	local newJackpot = message:match("Лотерея: Назначен новый ДжекПот: %$(%d+)%.");

			-- 	loggerHttpRequest(HOST .. "/lotto", {
			-- 		method = "POST",
			-- 		headers = {
			-- 			["Accept"] = "*/*",
			-- 			["Content-Type"] = "application/x-www-form-urlencoded";
			-- 		},
			-- 		body = {
			-- 			newJackpot = newJackpot,
			-- 			winningNumber = lottoWinningNumber,
			-- 			won = lottoWonNick,
			-- 			action = "newJackpot",
			-- 			key = AUTH_KEY;
			-- 		}
			-- 	});

			-- elseif message:find("Лотерея: Победителей нет%. ДжекПот поднят до %$%d+%.") then
			-- 	local newJackpot = message:match("Лотерея: Победителей нет%. ДжекПот поднят до %$(%d+)%.");

			-- 	loggerHttpRequest(HOST .. "/lotto", {
			-- 		method = "POST",
			-- 		headers = {
			-- 			["Accept"] = "*/*",
			-- 			["Content-Type"] = "application/x-www-form-urlencoded";
			-- 		},
			-- 		body = {
			-- 			newJackpot = newJackpot,
			-- 			winningNumber = lottoWinningNumber,
			-- 			won = "Победителей нет",
			-- 			action = "newJackpot",
			-- 			key = AUTH_KEY;
			-- 		}
			-- 	});

			elseif message:find("ID %d+ %- .+ %| Уровень %- %d+") then
				local id = tonumber(message:match("ID (%d+) %- .+ %| Уровень %- %d+"));
				local afk = message:find("ID %d+ %- .+ %| Уровень %- %d+ %| AFK");
				local min, sec = message:match("ID %d+ %- .+ %| Уровень %- %d+ %| AFK (%d+):(%d+)");

				local afkTime = "Unknown";
				if afk then
					if min and sec then
						afkTime = os.time() - (tonumber(min) * 60 + tonumber(sec));
					else
						if afkPlayerTab[id] then
							if afkPlayerTab[id].time ~= -1 then
								afkTime = afkPlayerTab[id].time;
							end
						else
							afkTime = "moreHour";
						end
					end
				end

				afkPlayerTab[id] = {
					afk = afk,
					time = afkTime
				};
				-- return true;

			elseif message:find("Анти%-флуд %(%d+ сек%.%)%.") then
				iterationsConnectPlayers = iterationsConnectPlayers - 1;
				if collectionTop then collectionTopFlud = true end
				-- return true;

			elseif message:find("Ты кикну[т|та]+.+Модератором .+ %(.+%)%.") then
				sendTelegramMessage(telegramLastRoom, message);
				print("Меня кикнули с сервера! Отключаюсь!");
				Tasking.new(function()
					Tasking.wait(2000);
					exit();
				end)
				return true;

			elseif message:find("Ты бы[л|ла]+ кикну[т|та]+ из .+ лидером .+ %(.+%)%.") then
				local nick = message:match("Ты бы[л|ла]+ кикну[т|та]+ из .+ лидером (.+) %(.+%)%.")
				sendTelegramMessage(telegramLastRoom, message);
				Tasking.new(function()
					nopSendChatCommand = true;
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " Привет. Я использую этот аккаунт для сбора информации,");
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " для сайта. Поэтому стою 24/7 афк. Не мог бы ты принять");
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " обратно? Или сообщить что меня кикнули Sparebola#4145");
					nopSendChatCommand = false;
				end)
				return false;

			elseif message:find("Ты получи[л|ла]+ выговор от .+%. Причина: .+") then
				local nick = message:match("Ты получи[л|ла]+ выговор от (.+)%. Причина: .+")
				sendTelegramMessage(telegramLastRoom, message);
				Tasking.new(function()
					nopSendChatCommand = true;
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " Привет. Я использую этот аккаунт для сбора информации,");
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " для сайта. Поэтому стою 24/7 афк. Не мог бы ты снять");
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " выговор или принять обратно?");
					nopSendChatCommand = false;
				end)
				return false;

			elseif message:find(".+ сня[л|ла]+ тебе один выговор%. Причина: .+") then
				local nick = message:match("(.+) сня[л|ла]+ тебе один выговор%. Причина: .+");
				sendTelegramMessage(telegramLastRoom, message);
				Tasking.new(function()
					nopSendChatCommand = true;
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " Большое спасибо!");
					nopSendChatCommand = false;
				end)
				return false;

			elseif message:find(".+ предложи[л|ла]+ вступить тебе в .+ %(%/accept team%)%.") then
				local nick, frac = message:match("(.+) предложи[л|ла]+ вступить тебе в (.+) %(%/accept team%)%.")
				sendTelegramMessage(telegramLastRoom, nick .. " предложил вступить тебе в "..frac);
				Tasking.new(function()
					IS_ANTI_AFK = true;
					nopSendChatCommand = true;
					Tasking.wait(4500);
					sendInput("/accept team");
					Tasking.wait(4500);
					sendInput("/pm " .. nick .. " Большое спасибо!");
					Tasking.wait(4500);
					sendInput("/spawnchange");
					Tasking.wait(4500);
					sendSpawn();
					Tasking.wait(2000);
					IS_ANTI_AFK = false;
					nopSendChatCommand = false;
				end)
				return false;
			end

			if isSpawn then -- Нопаем все сообщения при запуске
				-- Таблица не нужных сообщений по цвету
				local unnecessaryMessage = {
					[33357768] = "/f",
					[-56662] = "/pm от",
					[-3399015] = "/pm к",
					[-875770113] = "обычный чат",
					[869072810] = "/s | наказания",
					[14221512] = "/c",
					[14874367] = "/phone",
					[-1] = "/phone пропущенный",
					[1687547306] = "/do /me",
					[866792362] = "|___ З А Р П Л А Т А ___|",
					[-169954390] = "exp",
					[-86] = "не получил exp",
					[-1431655766] = "Анти-флуд",
					[-1029514582] = "Использует КПК",
					[-8433494] = "Грузовой поезд прибыл",
					[-65366] = "Наши бойцы напали на вражескую территорию"
				}

				-- Таблица исключений
				local exception = {
					"|___________ Новости .+ ___________|",
					"|___________ Медицинские Новости Штата  ___________|",
					-- "Лотерея: Через 2 минуты начинаем розыгрыш%, набери '%/lotto %[номер %(1 %- 80%)%]'%. Разыгрывается %$%d+%.",
					"Событие \"Лёгкие деньги\": Двойная оплата труда .+ в течение часа%.",
					-- "Лотерея: Сегодня выигрышный номер %d+%.",
					-- "Лотерея: .+ ДжекПот %$%d+%.",
					-- "Лотерея: Назначен новый ДжекПот: %$%d+%.",
				}

				-- Таблица не известных мне цвета сообщений
				local textDeletionTab = {
					"Список будет доступен после окончания турнира",
					"%(%( Лидер .+%[%d+%]: .+ %)%)"
				}

				-- Удаляем совпадение по цвету если текст равен исключению
				for i = 1, #exception do
					if message:find(exception[i]) then
						unnecessaryMessage[color] = nil;
					end
				end

				-- Удаляем совпадение по тексту если текст равен исключению
				for i = 1, #textDeletionTab do
					if message:find(textDeletionTab[i]) then
						unnecessaryMessage[color] = 1;
					end
				end

				if not unnecessaryMessage[color] then

					pendengTable.chatTab[#pendengTable.chatTab + 1] = {
						text = message,
						color = convertIntToHex(color),
						time = os.date("%H:%M:%S", os.time(os.date("!*t")) + 10800);
					}

					-- Запускаем сбор всех строк за 1 сек и отправку
					sendPendingCollection("/chat", "chatTab", 1000);
				end
			end

		elseif id == 55 then -- SendDeathMessage
			--[[UINT16 wKillerID, 
			UINT16 wPlayerID, 
			UINT8 reason]]

			local bs = bitStreamInit(data, size);
			local killerID = bitStreamReadWord(bs);
			local killedID = bitStreamReadWord(bs);
			local weapon = bitStreamReadByte(bs);
			bitStreamDelete(bs);

			local KillerInfo = getPlayer(killerID);
			local KilledInfo = getPlayer(killedID);
			if KillerInfo and KilledInfo then
				local killerColor = getPlayerColor(killerID) or -255;
				local killedColor = getPlayerColor(killedID) or -255;

				killerColor = convertIntToHex(killerColor);
				killedColor = convertIntToHex(killedColor);

				pendengTable.killListTab[#pendengTable.killListTab + 1] = {
					killer = KillerInfo.name,
					killed = KilledInfo.name,
					killerColor = killerColor,
					killedColor = killedColor,
					weapon = weapon,
				}

				sendPendingCollection("/killList", "killListTab", 1000);
			end

		elseif id == 12 then -- SendSpawn  (Ставим бота возле deliver`a)
			--[[float x, 
			float y, 
			float z]]

			local bs = bitStreamInit(data, size);
			bitStreamSetWriteOffset(bs, 0);
			bitStreamWriteFloat(bs, -2139.5390625);
			bitStreamWriteFloat(bs, -241.79652404785);
			bitStreamWriteFloat(bs, 36.515625);
			bitStreamDelete(bs);

		elseif id == 14 then -- не даём умереть боту в афк
			-- SetPlayerHealth - ID: 14
			-- Parameters: float health


			local bs = bitStreamInit(data, size);
			local health = bitStreamReadFloat(bs);
			bitStreamDelete(bs);
			if isSpawn and health == 0 then
				if IS_REQUEST_SERVER_SEND and accesSend and not IS_ANTI_AFK then
					return true;
				end
			end
		end
	end
end

function onSetPosition(x, y, z)
    local px, py, pz = getPosition()
    if px == x and py == y and z > pz and slapState == 0 then
		if os.time() - afkTimer <= 3 then
			slapState = 1;
			sendSlapSync(x, y, z, px, py, pz);
		end
    end
end

function onTextLabelShow(labelId, positionX, positionY, positionZ, labelString)
	if IS_REQUEST_SERVER_SEND and accesSend then
		if math.floor(positionX) == -2120 and math.floor(positionY) == -179 and math.floor(positionZ) == 35 then
			currectDeliver = labelString:match("Доступно: (%d+)");
			print("Матов на деливере: " .. currectDeliver);
		end
	end
	return true
end

function onConnect()
	connectDate = os.date("%d.%m.%Y %H:%M:%S", os.time(os.date("!*t")) + 10800);
	if os.clock() > 30 then
		sendTelegramMessage(telegramLastRoom, "Я подключился к серверу!");
	end
end

function onDisconnect()
	gangZoneActiveCapture = {};
	currectServerTime = nil
	playerColor = {};
	currectDeliver = -1;
	if os.clock() > 30 then
		sendTelegramMessage(telegramLastRoom, "Я отключился от сервера!");
	end
end

function onSpawned()
	if os.clock() > 30 then
		sendTelegramMessage(telegramLastRoom, "Я заспавнился!");
	end

	Tasking.new(function()
		Tasking.wait(3000);
		
		local state = getBotState();
		isSpawn = state == 1 or state == 2 or state == 3; -- доп проверка
	end)
end

function onPlayerDeath(playerId)
	if playerId == getBotId() then
		sendTelegramMessage(telegramLastRoom, "Я умер!");
	end
end

function onSetSkin(playerid, skinId)
	if playerid == getBotId() and skinId ~= 0 then
		Tasking.new(function()
			Tasking.wait(20000);
			if currectDeliver == -1 then
				-- print("Не получил количество матов на деливере. Переподключаюсь!")
				-- sendTelegramMessage(telegramLastRoom, "Не получил количество матов на деливере. Переподключаюсь!");
				-- notCrashRecconect();
			end
		end)

		if os.clock() > 30 and accesSend and IS_REQUEST_SERVER_SEND then
			sendTelegramMessage(telegramLastRoom, "У меня поменялся скин на: "..skinId);
		end
	end
end

function onCrash()
	if os.clock() > 30 and accesSend and IS_REQUEST_SERVER_SEND then
		sendTelegramMessage(telegramLastRoom, "Я крашнул. Всё... Кина не будет сегодня!");
	end
end

function onPrintLog(string) -- не показываем серверные сообщения в лог
	if isSpawn and accesSend and IS_NOP_SERVER_MSG then
		if string:find("%[СЕРВЕР%] .+") or string:find("%[RAKBOT%] Отправлен ответ диалогу") then
			return true;
		end

		if string:find("Ваш уровень здоровья изменен на %d+") then
			return true;
		end

		if string:find("Количество денег изменено на") then
			return true;
		end
	end
end

function onSendPacket(id, data, size) -- Ставим себя в афк
	if isSpawn then
		if IS_REQUEST_SERVER_SEND and accesSend and not IS_ANTI_AFK then
			return true;
		end
	end
	afkTimer = os.time();
end

-- Не даём флудить подключениями
local connectTimer = 0;
function onRequestConnect()
	local msecond = (IS_REQUEST_SERVER_SEND and accesSend) and 300000 or getReconnectDelay();
	if os.time() - connectTimer >= (msecond - 2000) / 1000 then
		connectTimer = os.time(); 
	else
		return true;
	end
end

function onDialogShow(dialogId, style, title, button1, button2, text)
	if collectionTop and accesSend and IS_REQUEST_SERVER_SEND then
		if title:find("КПК") then
			sendDialog(dialogId, 1, 8, "Топ игроков");
			return true;
		elseif title:find("Топ игроков") then
			local tab = {
				[1] = {0, "Топ убийств на /joinz"},
				[2] = {1, "Топ гонщиков на /joinr"}
			}

			if tab[collectionTopTitle] then
				sendDialog(dialogId, 1, tab[collectionTopTitle][1], tab[collectionTopTitle][2]);
			end
			return true;
		else
			-- Диалог с топом
			local titleTab = {
				["Топ 9 убийств на /joinz."] = "joinz",
				["Топ 9 гонщиков /joinr."] = "joinr",
				["Топ 9 убийств на пейнтболе."] = "paintBall",
				["Граффити"] = "tags";
			}

			if titleTab[title] then
				--[[1. KyMbIc (4218).
				2. [RoX].Fury. (3095).
				3. .dewr (2888).
				4. SENSATION. (2757).
				5. Twisti.BY (2494).
				6. bavaria (2384).
				7. ella33333 (2207).
				8. .qewr (1958).
				9. TvoyMember (1679).

				Твой результат: 56.]]
				local tabTitle = titleTab[title]

				for line in text:gmatch("[^\r\n]+") do
					if tabTitle ~= "tags" then
						local nick, points = line:match("%d%. (.+) %((%d+)%)%.");
						if nick and points then
							collectionTopTab[tabTitle][#collectionTopTab[tabTitle] + 1] = {
								nick = nick,
								points = points;
							}
						end
					else
						-- Yakuza: (12).
						-- LCN: (123).
						local frac, int = line:match("(.+):%s+(%d+)%.");
						collectionTopTab[tabTitle][#collectionTopTab[tabTitle] + 1] = {
							nick = convectFractions(frac),
							points = int;
						}
					end
				end
				return true;
			end
		end
	end
end

function onPlayerJoin(playerId, playerName)
	local date = os.date("%d.%m.%Y %H:%M:%S", os.time(os.date("!*t")) + 10800);
	connectPlayerTime[playerId] = date;
end

function onPlayerQuit(id, reason)
	playerColor[id] = nil;
	connectPlayerTime[id] = nil;
	afkPlayerTab[id] = nil;
end

function onTextDrawSetString(textDrawId, textDrawString)
	if accesSend and IS_REQUEST_SERVER_SEND then
		getCurrectDate(textDrawId, textDrawString);
		gangZoneSaveTab(textDrawId, textDrawString);
	end
end

function onTextDrawShow(textDrawId, positionX, positionY, textDrawString)
	if accesSend and IS_REQUEST_SERVER_SEND then
		getCurrectDate(textDrawId, textDrawString);
		gangZoneSaveTab(textDrawId, textDrawString);
	end
end

function onRunCommand(cmd)
	if cmd == "!x" then

		return true;
	elseif cmd == "!sendtop" then
		sendGangZoneSaveTab();
		return true;
	end
end