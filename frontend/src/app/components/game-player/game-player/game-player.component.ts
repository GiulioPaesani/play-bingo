import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import axios from 'axios';
import CONSTANTS from '../../../../assets/CONSTANTS';
import { Card, FormattedCard, Player } from '../../../../../../types';

@Component({
  selector: 'app-game-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-player.component.html',
})
export class GamePlayerComponent {
  players: Player[] = [];
  cards: Card[] = [];
  formattedCards: FormattedCard[] = [];
  automaticInsert = false;
  numbersCheck = true;

  constructor(public gameService: GameService) {
    axios
      .post(`${CONSTANTS.API_BASE_URL}/players`, {
        gameId: this.gameService.gameId,
      })
      .then((response) => {
        this.players = response.data;
      });

    axios
      .post(`${CONSTANTS.API_BASE_URL}/cards`, {
        gameId: this.gameService.gameId,
        socketId: this.gameService.socket?.id,
      })
      .then((response) => {
        console.log(response.data);
        this.cards = response.data.cards;
        this.formattedCards = response.data.formattedCards;
      });
  }

  toggleGameOptions = () => {
    this.automaticInsert = (
      document.getElementById('automaticInsert') as HTMLInputElement
    ).checked;
    this.numbersCheck = (
      document.getElementById('numbersCheck') as HTMLInputElement
    ).checked;
  };

  toggleNumber = (cardIndex: number, number: number) => {
    if (number === 0) return;

    this.cards[cardIndex][number] = !this.cards[cardIndex][number];
  };
}
