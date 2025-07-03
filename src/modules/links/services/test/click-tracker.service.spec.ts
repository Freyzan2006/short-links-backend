import { ClickTrackerService } from '../click-tracker.service';
import { Repository } from 'typeorm';
import { LinkEntity } from '../../entities/link.entity';

describe('ClickTrackerService', () => {
  let service: ClickTrackerService;
  let mockRepo: jest.Mocked<Repository<LinkEntity>>;

  beforeEach(() => {
    mockRepo = {
      increment: jest.fn(),
      findOne: jest.fn().mockResolvedValue({ id: 1 }), // ← возвращает "найденную" ссылку
    } as any;

    service = new ClickTrackerService(mockRepo);
  });

  it('должен вызывать increment с кодом ссылки', async () => {
    const code = 'abc123';

    await service.incrementClick(code);

    // Ждём следующую итерацию event loop, чтобы дождаться выполнения setImmediate
    await new Promise((resolve) => setImmediate(resolve));

    expect(mockRepo.increment).toHaveBeenCalledWith(
        { id: 1 },
        'totalClicks',
        1,
    );

  });
});
