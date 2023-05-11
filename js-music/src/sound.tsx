import React, { useRef, useEffect } from "react";

export enum PlayingState {
  Playing,
  Paused,
  Generating,
}

export interface WaveType {
  id: number;
  label: string;
  type: OscillatorType;
}
interface WaveTypeDictionary {
  [index: string]:  WaveType;
}
export const WaveTypes: WaveTypeDictionary = {
  SINE: {id: 0, label: "Sine", type: "sine"},
  SQUARE: {id: 1, label: "Square", type: "square"},
  SAwTOOTH: {id: 2, label: "Sawtooth", type: "sawtooth"},
  TRIANGLE: {id: 3, label: "Triangle", type: "triangle"},
} as const;

export enum NoteLength {
  Whole, Half, Quarter, Eighth, Sixteenth,
}

export interface NoteValue {
  name: string;
  frequency: number;
  startSixteenth?: number;
  duration?: number;
  gainLevel?: number;
  waveType?: WaveType;
}

export const noteEquals = (note: NoteValue) => (other: NoteValue) => 
      Math.floor(note.frequency) === Math.floor(other.frequency)
      && note.name === other.name
      && note.startSixteenth === other.startSixteenth;


interface SoundInput {
  playingState: PlayingState;
  notes: NoteValue[];
  bpm?: number;
  beat?: number;
}

function SingleNote({ note, audioCtx }
  : { note: NoteValue, audioCtx: AudioContext }) {

  useEffect(() => {
    let oscillator = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    gain.gain.exponentialRampToValueAtTime(note.gainLevel || 1, audioCtx.currentTime);
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.type = note.waveType?.type || "sine";
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

  function shouldSound(note: NoteValue) {
    return note.startSixteenth !== undefined && note.duration !== undefined && beat !== undefined &&
    beat >= note.startSixteenth && beat < note.startSixteenth + note.duration;
  }
  


  switch (playingState) {
    case PlayingState.Generating: {
      return (
        <span>
          {notes.map(note =>
            <SingleNote key={"singlenote-"+note.name } note={note} audioCtx={getAudioCtx()!} />
          )}
        </span>
      )
    }
    case PlayingState.Playing: {
      return (
        <span>
          {notes.filter(shouldSound).map(note =>
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
