export interface Note {
    name: string;
    frequency: number;
  }
  
  export interface StandardTuning {
    [key: string]: number;
  }
  
  export interface TunerState {
    currentNote: string;
    targetFrequency: number;
    currentFrequency: number;
    inTune: boolean;
    detuneAmount: number;
  }