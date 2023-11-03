//Debashish Buragohain
//Interface model for live2d

let debug_ = true;                      //yes we are running in the debug mode
let voices = [];                        //store the array of voices
var synth = window.speechSynthesis;     //initialize the speech synthesis object

// in Google Chrome the voices are not ready on page load
if ('onvoiceschanged' in synth) synth.onvoiceschanged = loadVoices;
else loadVoices();

//get the voices available and display it to the console
function loadVoices() {
    voices = synth.getVoices();                 //get the voices available
    let voice_names = [];
    for (let i = 0; i < voices.length; i++) voice_names.push(voices[i].name)
    console.log("Voices available: ", JSON.stringify(voice_names))
}

function setVoice(index) {
    if (!index) index = 0;
    let chosenVoices = ['Microsoft Zira - English (United States)', "Google US English"]
    for (let m = 0; m < voices.length; m++) if (voices[m].name == chosenVoices[index]) return m;
}

//check if we are speaking 
function ifSpeaking() {
    return synth.speaking;
}

//speech synthesis function
function speakSynth(text = "", voiceIndex = 0) {
    let rate = "1.0"
    let textSegments = [];          //now we separate the sentence into segments representing the tone of that sentence
    function addStr(str, index, stringToAdd) {
        return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    }
    const stressSymbols = {
        exclamation: {
            sign: "!",
            len: 1,
            pitch: "1.3"
        },
        sad: {
            sign: ";",
            len: 1,
            pitch: "0.95"
        },
        joy: {
            sign: ',',
            len: 1,
            pitch: "1.2"
        },
        normal: {
            sign: ".",
            len: 1,
            pitch: "1.05"
        }
    };
    for (let i = 0; i < text.length - 1; i++) {
        //compare each character with our signs
        for (let m in stressSymbols) {
            if (text[i] == stressSymbols[m].sign && stressSymbols[m].sign !== ".") {
                text = addStr(text, i + 1, ".");        //add the punctuation fullstop
            }
        }
    }
    text.split(".").forEach(el => {
        let type = "normal";
        for (m in stressSymbols) {
            if (el.includes(stressSymbols[m].sign))
                type = m;
        }
        textSegments.push({
            text: el,
            type: type
        })
    })
    console.log(JSON.stringify(textSegments))
    textSegments.forEach(el => {
        let speechText = new SpeechSynthesisUtterance(el.text)
        if (voiceIndex) {
            console.log("Using voice: ", voices[voiceIndex].name)
            speechText.voice = voices[voiceIndex];
        }
        console.log(el.type)
        speechText.pitch = stressSymbols[el.type].pitch;        //set the stress symbol from the database
        speechText.rate = rate;
        synth.speak(speechText);
    })
    console.log(JSON.stringify(textSegments))
    //speech synthesis for every segment
}

/*
//speak only when we are indicated by the user 
document.getElementById("synthesis").addEventListener('click', () => {
    speakSynth('Hi there! I would love to hang out with you. Would you consider me as your friend,', setVoice(1))
})
*/

//speech recognition object
var recognizing,
    transcription, //= document.getElementById('speech'),
    interim_span //= document.getElementById('interim');

var final_transcript = "";
var interim_transcript = "";

if (!(window.webkitSpeechRecognition) && !(window.speechRecognition))
    console.log('Please use Google Chrome for the best experience.');
else startRecognition;

function startRecognition() {
    //function to reset the speech recognition
    var speech = new webkitSpeechRecognition() || speechRecognition();
    function reset() {
        recognizing = false;
        speech.start();
    }
    speech.continuous = true;
    speech.interimResults = true;
    speech.lang = 'en-US';
    speech.start();
    //start callback
    speech.onstart = function () {
        recognizing = true; //yes we are recognising now
    }
    //callback for the speech result function
    speech.onresult = function (event) {
        interim_transcript = '';
        final_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        //now we might create a div and output the interim and final results        
        transcription.innerHTML = final_transcript;
        interim_span.innerHTML = interim_transcript;
    }
    speech.onerror = function (e) {
        console.error("Error in speech recogntition: ", e.error);
    }
    speech.onend = function (e) {
        reset();
    }
}











