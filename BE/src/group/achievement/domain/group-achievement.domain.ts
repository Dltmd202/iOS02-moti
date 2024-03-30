import { GroupCategory } from '../../category/domain/group.category';
import { Group } from '../../group/domain/group.domain';
import { User } from '../../../users/domain/user.domain';
import { Image } from '../../../image/domain/image.domain';
import { GroupAchievementUpdate } from '../index';
import { Emoji } from '../../emoji/domain/emoji';

export class GroupAchievement {
  id: number;
  title: string;
  user: User;
  group: Group;
  groupCategory: GroupCategory;
  content: string;
  createdAt: Date;
  image: Image;
  likeEmojiCount: number;
  fireEmojiCount: number;
  smileEmojiCount: number;

  constructor(
    title: string,
    user: User,
    group: Group,
    groupCategory: GroupCategory,
    content: string,
    image: Image,
    likeEmojiCount: number,
    fireEmojiCount: number,
    smileEmojiCount: number,
  ) {
    this.title = title;
    this.user = user;
    this.group = group;
    this.groupCategory = groupCategory;
    this.content = content;
    this.image = image;
    this.likeEmojiCount = likeEmojiCount;
    this.fireEmojiCount = fireEmojiCount;
    this.smileEmojiCount = smileEmojiCount;
  }
  update(achievementUpdate: GroupAchievementUpdate) {
    this.title = achievementUpdate.title;
    this.content = achievementUpdate.content;
    this.groupCategory = achievementUpdate.category;
  }

  newEmoji(emoji: Emoji) {
    if (emoji === Emoji.LIKE) this.smileEmojiCount += 1;
    else if (emoji === Emoji.FIRE) this.fireEmojiCount += 1;
    else if (emoji === Emoji.SMILE) this.smileEmojiCount += 1;
  }

  removeEmoji(emoji: Emoji) {
    if (emoji === Emoji.LIKE) this.smileEmojiCount -= 1;
    else if (emoji === Emoji.FIRE) this.fireEmojiCount -= 1;
    else if (emoji === Emoji.SMILE) this.smileEmojiCount -= 1;
  }
}
