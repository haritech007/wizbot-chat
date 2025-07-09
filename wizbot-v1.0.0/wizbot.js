"use strict";
(function(w) {
	/**
	 * @author Hari mohan Thakur
	 * @description Automated chatbot wich takes property type requirements form the and sends to server
	 */
    var __ = w; // Refers to window object
    var qId = 0;
    var chatId = 0;
    var yetStarted = false;
    var chatBoxTogglState = "off";
    var finalConversation = [];
    var chatIsEnded = false;
    var cityList = [];
    var selectedCity = null;
    var leadPhone = null;
    var leadName = null;
    var tmpLead = {
        name: null,
        phone: null,
        lang: null
    };
    var botSpinner = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="transform-origin: 50px 50px 0px;width: 30px;margin-top: -5px;margin-bottom: -5px;margin-left: auto;margin-right: auto;display: block;" xml:space="preserve"><g style="transform-origin: 50px 50px 0px;"><g fill="#797979" style="fill: rgb(121, 121, 121); transform-origin: 50px 50px 0px; transform: scale(1);"><g style="transform-origin: 50px 50px 0px;"><g fill="#797979" style="fill: rgb(121, 121, 121);"><style type="text/css" class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -1.5s; animation-direction: normal;">.st0{fill:#F4E6C8;} .st1{opacity:0.8;fill:#849B87;} .st2{fill:#D65A62;} .st3{fill:#E15C64;} .st4{fill:#F47E5F;} .st5{fill:#F7B26A;} .st6{fill:#FEE8A2;} .st7{fill:#ACBD81;} .st8{fill:#F5E169;} .st9{fill:#F0AF6B;} .st10{fill:#EA7C60;} .st11{fill:#A8B980;} .st12{fill:#829985;} .st13{fill:#798AAE;} .st14{fill:#8672A7;} .st15{fill:#CC5960;} .st16{fill:#E17A5F;} .st17{fill:#849B87;} .st18{opacity:0.8;fill:#E15C64;} .st19{opacity:0.8;fill:#F7B26A;} .st20{fill:#79A5B5;} .st21{opacity:0.8;fill:#79A5B4;} .st22{fill:#666766;}</style><g class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -1.38462s; animation-direction: normal;"><circle class="st2" cx="20" cy="50" r="10" fill="#797979" style="fill: rgb(121, 121, 121);"></circle></g><g class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -1.26923s; animation-direction: normal;"><circle class="st10" cx="50" cy="50" r="10" fill="#797979" style="fill: rgb(121, 121, 121);"></circle></g><g class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -1.15385s; animation-direction: normal;"><circle class="st9" cx="80" cy="50" r="10" fill="#797979" style="fill: rgb(121, 121, 121);"></circle></g><metadata xmlns:d="https://loading.io/stock/" class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -1.03846s; animation-direction: normal;"> <d:name class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -0.923077s; animation-direction: normal;">ellipse</d:name> <d:tags class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -0.807692s; animation-direction: normal;">dot,point,circle,waiting,typing,sending,message,ellipse,spinner</d:tags> <d:license class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -0.692308s; animation-direction: normal;">cc-by</d:license> <d:slug class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -0.576923s; animation-direction: normal;">igf6j3</d:slug> </metadata></g></g></g></g><style type="text/css" class="ld ld-fade" style="transform-origin: 50px 50px 0px; animation-duration: 1.5s; animation-delay: -0.461538s; animation-direction: normal;">path,ellipse,circle,rect,polygon,polyline,line { stroke-width: 0; }@keyframes ld-fade {   0% {     opacity: 1;   }   100% {     opacity: 0;   } } @-webkit-keyframes ld-fade {   0% {     opacity: 1;   }   100% {     opacity: 0;   } } .ld.ld-fade {   -webkit-animation: ld-fade 1s infinite linear;   animation: ld-fade 1s infinite linear; } </style></svg>';
    
    var defaultSettings = {
        align: "right",
        // theme: "#f83618",
        version: "7.7.9",
        disableUserInput: false,
        creditText: "clicbrics.com",
        transitionDelay: 200,
        chatDelay: 2500,
        chatAutoStart: false,
        questions: [],
        botName: ["Mr. Brics"],
        apiHost: "https://",
    };

    var globalSettings = new Object;

    /*** Extended the global setting (user setttings + default settings) **/
    try{
    	globalSettings = Object.assign(defaultSettings, (__.wizbot.q && __.wizbot.q.length) ? __.wizbot.q[0][0] : {});
    }catch(E){
    	console.log(E);
    }
    
    function _checkStorage(storageType){
        switch(storageType){
            case "localStorage":
            try{
                var storage = window[storageType];
                var mod = "__storage__";
                if(storage !== null){
                    try {
                        storage.setItem(mod, mod);
                        storage.removeItem(mod);
                        return {
                            status: true,
                            statusText: storageType + " supported"
                        };
                        break;
                    } catch(e) {
                        return {
                            status: false,
                            ex: e,
                            statusText: storageType + " storage not supported"
                        };
                        break;
                    }
                }else{
                    return {
                        status: false,
                        statusText: storageType + " storage not supported"
                    };
                    break;
                }
            }catch(e){
                return {
                    status: false,
                    ex: e,
                    statusText: storageType + " storage not supported"
                };
                break;
            }
            break;
            case "cookie":
            if(window.navigator.cookieEnabled){
                return {
                    status: true,
                    statusText: "Cookie supported"
                };
            }else{
                return {
                    status: false,
                    statusText: "Cookie not supported"
                };
            }
        }
    }
    /*** All the private methods will go form here */
    function validateMobile(number) {
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (filter.test(number)) {
            return true;
        } else {
            return false;
        }
    }
    
    function validMobile(number) {
        if (validateMobile(number)) {
            var phone = number;
            phone = phone.replace(/\+|\-/g, "");
            if (phone.indexOf("0") == 0) {
                phone = phone.substring(1, phone.length);
            }
            if (phone.length > 10 && phone.indexOf("91") === 0) {
                phone = phone.replace(/91/, "")                   ;
            }
            if(phone.length < 10 || phone.length > 12){
                return false;
            }else{
                return phone;
            }
        } else {
            return false;
        }
    }
    
    function loadWidget(){
        loadStyle(function(response){
			
            if(response.status){
                createUI(function(response){
                    if(response.status){
						
                        bootStrap();
                    }else{
                        alert("Unable to load ChatBot UI");
                    }
                });
            }else{
                alert("Unable to load ChatBot stylesheet");
            }
        });   
    } // end of loadWidget

    function startConversation(index){
        // var questions = globalSettings.questions;
        var questions = globalSettings[globalSettings.defQuestionsList];
        if(index < questions.length){
            var obj = {
                type: "question",
                data: questions[index]
            };
            addChat(obj); 
        }
    } // end of startConversation

    function getChatTimeStamp(ts){
        var timestamp = ts;
        var hr = null;
        var min = null;
        var sec = null;

        if(ts.getHours() < 10){
            hr = ts.getHours().toString().padStart(2, "0");
        }else{
            hr = ts.getHours().toString();
        }

        if(ts.getMinutes() < 10){
            min = ts.getMinutes().toString().padStart(2, "0");
        }else{
            min = ts.getMinutes().toString();
        }

        if(ts.getSeconds() < 10){
            sec = ts.getSeconds().toString().padStart(2, "0");
        }else{
            sec = ts.getSeconds().toString();
        }
        return {
            hr: hr,
            min: min,
            sec: sec,
            full: hr + ":" + min,
            ts: timestamp.getTime()
        };
    } // end of getChatTimeStamp

    function capitalize(input){
        var arr = input.split(/\s/g);
        arr.forEach(function(v, i){
            arr[i] = arr[i].substring(0,1).toUpperCase() + arr[i].substring(1);
        });
        return arr.join(" ");
    }

    function addChat(obj){
       
        var chatList = document.getElementById("_hmtChatList");
        var chat = document.createElement("li");
        var quesDiv = document.createElement("div");
        var chatBubble = document.createElement("div");
        var chatTimeStamp = document.createElement("div");
        var chatItemId = "hmt-chat-id-" + chatId;

        quesDiv.className = "_hmtChatItemWrap";
        chatBubble.className = "_hmtChatBubble";
        chatTimeStamp.className = "_hmtChatTimeStamp";
        chat.setAttribute("id", chatItemId); 

        if(obj.type === "question"){
            
            if(leadName === null){
                var questionUI = "<div class=\"_hmtChatq\">" + obj.data.q.replace(/{name}/g, "") + "</div>";
            }else{
                var questionUI = "<div class=\"_hmtChatq\">" + obj.data.q.replace(/{name}/g, capitalize(leadName)) + "</div>";
            }

            chat.className = "_hmtChatItem _hmtChatBot _hmtAnimated _hmtFadeInUp";

            if(obj.data.o && obj.data.o.length){
                questionUI += '<form name="hmt-chat-id-form-' + chatId + '" id="hmt-chat-id-form-' + chatId + '" class="_hmtChatItemForm" data-hmt-q-type="' + obj.data.t + '">';

                if(obj.data.t === "r"){

                    obj.data.o.forEach(function(v, i){
                        questionUI += '<input type="radio" name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '-' + i + '" value="' + v.v + '" class="_hmtRadioBtn" data-hmt-input-label="' + v.l + '">\
                        <label for="hmt-chat-id-f-' + chatId + '-' + i + '">' + v.l + '</label>';
                    });

                }else if(obj.data.t === "c"){

                    obj.data.o.forEach(function(v, i){
                        questionUI += '<input type="checkbox" name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '-' + i + '" value="' + v.v + '" data-hmt-input-label="' + v.l + '">\
                        <label for="hmt-chat-id-f-' + chatId + '-' + i + '">' + v.l + '</label>';
                    });

                }else if(obj.data.t === "f"){

                    obj.data.o.forEach(function(v, i){

                        if(v.ltype && v.ltype.toLowerCase() === "name"){
                            if(tmpLead.name === null){
                                questionUI += '<input type="text" name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '-' + i + '" value placeholder="' + v.l + '" data-hmt-input-label="' + v.l + '" data-hmt-input-validity-type="' + v.vType + '" autocomplete="off">';
                            }else{
                                questionUI += '<input type="text" name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '-' + i + '" value="' + tmpLead.name + '" placeholder="' + v.l + '" data-hmt-input-label="' + v.l + '" data-hmt-input-validity-type="' + v.vType + '" autocomplete="off">';
                            }
                            
                        }else if(v.ltype && v.ltype.toLowerCase() === "mobile"){
                            if(tmpLead.phone === null){
                                questionUI += '<input type="text" name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '-' + i + '" value placeholder="' + v.l + '" data-hmt-input-label="' + v.l + '" data-hmt-input-validity-type="' + v.vType + '" autocomplete="off">';
                            }else{
                                questionUI += '<input type="text" name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '-' + i + '" value="' + tmpLead.phone + '" placeholder="' + v.l + '" data-hmt-input-label="' + v.l + '" data-hmt-input-validity-type="' + v.vType + '" autocomplete="off">';
                            }
                        }else{
                            questionUI += '<input type="text" name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '-' + i + '" value="' + v.v + '" placeholder="' + v.l + '" data-hmt-input-label="' + v.l + '" data-hmt-input-validity-type="' + v.vType + '" autocomplete="off">';
                        }

                    });

                }else if(obj.data.t === "d"){

                    questionUI += '<select name="hmt-chat-id-f-' + chatId + '" id="hmt-chat-id-f-' + chatId + '" data-hmt-input-label="' + obj.data.qType + '">';

                    if(obj.data.qType === "city"){
                        // console.log(selectedCity);
                        cityList.forEach(function(v, i){
                            if(selectedCity !== null && (selectedCity.toString() === v.id.toString())){
                                if(tmpLead.lang === "hi"){
                                    questionUI += '<option  value="' + v.id + ',' + v.name + ',' + v.hName + '" selected>' + v.hName + '</option>';
                                }else{
                                    questionUI += '<option  value="' + v.id + ',' + v.name + '" selected>' + v.name + '</option>';
                                }
                            }else{
                                if(tmpLead.lang === "hi"){
                                    questionUI += '<option  value="' + v.id + ',' + v.name + ',' + v.hName + '">' + v.hName + '</option>';
                                }else{
                                    questionUI += '<option  value="' + v.id + ',' + v.name + '">' + v.name + '</option>';
                                }
                            }                            
                        });
                    }else{
                        obj.data.o.forEach(function(v, i){
                            questionUI += '<option  value="' + v.v + ',' + v.l + '">' + v.l + '</option>';
                        });
                    }

                    questionUI += '</select>';
                }

                /*** Add submit button only those forms*/
                questionUI += '<br><button class="_hmtChatBtn" type="submit">Ok</button>';
                questionUI += '</form>';
            }

        }else if(obj.type === "answer"){
           
            var tmpAnswer = [];
            if(obj.formType === "f"){
                obj.data.forEach(function(v){
                    tmpAnswer.push(v.label + ": " + v.value);
                });
                tmpAnswer.join(", ");
                var questionUI = "<div class=\"_hmtChatq\">" + tmpAnswer + "</div>";
                chat.className = "_hmtChatItem _hmtChatUser _hmtAnimated _hmtFadeInUp";

            }else if(obj.formType === "r"){
                obj.data.forEach(function(v){
                    tmpAnswer.push(v.label);
                });
                tmpAnswer.join(", ");
                var questionUI = "<div class=\"_hmtChatq\">" + tmpAnswer + "</div>";
                chat.className = "_hmtChatItem _hmtChatUser _hmtAnimated _hmtFadeInUp";

            }else if(obj.formType === "c"){
                obj.data.forEach(function(v){
                    tmpAnswer.push(v.label);
                });
                tmpAnswer.join(", ");
                var questionUI = "<div class=\"_hmtChatq\">" + tmpAnswer + "</div>";
                chat.className = "_hmtChatItem _hmtChatUser _hmtAnimated _hmtFadeInUp";
            }else if(obj.formType === "d"){
                // console.log(obj.data)
                obj.data.forEach(function(v){
                    if(tmpLead.lang === "hi"){
                        tmpAnswer.push(v.value.hl);
                    }else{
                        tmpAnswer.push(v.value.l);
                    }
                });
                tmpAnswer.join(", ");
                var questionUI = "<div class=\"_hmtChatq\">" + tmpAnswer + "</div>";
                chat.className = "_hmtChatItem _hmtChatUser _hmtAnimated _hmtFadeInUp";
            }
        }
       
        // Create chat timestamp
        var ts = new Date();
        var chatTime = getChatTimeStamp(ts);
        chatTimeStamp.innerText = chatTime.full;
        chatTimeStamp.setAttribute("data-hmtChatTimeStamp", ts);
      
        // Create and add chant content to the list
        if(obj.type === "question"){

            // chatBubble.innerHTML = "<i>" + globalSettings.botName + " is typing...</i>";
            chatBubble.innerHTML = botSpinner;
            quesDiv.appendChild(chatBubble);
            chat.appendChild(quesDiv);
            chatList.appendChild(chat);
            updateChatContainerScrollView();

            setTimeout(function(){
                var tempChatBubble = document.querySelector("#" + chatItemId + " ._hmtChatBubble"); 
                var tempChat = document.querySelector("#" + chatItemId); 
                tempChatBubble.innerHTML = questionUI;
                tempChat.appendChild(chatTimeStamp);
                updateChatContainerScrollView();
                
                // Bind submit event to chat inlined forms
                var chatInputFormId = "hmt-chat-id-form-" + chatId;
                var chatInputFormEle = document.getElementById(chatInputFormId); 
                if(chatInputFormEle && chatInputFormEle !== null){
                    chatInputFormEle.addEventListener("submit", chatFormInputHandler, false);
                }

                chatId++;

                // Check for end the conversation 
                if(obj.data.isLast && obj.data.isLast === true){
                    endChat();
                }

                // Goto next conversation if type is info
                if(obj.data.t === "i"){
                    qId++;
                    startConversation(qId);
                }

            }, globalSettings.chatDelay);
            
        }else if(obj.type === "answer"){
            // console.log(obj);
            chatBubble.innerHTML = questionUI;
            quesDiv.appendChild(chatBubble);
            chat.appendChild(quesDiv);
            chat.appendChild(chatTimeStamp);
            chatList.appendChild(chat);
            updateChatContainerScrollView();

            var quest = getQuestion(qId);
            finalConversation.push({ q: quest, a: obj.data });


            // Keep lead name locally
            if(quest.qType && quest.qType === "lang"){
                tmpLead.lang = obj.raw[0].value;
                if(tmpLead.lang === "hi"){
                    globalSettings.defQuestionsList = "questionsHindi";
                }else{
                    globalSettings.defQuestionsList = "questions";
                }
            }

            if(quest.qType && quest.qType === "name"){
                leadName = obj.raw[0].value;
            }

            // Set lead source if available in url "utm_source"
            var leadSource = "website";
            try{
                var url = new URL(location.href);
                if(url.searchParams.get('utm_source') !== null){
                    leadSource = url.searchParams.get('utm_source');
                }
            }catch(e){
                console.log(e);
            }

            // Send lead data to api if name and mobile number is given
            if(quest.qType && quest.qType === "lead"){
                var leadPhone = obj.raw[0].value;
                var reqObj = {
                    type: "GET",
                    url: globalSettings.apiHost + "/createlead",
                    data: {
                        name: capitalize(leadName),
                        phone: obj.raw[0].value,
                        source: leadSource
                    }
                };

                if(_checkStorage("localStorage").status){
                	__.localStorage.setItem("_wizbot", JSON.stringify({userPhone: reqObj.data.phone, userName: reqObj.data.name}));
                } else {
                	__.JSStorage.setItem("_wizbot", JSON.stringify({userPhone: reqObj.data.phone, userName: reqObj.data.name}));
                }
                analyticsTracking({action: "wizbot-lead", category: "wizbot-enquiry", label: "wizbot-enquiry-" + reqObj.data.name.replace(/ /g, "_") + "-" + reqObj.data.phone});
                ajaxRequest(reqObj).then(function(response){
                    console.log(response);
                }, function(error){
                    console.log(error);
                });
            }

            // Check for next question based on user answer
            if(quest.o && quest.o.length && quest.t === "r"){
                var tmp = quest.o.filter(function(v){
                    return v.v === obj.raw.value;
                });
                if(tmp.length && tmp[0].n){
                    qId = tmp[0].n;
                }else{
                    qId++;
                }
                setTimeout(function(){
                    chatId++;
                    startConversation(qId);
                }, globalSettings.chatDelay);
            }else if(quest.o && quest.o.length && quest.t === "c"){
                var tmp = [];
                obj.raw.forEach(function(v){
                    tmp.push(quest.o.filter(function(k){
                        return v.value === k.v;
                    })[0]);
                });
                if(tmp.length && tmp[0].n){
                    qId = tmp[0].n;
                }else{
                    qId++;
                }
                setTimeout(function(){
                    chatId++;
                    startConversation(qId);
                }, globalSettings.chatDelay);
            }else{
                qId++;
                setTimeout(function(){
                    chatId++;
                    startConversation(qId);
                }, globalSettings.chatDelay);
            }
        }

    } // end of addChat

    function getQuestion(idx){
        return globalSettings.questions.filter(function(v){
            return v.i === idx;
        })[0];
    } // end of getQuestion

    function addFormError(form, msg){
        var form = form;
        var msg = (tmpLead.lang === null) ? msg["en"] + "<br>" + msg["hi"] : msg[tmpLead.lang];
        var errorId = "_hmtFormErroNofity-" + form.id;
        if(document.getElementById(errorId) !== null){
            document.getElementById(errorId).innerHTML = msg;
        }else{
            var errorBlock = document.createElement("div");
            errorBlock.id = errorId;
            errorBlock.className = "_hmtFormErroNofity _hmtAnimated _hmtFadeInUp";
            errorBlock.innerHTML = msg;
            form.insertBefore(errorBlock, form.firstChild);
        }
    } // end of addFormError

    function chatFormInputHandler(evt){

        var form = null;
        var userInputs = [];
        var formType = null;
        var formLength = 0;
        var errorCount = 0;

        if(evt.target.form){
            form = evt.target.form;
        }else{
            evt.preventDefault();
            form = evt.target;
        }
        
        formType = form.getAttribute("data-hmt-q-type");

        if(formType === "f"){

            formLength = form.elements.length - 1;

            for(var i = 0; i < formLength; i++){
                if(form[i].type === "text" && form[i].value !== ""){
                    if(form[i].getAttribute("data-hmt-input-validity-type") === "mobile"){
                        var phone = validMobile(form[i].value);
                        if(phone){
                            var userNumber = phone;
                            userInputs.push({
                                label: form[i].getAttribute("data-hmt-input-label"),
                                value: phone
                            });
                            form[i].className = form[i].className.replace("error");    
                        }else{
                            form[i].classList.add("error");
                            addFormError(form, {
                                en: "Invalid mobile number",
                                hi: "मोबाइल नंबर सही नहीं है"
                            });
                            errorCount++;
                        }
                    }else{
                        userInputs.push({
                            label: form[i].getAttribute("data-hmt-input-label"),
                            value: form[i].value
                        });
                        form[i].className = form[i].className.replace("error");
                    }
                }else{
                    errorCount++;
                    form[i].classList.add("error");
                    addFormError(form, {
                        en: "Please fill in the field(s) below",
                        hi: "कृपया निचे दिए गए स्थान में सम्बंधित जानकारी भरें"
                    });
                }
            }
            if(!errorCount){
                document.getElementById(form.id).remove();
                addChat({
                    type: "answer",
                    data: userInputs,
                    raw: userInputs,
                    formType: formType
                });
            }

        }else if(formType === "r"){

            for(var i = 0; i < form.elements.length; i++){
                if(form[i].type === "radio" && form[i].checked){
                    userInputs.push({
                        label: form[i].getAttribute("data-hmt-input-label"),
                        value: form[i].value
                    });
                }
            }
            if(userInputs.length){
                document.getElementById(form.id).remove();
                addChat({
                    type: "answer",
                    data: userInputs,
                    raw: userInputs,
                    formType: formType
                });
            }else{
                addFormError(form, {
                    en: "Please select atleast one option",
                    hi: "कृपया कम से कम एक विकल्प चुनें"
                });
            }

        }else if(formType === "c"){

            formLength = form.elements.length - 1; // except submit button
            for(var i = 0; i < formLength; i++){
                if(form[i].type === "checkbox" && form[i].checked){
                    userInputs.push({
                        label: form[i].getAttribute("data-hmt-input-label"),
                        value: form[i].value,
                    });
                }
            }
            if(userInputs.length){
                document.getElementById(form.id).remove();
                addChat({
                    type: "answer",
                    data: userInputs,
                    raw: userInputs,
                    formType: formType
                });
            }else{
                addFormError(form, {
                    en: "Please select atleast one option",
                    hi: "कृपया कम से कम एक विकल्प चुनें"
                });
            }
        }else if(formType === "d"){

            formLength = form.elements.length - 1; // except submit button
            for(var i = 0; i < formLength; i++){
                userInputs.push({
                    label: form[i].getAttribute("data-hmt-input-label"),
                    value: {
                        l: form[i].value.split(",")[1],
                        v: form[i].value.split(",")[0]
                    }
                });
                if(tmpLead.lang === "hi"){
                    userInputs[i].value.hl = form[i].value.split(",").pop();
                }
            }
            if(userInputs.length){
                document.getElementById(form.id).remove();
                addChat({
                    type: "answer",
                    data: userInputs,
                    raw: userInputs,
                    formType: formType
                });
            }else{
                addFormError(form, {
                    en: "Please select atleast one option",
                    hi: "कृपया कम से कम एक विकल्प चुनें"
                });
            }
        }

    } // end of chatFormInputHandler

    /** Play the beep sound */
    function playSound(){
        
        var player = null;
        try{
            if(document.getElementById("_hmtBotPlayer") === null){
                player = document.createElement("audio");
                player.id = "_hmtBotPlayer";
                document.body.appendChild(player);
            }else{
                player = document.getElementById("_hmtBotPlayer");
            }   

            if(player && player !== null){
                player.autoplay = false;
                // player.src = "/wizbot/wizbot-beep.mp3";  
                player.src = "data:audio/mp3;base64,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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuOTguMqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uSxLYDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";  
                if(__.innerWidth > 767){
                    var playPromise = player.play();
                    if (playPromise !== undefined) {
                        playPromise.then(function() {
                            // console.log("wizbot chat bot audio played");
                        }).catch(function(error) {
                            console.log("unable to play chat bot audio", error);
                        });
                    }
                }
            }else{
                throw new Error("Audio player couldn't be intialized");
            }   
        }catch(e){
            console.log(e);
        }
    }
    function chatBotOpen(){
		try {
			analyticsTracking({action: "wizbot-open", category: "wizbot-enquiry", label: "wizbot-enquiry"});
            if(!yetStarted){
                yetStarted = true;
                showChatBox();
                setTimeout(function(){
                    startConversation(qId);
                    yetStarted = true;
                }, globalSettings.transitionDelay);
            }else{
                showChatBox();
            }
		}
		catch (e) {
			console.log(e)
		}
    }
    function bootStrap(){
        console.log("bootStrap");
        // playSound();

        /** Set lead name and phone from localstorage */
        if(_checkStorage("localStorage").status){
            if(__.localStorage.getItem("_wizbot") !== null){
                var localData = JSON.parse(__.localStorage.getItem("_wizbot"));
                tmpLead.name = localData.userName; 
                tmpLead.phone = localData.userPhone; 
            }else if(__.localStorage.getItem("_rb_userData") !== null){
                var localData = JSON.parse(__.localStorage.getItem("_rb_userData"));
                tmpLead.name = localData.name; 
                tmpLead.phone = localData.phone;
            }else{
                tmpLead.name = null; 
                tmpLead.phone = null;
            }
        }else{
            tmpLead.name = null; 
            tmpLead.phone = null;
        }
        
        /** Setup the chatbot name */
        if(globalSettings.botName.length && globalSettings.botName.length > 1){
            document.querySelector("._hmtChatAgentTitle").innerText = globalSettings.botName[Math.floor(Math.random() * globalSettings.botName.length)];
        }else{
            document.querySelector("._hmtChatAgentTitle").innerText = globalSettings.botName[0];
        }

        /** Setup color theme */
        // document.querySelector("._hmtChat").style.setProperty("--hmt-color-accent", globalSettings.theme);

        /** Set alignment for chat box */
        document.querySelector("._hmtChatBox").classList.add(globalSettings.align);

        /*** Check for first start if chat has yetStarted or not */
        var chatThumb = document.querySelector("._hmtChatThumb");
		console.log(chatThumb)
        // var chatThumb2 = document.querySelector("._fromHomePageThumb");
        chatThumb.addEventListener("click", function(){
			console.log("dsfsdfsdfdsf")
            chatBotOpen();
        });
        // if(window.location.pathname=="/"){
        //     chatThumb2.addEventListener("click", function(){
        //         chatBotOpen();
        //     });
        // }
        //chatBotOpen();
        chatThumb.classList.add(globalSettings.align);

        var chatAction = document.querySelector("._hmtChatAction");
        chatAction.addEventListener("click", function(){
            analyticsTracking({action: "wizbot-close", category: "wizbot-enquiry", label: "wizbot-enquiry"});
            hideChatBox();
        });

        var chatInput = document.getElementById("_hmtChatInput");
        chatInput.addEventListener("keydown", function (evt) {
            if (evt.ctrlKey && evt.keyCode === 13) {
                var tmpMsg = evt.target.value;
                evt.target.value = tmpMsg + "\r";
            }else if( evt.keyCode === 13){
                evt.preventDefault();
                var tmpMsg = evt.target.value;
                var obj = {
                    type: "answer",
                    data: evt.target.value
                };
                addChat(obj);
                evt.target.value = "";
            }
        });
        
        /*** Check if user input / type field is enabled or disabled */
        var chatInputWrap = document.querySelector("._hmtChatInputWrap");
        if(globalSettings.disableUserInput){
            chatInputWrap.classList.add("hmtCollapse");
        }

        /**
         * On bootstrapping of chat widget open chat box automatically trasition delay 
         * and then strat conversation but check for chatAutoStart public setting
         */
        if(globalSettings.chatAutoStart && !yetStarted){
            setTimeout(function(){
                showChatBox();
                startConversation(qId);
                yetStarted = true;
            }, globalSettings.transitionDelay);
        }

        /**
         * Chat inline form submit on radio button click
         * Because radio buttons created in future the handled by document
         * Also prevent form submission
         */
        document.addEventListener("click", function(evt){
            // For radio buttons
            if(evt.target.matches("._hmtRadioBtn")){
                // chatFormInputHandler(evt);
            }
        });

        /*** get cities list */

        if(_checkStorage("localStorage").status){
            if(__.localStorage.getItem("citySelected") !== null){
                selectedCity = JSON.parse(__.localStorage.getItem("citySelected")).id;
            }
        }
        var reqObj = {
            type: "GET",
            url: __.location.origin + "/citylist.json?v=" + globalSettings.version,
            data:{
                live: true
            }
        };
        ajaxRequest(reqObj).then(function(response){
            if(response.status && response.data !== null){
                if(response.data.items && response.data.items.length){
                    cityList = response.data.items;
                    cityList.sort(function(a, b) {
                        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                          return -1;
                        }
                        if (nameA > nameB) {
                          return 1;
                        }
                        return 0;
                    });
                }
            }
        }, function(error){
            console.log(error);
        });

    } // end of bootStrap


    function updateChatContainerScrollView(){
        var chatContainer = document.getElementById("_hmtChatContainer");
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } // end of updateChatContainerScrollView

    function createUI(callback){
        var xhttp = null;
        if (__.XMLHttpRequest) {
            xhttp = new XMLHttpRequest(); // code for modern browsers
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP"); // code for old IE browsers
        }

        if(document.getElementById("_hmtChat-1")){
            return false
        }
        
        var chatWrap = document.createElement("div");
        chatWrap.className = "_hmtChat";
        chatWrap.setAttribute("id", "_hmtChat-1");
        document.body.appendChild(chatWrap);

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                chatWrap.innerHTML = this.responseText;
                callback({
                    status: true,
                    message: "chatbot_ui_loaded"
                });
            }else if(this.status === 404){
               console.log("Chat template not found");
            }else if(this.status === 500){
                console.log("Internal server error");
            }
        };
        xhttp.onerror = function(){
            callback({
                status: false,
                message: "unable_to_load_chatbot_ui"
            });
        };
        xhttp.open("GET", "./wizbot-v1.0.0/wizbot-template.html?v=" + globalSettings.version, true);
        xhttp.send();
    } // end of createUI

    function loadStyle(callback){
        var css = document.createElement("link");
        var head  = document.getElementsByTagName('head')[0];
        var cssLoadedAlready = false;

        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", "./wizbot-v1.0.0/wizbot.css?v=" + globalSettings.version);

        css.onerror = function(){
            console.log("ChatBot css not loaded...");
            callback({
                status: false,
                message: "css_not_loaded"
            });
        };

        css.onload = function(){
            // console.log("ChatBot css added...");
            if(!cssLoadedAlready){
                cssLoadedAlready = true;
                callback({
                    status: true,
                    message: "css_loaded"
                });
            }
        };
        head.appendChild(css);
    } // end of loadStyle
    
    function toggleChatInput(status){
        var chatInput = document.getElementById("_hmtChatInput");
        if(status === "off"){
            chatInput.className = "hmtCollapse";
        }else{
            chatInput.className = "hmtCollapse";
        }
    } // end of toggleChatInput

    function toggleChatBox(evt){
        var self = evt.target;
        var chatBox = document.querySelector("._hmtChatBox");
        if(chatBoxTogglState === "off"){
            chatBox.className = chatBox.className.replace("hmtCollapse", "");
            self.classList.add("hmtCollapse");
            chatBoxTogglState = "on";
        }else{
            chatBox.classList.add("hmtCollapse");
            self.className = self.className.replace("hmtCollapse", "");
            chatBoxTogglState = "off";
        }
    } // end of toggleChatBox

    function hideChatBox(){
        var chatBox = document.querySelector("._hmtChatBox");
        var chatThumb = document.querySelector("._hmtChatThumb");
        
        chatBox.classList.add("hmtCollapse");
        setTimeout(function(){
            chatThumb.className = chatThumb.className.replace("hmtCollapse", "");
            if(chatIsEnded){
                resetChat();
            }
            try{
                if(__.innerWidth <= 767){
                    document.querySelector("#page").style.display = "block";
                }
            }catch(e){
                console.log(e);
            }
        }, globalSettings.transitionDelay);
    } // end of hideChatBox
    
    function showChatBox(){
        var chatBox = document.querySelector("._hmtChatBox");
        var chatThumb = document.querySelector("._hmtChatThumb");
        
        chatThumb.classList.add("hmtCollapse");
        setTimeout(function(){
            chatBox.className = chatBox.className.replace("hmtCollapse", "");
            
            try{
                if(__.innerWidth <= 767){
                    document.querySelector("#page").style.display = "none";
                }
            }catch(e){
                console.log(e);
            }
            
        }, globalSettings.transitionDelay);
    } // end of shoChatBox

    function showBotApp(){
        var hmtChat = document.querySelector("._hmtChat");
        hmtChat.className = hmtChat.className.replace("hmtCollapse", "");
    }

    function hideBotApp(){
        var hmtChat = document.querySelector("._hmtChat");
        hmtChat.classList.add("hmtCollapse");
    }

    /**
     * Maked ajax request to the server 
     */
    function ajaxRequest(args){
        var xhttp = null;
        if (__.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.responseType = "json";
        return new Promise(function(resolve, reject){
            xhttp.onreadystatechange = function() {
                // console.log(this.readyState, this.status);
                if (this.readyState === 4 && this.status === 200) {
                    var response = {
                        status: true,
                        data: (this.responseType === "" || this.responseType === "text") ? this.responseText : this.response,
                    }
                    resolve(response);
                }else if(this.status === 404){
                    reject({
                        status: false,
                        error: {
                            message: "not_found",
                            code: this.status
                        }
                    });
                }else if(this.status === 500){
                    reject({
                        status: false,
                        error: {
                            message: "internal_server_error",
                            code: this.status
                        }
                    });
                }
            };
            xhttp.onerror = function(){
                reject(new Error("Unable to send request, something went wrong."));
            };
            var params = typeof args.data == 'string' ? args.data : Object.keys(args.data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(args.data[k]) }
            ).join('&');
            if(args.type.toLowerCase() === "get"){
                xhttp.open(args.type, args.url + "?"  + params, true);
                xhttp.send();
            }else{
                xhttp.open(args.type, args.url, true);
                xhttp.setRequestHeader("content-type", "application/json");
                xhttp.setRequestHeader("cache-control", "no-cache");
                var reqData =JSON.stringify(args.data);
                xhttp.send(reqData);
            }
        });	
    } // end of ajaxRequest

    function resetChat(){

        yetStarted = false;
        chatIsEnded = false;
        qId = 0;
        chatId = 0;
        finalConversation = [];
        document.getElementById("_hmtChatList").innerHTML = "";
        leadName = null;
        leadPhone = null;

        /** Set lead name and phone from localstorage */
        if(_checkStorage("localStorage").status){
            if(__.localStorage.getItem("_wizbot") !== null){
                var localData = JSON.parse(__.localStorage.getItem("_wizbot"));
                tmpLead.name = localData.userName; 
                tmpLead.phone = localData.userPhone; 
            }else if(__.localStorage.getItem("_rb_userData") !== null){
                var localData = JSON.parse(__.localStorage.getItem("_rb_userData"));
                tmpLead.name = localData.name; 
                tmpLead.phone = localData.phone;
            }else{
                tmpLead.name = null; 
                tmpLead.phone = null;
            }
        }else{
            tmpLead.name = null; 
            tmpLead.phone = null;
        }
        
    } // end of restartChat

    function endChat(){
        chatIsEnded = true;
        sendConversationStatus();
    } // end of endChat

    function sendConversationStatus(){
        var finalList = finalConversation;
        var finalChatData = {};
        finalList.forEach(function(v){
            if(v.q.qType && (v.q.qType !== null || v.q.qType !== "")){
                if(v.q.qType === "name"){
                    finalChatData.userName = v.a[0].value;
                }else if(v.q.qType === "lead"){
                    finalChatData.userPhone = v.a[0].value;
                }else if(v.q.qType === "city"){
                    finalChatData.city = v.a[0].value.l;
                    finalChatData.cityId = v.a[0].value.v;
                }else if(v.q.qType === "propType"){
                    var propType = v.a.map(function(item){
                        return item.value;
                    });
                    finalChatData.projectTypeList = propType;
                }else if(v.q.qType === "bhk"){
                    var bhkList = v.a.map(function(item){
                        return item.value;
                    });
                    if(bhkList.indexOf("4") > -1){
                        bhkList.push("5");
                    }
                    finalChatData.bedList = bhkList;
                }else if(v.q.qType === "area"){
                    finalChatData.maxSize = v.a[0].value.v;
                }else if(v.q.qType === "budget"){
                    finalChatData.maxBudget = v.a[0].value.v;
                }else if(v.q.qType === "propStatus"){
                    var propertyStatusList = v.a.map(function(item){
                        return item.value;
                    });
                    finalChatData.propertyStatusList = propertyStatusList;
                }else if(v.q.qType === "leadStatus"){
                    if(parseInt(v.a[0].value) === 1){
                        finalChatData.leadType = "Hottest";
                    }else if(parseInt(v.a[0].value) === 2){
                        finalChatData.leadType = "Hot";
                    }else if(parseInt(v.a[0].value) === 3){
                        finalChatData.leadType = "Warm";
                    }else{
                        finalChatData.leadType = "Cold";
                    }
                }
            }
        });
     
        var reqObj = {
            type: "POST",
            url: globalSettings.apiHost,
            data: finalChatData
        };
        ajaxRequest(reqObj).then(function(response){
            console.log(response);
        }, function(error){
            console.log(error);
        });
    }

    // Track Analytics
    function analyticsTracking(eventObj){
        try{
            if("ga" in __){
                __.ga("send", "event", {
                    eventCategory: eventObj.category,
                    eventAction: eventObj.action,
                    eventLabel: eventObj.label
                });
            }else{
                throw new Error("Unable to tarck event, global GA object not found");
            }
        }catch(error){
            console.log(error);
        }
    }

    function initialize(){
        loadWidget();
    }

    /**
     * All the public methods will go form here
     */
    __.wizbot.setVisible = function(option){
        switch(option){
            case "show":
                showBotApp();
                break;
            case "hide":
                hideBotApp();
                break;
            default:
                showBotApp();
                break;
        }
    };

    __.wizbot.getSettings = function(){
        return globalSettings;
    };

    __.wizbot.getConversation = function(){
        return finalConversation;
    };

    /** Initialization of widget */

    initialize();

}(window));
