import { Injectable } from '@angular/core';
import CONSTANTS from '../../assets/CONSTANTS';
import { io, Socket } from 'socket.io-client';
import { Toast } from '../types';
import { GameOptions, EventType } from '../types';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameId = '';
  gameCode = '12345';
  view:
    | 'home'
    | 'create'
    | 'join'
    | 'lobby-host'
    | 'lobby-player'
    | 'game-host'
    | 'game-player'
    | 'scoreboard'
    | 'cards' = 'home';
  toasts: Toast[] = [];
  gameOptions: GameOptions | null = null;
  extractedNumbers: number[] = [];
  lastExtractedNumbers: number[] = [];

  socket: Socket | null = null;

  connectWebSocket = () => {
    this.socket = io(CONSTANTS.WEBSOCKET_URL, {
      transports: ['websocket'],
    });

    this.socket.on(EventType.HostDisconnected, () => {
      this.showToast({
        type: 'error',
        text: `L'host della partita si è disconnesso`,
      });
      this.restartGame();
    });

    this.socket.on(EventType.StartGame, () => {
      if (this.view === 'lobby-host') this.view = 'game-host';
      else this.view = 'game-player';
    });
  };

  restartGame = () => {
    this.view = 'home';
    this.gameCode = '';
    this.gameId = '';
    this.gameOptions = null;
    this.extractedNumbers = [];
    this.lastExtractedNumbers = [];
  };

  showToast = (toast: Omit<Toast, 'toastId'>) => {
    const toastId = new Date().getTime().toString();

    if (this.toasts.length >= 4) {
      this.toasts = this.toasts.slice(1);
    }

    this.toasts.push({
      toastId,
      ...toast,
    });

    setTimeout(
      () => {
        this.toasts = this.toasts.filter((toast) => toast.toastId !== toastId);
      },
      toast.type === 'party' ? 10000 : 3000
    );
  };
}
