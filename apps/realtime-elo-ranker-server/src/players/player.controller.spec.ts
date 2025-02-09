import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Response } from 'express';

describe('PlayersController', () => {
  let controller: PlayersController;
  let serviceMock: any;
  let responseMock: any;

  beforeEach(async () => {
    serviceMock = {
      findOne: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 'Kyks', rank: 1000 }),
    };

    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [{ provide: PlayersService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 if id is invalid', async () => {
    await controller.createPlayer({ id: '' }, responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(responseMock.json).toHaveBeenCalledWith({
      code: 400,
      message: "L'identifiant du joueur n'est pas valide.",
    });
  });

  it('should return 409 if player already exists', async () => {
    serviceMock.findOne.mockResolvedValue({ id: 'Kyks', rank: 1000 });

    await controller.createPlayer({ id: 'Kyks' }, responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(409);
    expect(responseMock.json).toHaveBeenCalledWith({
      code: 409,
      message: 'Le joueur existe déjà.',
    });
  });

  it('should create a player and return it', async () => {
    serviceMock.create.mockResolvedValue({ id: 'Kyks', rank: 1000 });
  
    await controller.createPlayer({ id: 'Kyks' }, responseMock);
  
    expect(serviceMock.create).toHaveBeenCalledWith('Kyks');
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.json).toHaveBeenCalledWith({
      playerResponse: { id: 'Kyks', rank: 1000 },
    });
  });
});  
