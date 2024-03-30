import { GroupAchievementEmojiListElement } from './group-achievement-emoji-list-element';
import { Emoji } from '../domain/emoji';
import { GroupAchievement } from '../../achievement/domain/group-achievement.domain';
import { GroupAchievementEmoji } from '../domain/group-achievement-emoji.domain';

export class CompositeGroupAchievementEmoji {
  LIKE: GroupAchievementEmojiListElement;
  FIRE: GroupAchievementEmojiListElement;
  SMILE: GroupAchievementEmojiListElement;

  static of(metatdata: GroupAchievementEmojiListElement[]) {
    const response = new CompositeGroupAchievementEmoji();
    response.LIKE =
      metatdata?.find((meta) => meta.id === Emoji.LIKE) ||
      GroupAchievementEmojiListElement.noEmoji(Emoji.LIKE);
    response.FIRE =
      metatdata?.find((meta) => meta.id === Emoji.FIRE) ||
      GroupAchievementEmojiListElement.noEmoji(Emoji.FIRE);
    response.SMILE =
      metatdata?.find((meta) => meta.id === Emoji.SMILE) ||
      GroupAchievementEmojiListElement.noEmoji(Emoji.SMILE);
    return response;
  }

  static ofGroupAchievement(
    groupAchievement: GroupAchievement,
    like: GroupAchievementEmoji,
    fire: GroupAchievementEmoji,
    smile: GroupAchievementEmoji,
  ) {
    const response = new CompositeGroupAchievementEmoji();
    response.LIKE = GroupAchievementEmojiListElement.likeEmoji(
      groupAchievement,
      like,
    );
    response.FIRE = GroupAchievementEmojiListElement.fireEmoji(
      groupAchievement,
      fire,
    );
    response.SMILE = GroupAchievementEmojiListElement.smileEmoji(
      groupAchievement,
      smile,
    );
    return response;
  }

  toResponse(): GroupAchievementEmojiListElement[] {
    return [this.LIKE, this.FIRE, this.SMILE];
  }
}
