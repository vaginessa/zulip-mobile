/* @flow */
import type { Narrow, RenderedSectionDescriptor } from '../../types';
import type { BackgroundData } from '../MessageList';

import messageAsHtml from './messageAsHtml';
import messageHeaderAsHtml from './messageHeaderAsHtml';
import timeRowAsHtml from './timeRowAsHtml';
import { getGravatarFromEmail } from '../../utils/avatar';

export default (
  backgroundData: BackgroundData,
  narrow: Narrow,
  renderedMessages: RenderedSectionDescriptor[],
): string =>
  renderedMessages
    .reduce((list, section, index) => {
      list.push(messageHeaderAsHtml(backgroundData, narrow, section.message));

      section.data.forEach((item, idx) => {
        if (item.type === 'time') {
          list.push(timeRowAsHtml(item.timestamp, item.firstMessage));
        } else {
          const { message } = item;
          list.push(
            messageAsHtml(backgroundData, {
              id: message.id,
              isBrief: item.isBrief,
              fromName: message.sender_full_name,
              fromEmail: message.sender_email,
              content: message.match_content || message.content,
              timestamp: message.timestamp,
              avatarUrl: message.avatar_url || getGravatarFromEmail(message.sender_email),
              timeEdited: message.last_edit_timestamp,
              isOutbox: message.isOutbox,
              reactions: message.reactions,
            }),
          );
        }
      });

      return list;
    }, [])
    .join('');
