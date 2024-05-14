import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import axios from 'axios';
import CONSTANTS from '../../../../assets/CONSTANTS';
import { Player } from '../../../../../../types/general';

@Component({
  selector: 'app-lobby-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby-player.component.html',
})
export class LobbyPlayerComponent {
  players: Player[] = [];

  constructor(public gameService: GameService) {
    axios
      .post(`${CONSTANTS.API_BASE_URL}/players`, {
        gameId: this.gameService.gameId,
      })
      .then((response) => {
        this.players = response.data;

        this.gameService.socket?.on('playerJoin', (playerInfo) => {
          this.players.push(playerInfo);
        });

        this.gameService.socket?.on('playerLeave', (playerInfo) => {
          this.players = this.players.filter(
            (player) => player.socketId !== playerInfo.socketId
          );
        });

        this.gameService.socket?.on('playerKick', (playerInfo) => {
          this.players = this.players.filter(
            (player) => player.socketId !== playerInfo.socketId
          );

          if (playerInfo.socketId === this.gameService.socket?.id) {
            this.gameService.restartGame();
          }
        });
      });
  }
}
