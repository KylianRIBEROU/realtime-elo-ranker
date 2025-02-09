import { Test, TestingModule } from '@nestjs/testing';
import { MatchsController } from './matchs.controller';
import { PlayersService } from '../players/players.service';
import { MatchsService } from './matchs.service';
import { Response } from 'express';

describe('MatchsController', () => {
  let controller: MatchsController;
  let playersServiceMock: any;
  let matchsServiceMock: any;
  let responseMock: any;

  beforeEach(async () => {
    playersServiceMock = {
      findOne: jest.fn(),
    };

    matchsServiceMock = {
      registerMatchResult: jest.fn().mockResolvedValue({
        winnerDto: { id: 'winnerId', rank: 1300 },
        loserDto: { id: 'loserId', rank: 1000 },
      }),
    };

    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchsController],
      providers: [
        { provide: PlayersService, useValue: playersServiceMock },
        { provide: MatchsService, useValue: matchsServiceMock },
      ],
    }).compile();

    controller = module.get<MatchsController>(MatchsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 if fields are missing', async () => {
    await controller.publishMatchResult({ winner: '', loser: '', draw: false}, responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(responseMock.json).toHaveBeenCalledWith({
      code: 400,
      message: 'Les champs winner, loser et draw sont obligatoires.',
    });
  });

  it('should return 400 if winner and loser are the same', async () => {
    await controller.publishMatchResult({ winner: 'player1', loser: 'player1', draw: false }, responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(responseMock.json).toHaveBeenCalledWith({
      code: 400,
      message: 'Les champs winner et loser ne peuvent pas être identiques.',
    });
  });

  it('should return 422 if a player does not exist', async () => {
    playersServiceMock.findOne.mockReturnValue(null);

    await controller.publishMatchResult({ winner: 'player1', loser: 'player2', draw: false }, responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(422);
    expect(responseMock.json).toHaveBeenCalledWith({
      code: 422,
      message: "Soit le gagnant, soit le perdant indiqué n'existe pas.",
    });
  });

  it('should call MatchsService and return match results', async () => {
    playersServiceMock.findOne.mockReturnValue({ id: 'player1' });

    await controller.publishMatchResult({ winner: 'winnerId', loser: 'loserId', draw: false }, responseMock);

    expect(matchsServiceMock.registerMatchResult).toHaveBeenCalledWith('winnerId', 'loserId', false);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.json).toHaveBeenCalledWith({
      winner: { id: 'winnerId', rank: 1300 },
      loser: { id: 'loserId', rank: 1000 },
    });
  });
});
