import { Image } from '../domain/image.domain';
import { ImageEntity } from './image.entity';
import { User } from '../../users/domain/user.domain';

describe('ImageEntity Test', () => {
  describe('from으로 Image에 대한 ImageEntity를 만들 수 있다.', () => {
    it('achievement가 비어있는 경우에도 from을 사용할 수 있다.', () => {
      // given
      const user = new User();
      const image = new Image(user, 'originalName', 'imageUrl');

      // when
      const imageEntity = ImageEntity.from(image);

      // then
      expect(imageEntity).toBeInstanceOf(ImageEntity);
      expect(imageEntity.id).toBe(image.id);
      expect(imageEntity.originalName).toBe(image.originalName);
      expect(imageEntity.imageUrl).toBe(image.imageUrl);
      expect(imageEntity.thumbnailUrl).toBeNull();
      expect(imageEntity.achievement).toBeNull();
    });
  });

  describe('toModel으로 ImageEntity를 Imaeg 도메인 객체로 변환할 수 있다.', () => {
    it('achievemnt가 비어있는 경우에도 toModel로 변환할 수 있다.', () => {
      // given
      const user = new User();
      const image = new Image(user, 'originalName', 'imageUrl');

      // when
      const imageEntity = ImageEntity.from(image);
      const result = imageEntity.toModel();

      // then
      expect(result).toBeInstanceOf(Image);
      expect(result.id).toBe(image.id);
      expect(result.user).toBeNull();
      expect(result.originalName).toBe(image.originalName);
      expect(result.imageUrl).toBe(image.imageUrl);
      expect(result.thumbnailUrl).toBeNull();
      expect(result.achievement).toBeNull();
    });
  });
});
