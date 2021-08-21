const defaultVoiceSettings = {
	lang: 'es-ES',
	rate: 1,
	pitch: 1,
	volume: 1,
	text: 'Hola'
};
export function createSpeech(rate: number, pitch: number): SpeechSynthesisUtterance {
	const speech = new SpeechSynthesisUtterance();
	speech.lang = 'es-ES';
	speech.rate = rate;
	speech.pitch = pitch;
	speech.volume = 1;
	speech.text = 'Hola';
	return speech;
}
export function speak(speech: SpeechSynthesisUtterance, text: string): void {
	speech.text = text;
	speechSynthesis.speak(speech);
}

/* ------------------------------------------------------- */

/*
JavaScript SpeechSynthesis Interface:
This is the main controller interface for the speech synthesis service which controls the synthesis or creation of speech using the text provided. This interface is used to start the speech, stop the speech, pause it and resume, along with getting the voices supported by the device.

Following are the methods available in this Interface:

speak(): Add the utterance(object of SpeechSynthesisUtterance) in the queue, which will be spoken when there is no pending utterance before it. This is the function, we will be using too.

pause(): To pause the current ongoing speech.

resume(): To resume the paused speech.

cancel(): To cancel all the pending utterances or speech created, which are not yet played.

getVoices(): To get list of all supported voices which the device supports.

JavaScript SpeechSynthesisUtterance Interface
This is the interface in which we actually create the speech or utterance using the text provided, setting a language type, volume, pitch of the voice, rate of speech, etc. Once we have created an object for this interface, we provide it to the SpeechSynthesis object's speak() method to play the speech.

Following are the properties provided by this interface to configure it(we have used all of them in our code example):

lang: To get and set the language of speech.

pitch: To get and set the pitch of the voice at which the utterance will be spoken.

rate: To get and set the speed at which the utterance will be spoken.

volume: To get and set the volume.

text: To get and set the text which has to be spoken.

voice: To get or set the voice to be used.

JavaScript window.speechSynthesis Property
This property of the Javascript window object is used to get the reference of the speech synthesis controller interface, on which we call the speak() method. */
