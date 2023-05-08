import React, { useState, useRef } from "react";
import Sound, { NoteValue, PlayingState } from "./sound";


const NoteValues: NoteValue[] = [
  { name: "C", frequency: 65.41 },
  { name: "D", frequency: 73.42 },
  { name: "E", frequency: 82.41 },
  { name: "F", frequency: 87.31 },
  { name: "G", frequency: 98.00 },
  { name: "A", frequency: 110.00 },
  { name: "B", frequency: 123.47 },
];


function Player() {
  const [playingState, setPlayingState] = useState(PlayingState.Playing);
  const [notes, setNotes] = useState<NoteValue[]>([]);

  function handlePlay() {
    setPlayingState(PlayingState.Playing);
  }

  function handleNote(note: NoteValue) {
    setNotes([...notes, note]);
  }

  function handlePause() {
    setPlayingState(PlayingState.Paused);
  }

  function handleClear() {
    setNotes([]);
  }

  return (
    <div>
      <div>
        <Sound playingState={playingState} notes={notes} />
        <div>{playingState === PlayingState.Playing ? "Playing" : "Paused"}</div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <table>
        <tbody>
          {[2, 3, 4, 5, 6, 7, 8].map(octave =>
            <tr key={"tr-" + octave}>
              {NoteValues.map(note =>
                <td key={"td-" + note.name + octave}>
                  <NoteButton note={note} octave={octave} onClick={handleNote} />
                </td>
              )}
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}

function NoteButton({ note, octave, onClick }
  : { note: NoteValue, octave: number, onClick: (note: NoteValue) => void }) {
  return <button onClick={() => onClick({
    frequency: note.frequency * (2 ** (octave - 2)),
    name: note.name
  })} >
    {note.name + octave}
  </button>
}

export default Player;