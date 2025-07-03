// import { Test, TestingModule } from '@nestjs/testing';

// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { LinkEntity } from '../../entities/link.entity';
// import { LinkService } from '../links.service';


// const now = new Date();

// const mockLinks: Partial<LinkEntity>[] = [
//   {
//     id: 1,
//     code: 'live1',
//     alias: null,
//     originalUrl: 'https://example.com/live1',
//     expiresAt: null,
//     createdAt: now,
//     totalClicks: 0,
//   },
//   {
//     id: 2,
//     code: 'live2',
//     alias: null,
//     originalUrl: 'https://example.com/live2',
//     expiresAt: new Date(now.getTime() + 1000 * 60 * 60),
//     createdAt: now,
//     totalClicks: 0,
//   },
// ];

// describe('LinkService TTL', () => {
//   let service: LinkService;
//   let repo: Repository<LinkEntity>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LinkService,
//         {
//           provide: getRepositoryToken(LinkEntity),
//           useValue: {
//             createQueryBuilder: jest.fn(() => ({
//               where: jest.fn().mockReturnThis(),
//               orWhere: jest.fn().mockReturnThis(),
//               orderBy: jest.fn().mockReturnThis(),
//               getMany: jest.fn().mockResolvedValue(
//                 mockLinks.filter((link) => {
//                   return !link.expiresAt || link.expiresAt.getTime() > now.getTime();
//                 }),
//               ),
//             })),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//     repo = module.get<Repository<LinkEntity>>(getRepositoryToken(LinkEntity));
//   });

//   it('возвращает только активные ссылки (не просроченные)', async () => {
//     const links = await service.getLinks();
//     expect(links).toHaveLength(2);
//     expect(links.find((l) => l.code === 'expired')).toBeUndefined();
//   });

//     it('кидает исключение, если активных ссылок нет', async () => {
//         jest.spyOn(repo, 'createQueryBuilder').mockReturnValueOnce({
//             where: jest.fn().mockReturnThis(),
//             orWhere: jest.fn().mockReturnThis(),
//             orderBy: jest.fn().mockReturnThis(),
//             getMany: jest.fn().mockResolvedValue([]),
//         } as any);

//         await expect(service.getLinks()).rejects.toThrow('не найдена');

//     });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { LinkService } from '../links.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkEntity } from '../../entities/link.entity';

describe('LinkService TTL', () => {
  let service: LinkService;
  let repo: jest.Mocked<Repository<LinkEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        {
          provide: getRepositoryToken(LinkEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LinkService>(LinkService);
    repo = module.get(getRepositoryToken(LinkEntity));
  });

  it('возвращает только активные ссылки (не просроченные)', async () => {
    const now = new Date();
    const mockLinks: LinkEntity[] = [
      {
        id: 1,
        code: 'active',
        alias: null,
        originalUrl: 'https://active.com',
        expiresAt: new Date(now.getTime() + 10000),
        createdAt: now,
        totalClicks: 0,
      },
    ];

    repo.find.mockResolvedValue(mockLinks);

    const result = await service.getLinks();
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('active');
  });

  it('кидает исключение, если активных ссылок нет', async () => {
    repo.find.mockResolvedValue([]);

    await expect(service.getLinks()).rejects.toThrow('Нету ссылок в сервисе');

  });
});
