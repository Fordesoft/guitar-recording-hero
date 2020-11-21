var canvas;
var ctx;
var backingTrack;

var game = {
    isPlaying: false,
    timeElapsedInSeconds: 0
};

var currentSong = {
    tempo: 120, // 120 bpm
    notes: [
        {
            measuresIntoSong: 2,
            whichString: 0, // red string
            fret: "5", // 5th fret
            palmMuted: true
        },
        {
            measuresIntoSong: 2.25,
            whichString: 0, // red string
            fret: "5", // 5th fret
            palmMuted: true
        },
        {
            measuresIntoSong: 2.5,
            whichString: 0, // red string
            fret: "5", // 5th fret
            palmMuted: true
        },
        {
            measuresIntoSong: 3,
            whichString: 0, // red string
            fret: "5", // 5th fret
            palmMuted: false
        },
        {
            measuresIntoSong: 4,
            whichString: 0,
            fret: "7", // 7th fret
            palmMuted: true
        },
        {
            measuresIntoSong: 4.25,
            whichString: 0,
            fret: "7", // 7th fret
            palmMuted: true
        },
        {
            measuresIntoSong: 4.5,
            whichString: 0,
            fret: "7", // 7th fret
            palmMuted: true
        },
        {
            measuresIntoSong: 5,
            whichString: 0,
            fret: "7", // 7th fret
            palmMuted: false
        }
    ],
    songLengthInMeasures: 5
};

// settings
var config = {
    backingTrackIsMuted: false,
    xLocationOfGuitar: 200, // where the "guitar" is drawn on-screen
    yLocationOfGuitar: 700, // where the "guitar" is drawn on-screen
    noteRadius: 17,
    horizontalDistanceBetweenStrings: 40
};

function init() {
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext('2d');
    backingTrack = document.getElementById("backingTrack");

    document.getElementById('backingTrackMuter').addEventListener('click', function() {
        config.backingTrackIsMuted = !config.backingTrackIsMuted;
        document.getElementById('backingTrackMuter').innerHTML = (config.backingTrackIsMuted ? "Off" : "On");
        if (config.backingTrackIsMuted) {
            backingTrack.volume = 0;
        }
        else {
            backingTrack.volume = 1;
        }
    });

    document.getElementById('startAndStopButton').addEventListener('click', function() {
        game.isPlaying = !game.isPlaying;
        document.getElementById('startAndStopButton').innerHTML = (game.isPlaying ? "Stop" : "Play");
        if (!game.isPlaying) {
            backingTrack.pause();
            resetGame();
        }
        else {
            if (!config.backingTrackIsMuted) {
                backingTrack.currentTime = 0;
                backingTrack.volume = 1;
                backingTrack.play();
            }
        }
    });

    resetGame();
    requestAnimationFrame(animationFrame);
    
}

function drawCircle(x, y, r, g, b, radius, strokeColor) {
    ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    if (typeof strokeColor !== 'undefined') {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

var lastFrameTime = undefined;
function animationFrame(timestamp) {
    if (lastFrameTime === undefined) {
        lastFrameTime = timestamp;
        requestAnimationFrame(animationFrame);
        return;
    }
    tick((timestamp - lastFrameTime) * 0.001);
    draw();
    lastFrameTime = timestamp;
    requestAnimationFrame(animationFrame);
}

function tick(delta) {
    if (game.isPlaying) {
        game.timeElapsedInSeconds += delta;
        var songLengthInSeconds = currentSong.songLengthInMeasures * (currentSong.tempo / 60);
        if (game.timeElapsedInSeconds > songLengthInSeconds) {
            game.timeElapsedInSeconds = 0;
        }
    }
}

function resetGame() {
    game.timeElapsedInSeconds = 0;
    if (game.isPlaying && !config.backingTrackIsMuted) {
        backingTrack.currentTime = 0;
        backingTrack.volume = 1;
        backingTrack.play();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawUI();
    drawNotes();
}

function drawUI() {
    drawCircle(config.xLocationOfGuitar, config.yLocationOfGuitar, 200, 0, 0, config.noteRadius, 'black'); // red
    drawCircle(config.xLocationOfGuitar + config.horizontalDistanceBetweenStrings, config.yLocationOfGuitar, 150, 150, 0, config.noteRadius, 'black'); // yellow
    drawCircle(config.xLocationOfGuitar + config.horizontalDistanceBetweenStrings * 2, config.yLocationOfGuitar, 0, 0, 200, config.noteRadius, 'black'); // blue
    drawCircle(config.xLocationOfGuitar + config.horizontalDistanceBetweenStrings * 3, config.yLocationOfGuitar, 200, 100, 0, config.noteRadius, 'black'); // orange
    drawCircle(config.xLocationOfGuitar + config.horizontalDistanceBetweenStrings * 4, config.yLocationOfGuitar, 0, 120, 0, config.noteRadius, 'black'); // green
    drawCircle(config.xLocationOfGuitar + config.horizontalDistanceBetweenStrings * 5, config.yLocationOfGuitar, 150, 0, 150, config.noteRadius, 'black'); // purple
}

function drawNotes() {
    ctx.font = "24px Arial";
    for (var i = currentSong.notes.length - 1; i >= 0; i--) {
        var yPosition = calculateYForNote(currentSong.notes[i], game.timeElapsedInSeconds);
        if (yPosition >= -20 && yPosition < canvas.height + 20) {
            var currentNote = currentSong.notes[i];
            var color = { r: 200, g: 0, b: 0 };
            switch (currentNote.whichString) {
                case 1:
                    color = { r: 150, g: 150, b: 0 };
                    break;
                case 2:
                    color = { r: 0, g: 0, b: 200 };
                    break;
                case 3:
                    color = { r: 200, g: 100, b: 0 };
                    break;
                case 4:
                    color = { r: 0, g: 120, b: 0 };
                    break;
                case 5:
                    color = { r: 150, g: 0, b: 150 };
                    break;
            }
            var xPosition = config.xLocationOfGuitar + config.horizontalDistanceBetweenStrings * currentNote.whichString;

            if (currentNote.palmMuted) {
                drawLine(xPosition - 35, yPosition, xPosition + 35, yPosition, 'black');
            }

            outlineColor = 'black';
            textColor = 'white';

            // if close to the guitar, highlight this note
            if (yPosition >= config.yLocationOfGuitar && Math.abs(yPosition - config.yLocationOfGuitar) < 20) {
                color.r += 70;
                color.g += 70;
                color.b += 70;
                textColor = 'white';
            }

            drawCircle(xPosition, yPosition, color.r, color.g, color.b, config.noteRadius, outlineColor);
            ctx.fillStyle = textColor;
            ctx.fillText(currentSong.notes[i].fret, xPosition - 6, yPosition + 7);
        }
    }
}

function calculateYForNote(note, timePassedInSeconds) {
    var timePassedInBeats = currentSong.tempo * timePassedInSeconds;

    var result = config.yLocationOfGuitar;

    var pixelsPerBeat = currentSong.tempo / 120;

    result += timePassedInBeats * pixelsPerBeat;
    result -= (note.measuresIntoSong * currentSong.tempo) * pixelsPerBeat;

    return result;
    
}