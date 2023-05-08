import React, { useState, useRef } from "react";

export enum PlayingState {
  Playing,
  Paused,
}

export interface NoteValue {
  name: string;
  frequency: number;
}

interface SoundInput {
  playingState: PlayingState;
  notes: NoteValue[];
}

interface Context {
  audioCtx?: AudioContext;
  oscillators: OscillatorNode[];
}



function Sound({ playingState, notes }: SoundInput) {

  let context = useRef<Context>({ oscillators: [] });

  const compareApprox = (a: number) => (b: number) => a - 1 < b && a + 1 > b;

  const compareOscillator = (o: OscillatorNode) => (n: NoteValue) => {
    return compareApprox(o.frequency.value)(n.frequency);
  }

  const compareNote = (n: NoteValue) => (o: OscillatorNode) => {
    return compareApprox(n.frequency)(o.frequency.value);
  }

  function getAudioCtx() {
    if (context.current.audioCtx === undefined) {
      context.current.audioCtx = new AudioContext();
    }
    return context.current.audioCtx;
  }

  function createOscillator(note: NoteValue) {
    let oscillator = getAudioCtx()!.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;
    oscillator.connect(getAudioCtx()!.destination);
    oscillator.start();
    return oscillator;
  }

  function handlePlaying(): void {
    let newOscillators: OscillatorNode[] = [];

    // Create Oscillators for each missing note missing an oscillator.
    notes.forEach(note => {
      if (!context.current.oscillators.some(compareNote(note))) {
        newOscillators.push(createOscillator(note));
      }
    });

    // Add Oscillators for each oscillator already with a note.
    // Stop any oscillators that don't have a note.
    context.current.oscillators.forEach(oscillator => {
      if (!notes.some(compareOscillator(oscillator))) {
        oscillator.stop();
      } else {
        newOscillators.push(oscillator);
      }
    });

    context.current.oscillators = newOscillators;
  }

  function handlePaused(): void {
    context.current.oscillators.forEach(oscillator => {
      oscillator.stop();
    });
    context.current.oscillators = [];
  }

  switch (playingState) {
    case PlayingState.Playing:
      handlePlaying();
      break;
    case PlayingState.Paused:
      handlePaused();
      break;
    default:
      break;
  }

  return null;
}

export default Sound;