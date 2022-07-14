export default interface ControllerInterface {
  on(): void;
  off(): void;
  quit(): void;
  setBPM(bpm: number): void;
  increase(): void;
  decrease(): void;
}
