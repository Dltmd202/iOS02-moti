import { Injectable } from '@nestjs/common';
import { GroupAchievementEmojiRepository } from '../entities/group-achievement-emoji.repository';
import { Transactional } from '../../../config/transaction-manager';
import { User } from '../../../users/domain/user.domain';
import { Emoji } from '../domain/emoji';
import { GroupAchievementRepository } from '../../achievement/entities/group-achievement.repository';
import { UnauthorizedAchievementException } from '../../../achievement/exception/unauthorized-achievement.exception';
import { GroupAchievementEmoji } from '../domain/group-achievement-emoji.domain';
import { UserGroupRepository } from '../../group/entities/user-group.repository';
import { NoSuchGroupUserException } from '../../achievement/exception/no-such-group-user.exception';
import { GroupAchievementEmojiResponse } from '../dto/group-achievement-emoji-response';
import { CompositeGroupAchievementEmoji } from '../dto/composite-group-achievement-emoji';

@Injectable()
export class GroupAchievementEmojiService {
  constructor(
    private readonly groupAchievementEmojiRepository: GroupAchievementEmojiRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly groupAchievementRepository: GroupAchievementRepository,
  ) {}

  @Transactional()
  async toggleAchievementEmoji(
    user: User,
    groupId: number,
    achievementId: number,
    emoji: Emoji,
  ) {
    await this.validateUserGroup(user, groupId);
    const groupAchievement =
      await this.getGrouAchievementForUpdate(achievementId);
    const groupAchievementEmoji =
      await this.groupAchievementEmojiRepository.getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
        groupAchievement.id,
        user,
        emoji,
      );

    if (groupAchievementEmoji) {
      await this.groupAchievementEmojiRepository.deleteGroupAchievementEmoji(
        groupAchievementEmoji,
      );
      return GroupAchievementEmojiResponse.of(emoji, false);
    } else {
      const newGroupAchievementEmoji = new GroupAchievementEmoji(
        groupAchievement,
        user,
        emoji,
      );
      await this.groupAchievementEmojiRepository.saveGroupAchievementEmoji(
        newGroupAchievementEmoji,
      );
      return GroupAchievementEmojiResponse.of(emoji, true);
    }
  }

  @Transactional({ readonly: true })
  async getGroupAchievementEmojiCount(
    user: User,
    groupId: number,
    groupAchievementId: number,
  ): Promise<CompositeGroupAchievementEmoji> {
    await this.validateUserGroup(user, groupId);
    await this.validateGroupAchievement(groupId, groupAchievementId);
    const groupAchievement = await this.getGroupAchievement(
      groupId,
      groupAchievementId,
    );
    const emojis =
      await this.groupAchievementEmojiRepository.getGroupAchievementEmojisByGroupAchievementIdAndUserAndEmoji(
        groupAchievementId,
        user,
      );
    const like = emojis.find((it) => it.emoji === Emoji.LIKE);
    const smile = emojis.find((it) => it.emoji === Emoji.SMILE);
    const fire = emojis.find((it) => it.emoji === Emoji.FIRE);

    return CompositeGroupAchievementEmoji.ofGroupAchievement(
      groupAchievement,
      like,
      fire,
      smile,
    );
  }

  private async getGrouAchievementForUpdate(achievementId: number) {
    const groupAchievement =
      await this.groupAchievementRepository.findByIdForUpdate(achievementId);
    if (!groupAchievement) throw new UnauthorizedAchievementException();
    return groupAchievement;
  }

  private async getGroupAchievement(groupId: number, achievementId: number) {
    const grouopAchievement =
      await this.groupAchievementRepository.findOneByIdAndGroupId(
        achievementId,
        groupId,
      );
    if (!grouopAchievement) throw new UnauthorizedAchievementException();
    return grouopAchievement;
  }

  private async validateGroupAchievement(
    groupId: number,
    achievementId: number,
  ) {
    await this.getGroupAchievement(groupId, achievementId);
  }

  private async validateUserGroup(user: User, groupId: number) {
    const userGroup =
      await this.userGroupRepository.findOneByUserCodeAndGroupId(
        user.userCode,
        groupId,
      );
    if (!userGroup) throw new NoSuchGroupUserException();
  }
}
