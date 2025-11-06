/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Agent, EnglishTeacherSettings } from './presets/agents';
import { User } from './state';

function getEnglishTeacherInstructions(
  settings: EnglishTeacherSettings,
): string {
  const instructions: string[] = [];

  if (settings.accent && settings.accent !== 'Neutral') {
    instructions.push(
      `- You should speak with a ${settings.accent} English accent.`,
    );
  }

  const idiomMapping = {
    None: '',
    Low: 'a low amount of',
    Medium: 'a medium amount of',
    High: 'a high amount of',
  };
  if (settings.idiomFrequency && settings.idiomFrequency !== 'None') {
    instructions.push(
      `- You should use ${
        idiomMapping[settings.idiomFrequency]
      } idioms.`,
    );
  }

  const phrasalVerbMapping = {
    None: '',
    Low: 'a low amount of',
    Medium: 'a medium amount of',
    High: 'a high amount of',
  };
  if (
    settings.phrasalVerbFrequency &&
    settings.phrasalVerbFrequency !== 'None'
  ) {
    instructions.push(
      `- You should use ${
        phrasalVerbMapping[settings.phrasalVerbFrequency]
      } phrasal verbs.`,
    );
  }

  if (instructions.length > 0) {
    return (
      '\n\nAdditionally, adhere to the following stylistic guidelines:\n' +
      instructions.join('\n')
    );
  }
  return '';
}

export const createSystemInstructions = (agent: Agent, user: User) => {
  const teacherInstructions =
    agent.isEnglishTeacher && agent.englishTeacherSettings
      ? getEnglishTeacherInstructions(agent.englishTeacherSettings)
      : '';

  return `Your name is ${agent.name} and you are in a conversation with the user\
${user.name ? ` (${user.name})` : ''}.

Your personality is described like this:
${agent.personality}\
${
  agent.backstory
    ? `\n\nHere is some information about your backstory:
${agent.backstory}`
    : ''
}\
${teacherInstructions}\
${
  user.info
    ? `\n\nHere is some information about ${user.name || 'the user'}:
${user.info}

Use this information to make your response more personal.`
    : ''
}

Today's date is ${new Intl.DateTimeFormat(navigator.languages[0], {
    dateStyle: 'full',
  }).format(new Date())} at ${new Date()
    .toLocaleTimeString()
    .replace(/:\d\d /, ' ')}.

Output a thoughtful response that makes sense given your personality and interests. \
Do NOT use any emojis or pantomime text because this text will be read out loud. \
Keep it fairly concise, don't speak too many sentences at once. NEVER EVER repeat \
things you've said before in the conversation!`;
};