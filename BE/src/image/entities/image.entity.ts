import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AchievementEntity } from '../../achievement/entities/achievement.entity';
import { Image } from '../domain/image.domain';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'image' })
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 200 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  thumbnailUrl: string;

  @OneToOne(() => AchievementEntity, { nullable: true })
  @JoinColumn({ name: 'achievement_id', referencedColumnName: 'id' })
  achievement: AchievementEntity;

  static from(image: Image): ImageEntity {
    const imageEntity = new ImageEntity();
    imageEntity.id = image.id;
    imageEntity.originalName = image.originalName;
    imageEntity.imageUrl = image.imageUrl;
    imageEntity.thumbnailUrl = image.thumbnailUrl;
    imageEntity.achievement = image.achievement
      ? AchievementEntity.from(image?.achievement)
      : null;
    return imageEntity;
  }

  toModel(): Image {
    const image = new Image(
      this.user?.toModel() || null,
      this.originalName,
      this.imageUrl,
    );
    image.id = this.id;
    image.achievement = this.achievement?.toModel() || null;
    image.thumbnailUrl = this.thumbnailUrl;
    return image;
  }
}
