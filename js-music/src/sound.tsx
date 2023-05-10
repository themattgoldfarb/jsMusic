import React, { useRef, useEffect } from "react";

export enum PlayingState {
  Playing,
  Paused,
}

export enum NoteLength {
  Whole, Half, Quarter, Eighth, Sixteenth,
}

export interface NoteValue {
  name: string;
  frequency: number;
  startSixteenth?: number;
  duration?: NoteLength;
}

export const noteEquals = (note: NoteValue) => (other: NoteValue) => 
      Math.floor(note.frequency) === Math.floor(other.frequency)
      && note.name === other.name
      && note.startSixteenth === other.startSixteenth
      && note.duration === other.duration;


interface SoundInput {
  playingState: PlayingState;
  notes: NoteValue[];
  bpm: number;
  beat: number;
}

function SingleNote({ note, audioCtx }
  : { note: NoteValue, audioCtx: AudioContext }) {
  useEffect(() => {
    let oscillator = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;
    oscillator.start();
    return () => {
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + .5);
      oscillator.stop(audioCtx.currentTime + 1);

    }
  }, [note, audioCtx]);
  return <span>{note.name}</span>

}

function Sound({ playingState, notes, bpm, beat}: SoundInput) {

  let audioCtx = useRef<AudioContext>();

  function getAudioCtx() {
    if (audioCtx.current === undefined) {
      audioCtx.current = new AudioContext();
    }
    return audioCtx.current;
  }


  switch (playingState) {
    case PlayingState.Playing: {
      return (
        <span>
          {notes.filter(note => note.startSixteenth === beat).map(note =>
            <SingleNote key={"singlenote-"+note.name } note={note} audioCtx={getAudioCtx()!} />
          )}
        </span>
      )
    }
    default:
      break;
  }

  return null;
}

export default Sound;
