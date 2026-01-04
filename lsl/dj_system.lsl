// Second Life Parça istek sistemi 🟡
string backendUrl = "https://api-l2ngdeqllq-uc.a.run.app"; 
key httpRequestId;
integer listenHandle;

default
{
    state_entry()
    {
        // Objenin uzerine Sari Hovertext ekle
        llSetText(" ", <1.0, 0.8, 0.0>, 1.0);
        
        listenHandle = llListen(0, "", NULL_KEY, "");
        llOwnerSay("Açıldı");
    }

    listen(integer channel, string name, key id, string message)
    {
        string lowerMsg = llToLower(message);
        if (llSubStringIndex(lowerMsg, "/istek") == 0)
        {
            string remainingMsg = llStringTrim(llDeleteSubString(message, 0, 6), STRING_TRIM);
            if (remainingMsg == "") return;

            string userName = name;
            string songName = remainingMsg;
            string isAnonymous = "false";
            
            llInstantMessage(id, "Isteginiz alindi: " + songName);

            string json = "{\"song\": \"" + songName + "\", \"user_uuid\": \"" + (string)id + "\", \"user_name\": \"" + userName + "\", \"is_anonymous\": " + isAnonymous + "}";
            httpRequestId = llHTTPRequest(backendUrl + "/request", [HTTP_METHOD, "POST", HTTP_MIMETYPE, "application/json"], json);
        }
    }

    http_response(key request_id, integer status, list metadata, string body)
    {
        if (request_id != httpRequestId) return;
        if (status != 200 && status != 201)
        {
            llOwnerSay("Sunucu Hatasi! (Kod: " + (string)status + ")");
        }
    }
}