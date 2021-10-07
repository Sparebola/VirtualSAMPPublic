package.path = getRakBotPath().."/scripts/libs/?.lua;"..getRakBotPath().."/scripts/libs/?/init.lua;"
package.cpath = getRakBotPath().."/scripts/libs/?.dll"
require('Tasking')

function table.pack(...)
    return {n = select ("#", ...), ...}
end

function table.unpack(tab, start, stop)
    if not start then start = 1 end
    if not stop then stop = #tab end
    if start == stop then
        return tab[start]
    else
        return tab[start], unpack(tab, start + 1, stop)
    end
end

function dump(o)
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
end

function print(...)
    local str = ""
    local args = table.pack(...)
    for i = 1, args.n do
        str = str .. dump(args[i]) .. "    "
    end
    printLog(str:gsub("%%","#"))
end

onScriptUpdate = function ()
    Tasking.tick()
    if _onScriptUpdate then
        _onScriptUpdate()
    end
end