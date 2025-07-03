import { CreateLinkService } from '../create-link.service';

import { AliasAlreadyExistsException } from 'src/common/exceptions/AliasAlreadyExists.exception';
import { CreateLinkDto } from '../../../links/dto/create-link.dto';

const mockRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

const mockCodeGen = () => ({
  generateUniqueCode: jest.fn(),
});

const mockTimeService = () => ({
  expiresAt: jest.fn(),
});

describe('CreateLinkService', () => {
  let service: CreateLinkService;
  let repo: ReturnType<typeof mockRepo>;
  let config: ReturnType<typeof mockConfigService>;
  let codeGen: ReturnType<typeof mockCodeGen>;
  let timeService: ReturnType<typeof mockTimeService>;

  beforeEach(() => {
    repo = mockRepo();
    config = mockConfigService();
    codeGen = mockCodeGen();
    timeService = mockTimeService();

    service = new CreateLinkService(
      repo as any,
      config as any,
      codeGen as any,
      timeService as any,
    );
  });

  it('создаёт короткую ссылку без alias', async () => {
    const dto: CreateLinkDto = {
      originalUrl: 'https://example.com',
    };

    const fakeCode = 'abc123';
    const mockEntity = { code: fakeCode };
    codeGen.generateUniqueCode.mockResolvedValue(fakeCode);
    repo.create.mockReturnValue(mockEntity);
    config.get.mockReturnValue('http://localhost:3000');

    const result = await service.createShortLink(dto);

    expect(codeGen.generateUniqueCode).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledWith(mockEntity);
    expect(result).toBe(`http://localhost:3000/${fakeCode}`);
  });

  it('создаёт короткую ссылку с alias', async () => {
    const dto: CreateLinkDto = {
      originalUrl: 'https://example.com',
      alias: 'my-alias',
    };

    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue(dto);
    config.get.mockReturnValue('http://localhost:3000');

    const result = await service.createShortLink(dto);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { alias: 'my-alias' } });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toBe('http://localhost:3000/my-alias');
  });

  it('кидает ошибку, если alias уже существует', async () => {
    const dto: CreateLinkDto = {
      originalUrl: 'https://example.com',
      alias: 'used-alias',
    };

    repo.findOne.mockResolvedValue({ alias: 'used-alias' });

    await expect(service.createShortLink(dto)).rejects.toThrow(AliasAlreadyExistsException);
  });

  it('устанавливает expiresAt, если передан ttl', async () => {
    const dto: CreateLinkDto = {
      originalUrl: 'https://example.com',
      ttl: 1,
    };

    const fakeCode = 'abc123';
    const fakeDate = new Date('2099-12-31');

    codeGen.generateUniqueCode.mockResolvedValue(fakeCode);
    timeService.expiresAt.mockResolvedValue(fakeDate);
    repo.create.mockReturnValue({});
    config.get.mockReturnValue('http://localhost:3000');

    await service.createShortLink(dto);

    expect(timeService.expiresAt).toHaveBeenCalledWith(1);
    expect(repo.create.mock.calls[0][0].expiresAt).toBe(fakeDate);
  });

  it('использует fallback URL, если HOST не задан', async () => {
    const dto: CreateLinkDto = {
      originalUrl: 'https://example.com',
    };

    const fakeCode = 'abc123';
    codeGen.generateUniqueCode.mockResolvedValue(fakeCode);
    repo.create.mockReturnValue({});
    config.get.mockReturnValue(undefined); 

    const result = await service.createShortLink(dto);

    expect(result).toBe(`http://localhost:3000/${fakeCode}`);
  });
});
