import data from './data';

export default {
    // segments: data[0].data.segments,

    // TODO: Add TurnTaking:expandedData
    // TODO: Add TurnTaking:collapsedData
    // TODO: Move Script:constructor code here

    expandedData: {},

    focusTranscript: function(transcript, targetUtterance, options) {
        console.log("here");
        var rangeMin = options.range.min || 1,
            rangeMax = options.range.max || 1
        var activeTurnIndex = 0;
        console.log("transcript", transcript);
        for (var i = 0; i < transcript.length; i++) {
            var turn = transcript[i];
            var utteranceIndex = turn.utterances.findIndex((utteranceObj) => {
                return utteranceObj.id === targetUtterance.id && utteranceObj.utterance === targetUtterance.utterance;
            });

            if (utteranceIndex !== -1 ) {
                activeTurnIndex = i;
                break;
            }
        }

        // if minSlice < 0, this breaks due to how slice works
        var minSlice = activeTurnIndex - rangeMin < 0 ? 0 : activeTurnIndex - rangeMin;

        console.log("activeTurnIndex", activeTurnIndex);
        var activeTranscript = transcript.slice(minSlice, activeTurnIndex + 1 + rangeMax);
        console.log("activeTranscript", activeTranscript);
        return activeTranscript;
    }
}
