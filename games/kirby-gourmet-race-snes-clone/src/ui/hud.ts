import type { Mode } from '../entities/types';

export class Hud {
  private readonly panelTop: any;
  private readonly panelBottom: any;
  private readonly objectiveText: any;
  private readonly controlsText: any;
  private readonly statusText: any;

  constructor(scene: any) {
    this.panelTop = scene.add.rectangle(208, 14, 402, 24, 0x000000, 0.46).setDepth(3);
    this.panelBottom = scene.add.rectangle(208, 40, 402, 24, 0x000000, 0.42).setDepth(3);

    this.objectiveText = scene.add.text(10, 6, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#fff4d6'
    }).setDepth(4);

    this.controlsText = scene.add.text(10, 26, 'Move: Arrows/WASD  Dash: Space  Start/Restart: Enter', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#d9e7ff'
    }).setDepth(4);

    this.statusText = scene.add.text(10, 46, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#9ef8ff'
    }).setDepth(4);
  }

  public update(mode: Mode, score: number, target: number, hp: number, timeLeftMs: number, dashReady: boolean): void {
    const seconds = Math.max(0, Math.ceil(timeLeftMs / 1000));
    const lowTime = mode === 'play' && seconds <= 3;
    this.objectiveText.setColor(lowTime ? '#ffd1d1' : '#fff4d6');
    this.objectiveText.setText(`Objective: Collect ${target} treats. Score ${score}/${target}  HP ${hp}  Time ${seconds}s`);

    if (mode === 'start') {
      this.statusText.setColor('#ffe082');
      this.statusText.setText('Press Enter to race. Outscore the clock and avoid Chef Kawasaki.');
      return;
    }

    if (mode === 'play') {
      if (lowTime) {
        this.statusText.setColor('#ff9f9f');
        this.statusText.setText('HURRY: Final seconds. Prioritize direct lines to remaining treats.');
      } else {
        this.statusText.setColor(dashReady ? '#9ef8ff' : '#ffbe78');
        this.statusText.setText(dashReady ? 'Dash ready: burst between treats for cleaner lines.' : 'Dash cooling down...');
      }
      return;
    }

    if (mode === 'win') {
      this.statusText.setColor('#9dffac');
      this.statusText.setText('YOU WIN. Press Enter to race again.');
      return;
    }

    this.statusText.setColor('#ffadad');
    this.statusText.setText('YOU LOSE. Press Enter to restart.');
  }
}
