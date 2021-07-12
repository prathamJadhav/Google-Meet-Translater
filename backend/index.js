var phraseDiv;
var startRecognizeOnceAsyncButton;

// subscription key and region for speech services.
var subscriptionKey, serviceRegion, languageTargetOptions, languageSourceOptions;
var SpeechSDK;
var recognizer;

document.addEventListener("DOMContentLoaded", function () {
  startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
  subscriptionKey = document.getElementById("subscriptionKey");
  serviceRegion = document.getElementById("serviceRegion");
  languageTargetOptions = document.getElementById("languageTargetOptions");
  languageSourceOptions = document.getElementById("languageSourceOptions");
  phraseDiv = document.getElementById("phraseDiv");
  resultDiv = document.getElementById("resultDiv");
  startSpeakTextAsyncButton = document.getElementById("startSpeakTextAsyncButton");

  startRecognizeOnceAsyncButton.addEventListener("click", function () {
    startRecognizeOnceAsyncButton.disabled = true;
    phraseDiv.innerHTML = "";

    if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
      alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
      startRecognizeOnceAsyncButton.disabled = false;
      return;
    }
    var speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);

    speechConfig.speechRecognitionLanguage = languageSourceOptions.value;
    let language = languageTargetOptions.value
    speechConfig.addTargetLanguage(language)

    var audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      function (result) {
        startRecognizeOnceAsyncButton.disabled = false;
        let translation = result.translations.get(language);
        window.console.log(translation);
        phraseDiv.innerHTML += translation;

        recognizer.close();
        recognizer = undefined;
      },
      function (err) {
        startRecognizeOnceAsyncButton.disabled = false;
        phraseDiv.innerHTML += err;
        window.console.log(err);

        recognizer.close();
        recognizer = undefined;
      });

    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfigTwo);

    let inputText = phraseDiv.value;
    synthesizer.speakTextAsync(
      inputText,
      function (result) {
        startSpeakTextAsyncButton.disabled = false;
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          //resultDiv.innerHTML += "synthesis finished for [" + inputText + "].\n";
        } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
          //resultDiv.innerHTML += "synthesis failed. Error detail: " + result.errorDetails + "\n";
        }
        window.console.log(result);
        synthesizer.close();
        synthesizer = undefined;
      },
      function (err) {
        startSpeakTextAsyncButton.disabled = false;
        // resultDiv.innerHTML += "Error: ";
        // resultDiv.innerHTML += err;
        // resultDiv.innerHTML += "\n";
        window.console.log(err);

        synthesizer.close();
        synthesizer = undefined;
    });
  });

  startSpeakTextAsyncButton.addEventListener("click", function (){
    startSpeakTextAsyncButton.disabled = true;

    var speechConfigTwo = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);

    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfigTwo);

    let inputText = phraseDiv.value;
    synthesizer.speakTextAsync(
      inputText,
      function (result) {
        startSpeakTextAsyncButton.disabled = false;
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          resultDiv.innerHTML += "synthesis finished for [" + inputText + "].\n";
        } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
          resultDiv.innerHTML += "synthesis failed. Error detail: " + result.errorDetails + "\n";
        }
        window.console.log(result);
        synthesizer.close();
        synthesizer = undefined;
      },
      function (err) {
        startSpeakTextAsyncButton.disabled = false;
        resultDiv.innerHTML += "Error: ";
        resultDiv.innerHTML += err;
        resultDiv.innerHTML += "\n";
        window.console.log(err);

        synthesizer.close();
        synthesizer = undefined;
    });
  });

  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startRecognizeOnceAsyncButton.disabled = false;

    document.getElementById('content').style.display = 'block';
    document.getElementById('warning').style.display = 'none';
  }
});