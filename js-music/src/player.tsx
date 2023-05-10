import React, { useState, useEffect } from "react";
import Sound, { NoteValue, PlayingState, noteEquals, NoteLength} from "./sound";
import Button from 'react-bootstrap/Button';


import * as d3 from "d3";

import './player.css'

enum NoteLetter {
  C = 0, D = 1, E = 2, F = 3, G = 4, A = 5, B = 6
}

const noteValues = (noteLetter: number) => (octave: number) => {
  return {
    name: NoteLetter[noteLetter % 7] + (octave + Math.floor(noteLetter / 7)),
    frequency: 440 * Math.pow(2, octave - 4 + (noteLetter - 1) / 7),
  };

}

function TimeGrid({ progress, notes, clickHandler }
  : { progress: number, notes: NoteValue[], clickHandler: (row: number, col: number) => void }) {

  function color(row: number, col: number) {
    if (notes.some(note => note.startSixteenth === col && note.name === noteValues(row)(2).name)) {
      return "green";
    }
    return "white";
  }


  const ROWS=32;
  const COLS=16;
  return (
    <div>
      <svg className="time-grid-draw" width="100%" height="100%">
        <g>
          {d3.range(0, COLS, 1).map(col =>
            d3.range(0, ROWS, 1).map(row =>
              <>
                <rect
                  width={100/COLS+"%"} height={100/ROWS+"%"}
                  x={col * 100/COLS + "%"} y={row * 100/ROWS + "%"}
                  fill={color(row,col)} stroke="black" strokeWidth="1"
                  onClick={clickHandler.bind(null, row, col)}
                >
                </rect>
                <text
                  x={(col * 100 + 50)/COLS + "%"} y={(row * 100 + 50)/ROWS + "%"}
                  fill="black" fontSize="12" textAnchor="middle" alignmentBaseline="middle"
                  onClick={clickHandler.bind(null, row, col)}
                >
                  {noteValues(row)(2).name + "-" + col}
                </text>
              </>
            )
          )}
          <line className="time-line" key={"x-time" + progress} x1={progress + "%"} y1="0%" x2={progress + "%"} y2="100%" stroke="red" />
        </g>
      </svg>
    </div>
  );
}



function Player() {

  const [playingState, setPlayingState] = useState(PlayingState.Playing);
  const [notes, setNotes] = useState<NoteValue[]>([]);
  const [progress, setProgress] = useState(0);
  const [beat, setBeat] = useState(0);

  const bpm = 80;

  function tickAnimation(elapsed: number) {
    const msInMinute = 60000;
    const msPerBeat = msInMinute / bpm;
    const msPerScreen = msPerBeat * 4;

    setProgress(elapsed % msPerScreen / msPerScreen * 100);
    setBeat(Math.floor(elapsed % msPerScreen / msPerScreen * 16));
  }


  useEffect(() => {
    const t = d3.timer(tickAnimation);
    return () => t.stop();
  }, []);

  function clickHandler(row: number, col: number) {
    let note = {
      ...noteValues(row)(2),
      duration: NoteLength.Quarter,
      startSixteenth: col,

    }
    toggleNote(note);
  }

  function handlePlay() {
    setPlayingState(PlayingState.Playing);
  }

  function toggleNote(note: NoteValue) {
    if (!notes.find(noteEquals(note))) {
      setNotes([...notes, note]);
    }
    else {
      setNotes(notes.filter(n => !noteEquals(note)(n)));
    }
  }

  function handlePause() {
    setPlayingState(PlayingState.Paused);
  }

  function handleClear() {
    setNotes([]);
  }

  return (
    <div className="player">

      <TimeGrid progress={progress} notes={notes} clickHandler={clickHandler} />
      <div>
        {playingState === PlayingState.Playing ? "Playing" : "Paused"}
        {beat}
        <Sound playingState={playingState} notes={notes} bpm={bpm} beat={beat}/>
        <div>
          <span>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleClear}>Clear</button>
            <Button variant="primary">Primary</Button>
          </span>
        </div>
      </div>


    </div>
  );
}

export default Player;
