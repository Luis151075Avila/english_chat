/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useRef } from 'react';
import {
  Agent,
  AGENT_COLORS,
  EnglishTeacherSettings,
  INTERLOCUTOR_VOICE,
  INTERLOCUTOR_VOICES,
} from '../lib/presets/agents';
import Modal from './Modal';
import c from 'classnames';
import { useAgent, useUI } from '../lib/state';

export default function EditAgent() {
  const agent = useAgent(state => state.current);
  const updateAgent = useAgent(state => state.update);
  const nameInput = useRef(null);
  const { setShowAgentEdit } = useUI();

  function onClose() {
    setShowAgentEdit(false);
  }

  function updateCurrentAgent(adjustments: Partial<Agent>) {
    updateAgent(agent.id, adjustments);
  }

  function updateTeacherSettings(
    adjustments: Partial<EnglishTeacherSettings>,
  ) {
    updateCurrentAgent({
      englishTeacherSettings: {
        ...agent.englishTeacherSettings!,
        ...adjustments,
      },
    });
  }

  function renderTeacherSettings() {
    if (!agent.isEnglishTeacher || !agent.englishTeacherSettings) {
      return null;
    }

    const settings = agent.englishTeacherSettings;

    return (
      <details className="teacherSettings">
        <summary>Customize Teacher Persona</summary>
        <div className="settings-content">
          <div className="setting-row">
            <label htmlFor="accent-select">Accent</label>
            <select
              id="accent-select"
              value={settings.accent}
              onChange={e =>
                updateTeacherSettings({
                  accent: e.target.value as EnglishTeacherSettings['accent'],
                })
              }
            >
              <option value="American">American</option>
              <option value="British">British</option>
              <option value="Australian">Australian</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
          <div className="setting-row">
            <label htmlFor="idioms-select">Use of Idioms</label>
            <select
              id="idioms-select"
              value={settings.idiomFrequency}
              onChange={e =>
                updateTeacherSettings({
                  idiomFrequency: e.target
                    .value as EnglishTeacherSettings['idiomFrequency'],
                })
              }
            >
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="setting-row">
            <label htmlFor="phrasal-verbs-select">Use of Phrasal Verbs</label>
            <select
              id="phrasal-verbs-select"
              value={settings.phrasalVerbFrequency}
              onChange={e =>
                updateTeacherSettings({
                  phrasalVerbFrequency: e.target
                    .value as EnglishTeacherSettings['phrasalVerbFrequency'],
                })
              }
            >
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </details>
    );
  }

  return (
    <Modal onClose={() => onClose()}>
      <div className="editAgent">
        <div>
          <form>
            <div>
              <input
                className="largeInput"
                type="text"
                placeholder="Name"
                value={agent.name}
                onChange={e => updateCurrentAgent({ name: e.target.value })}
                ref={nameInput}
              />
            </div>

            <div>
              <label>
                Personality
                <textarea
                  value={agent.personality}
                  onChange={e =>
                    updateCurrentAgent({ personality: e.target.value })
                  }
                  rows={7}
                  placeholder="How should I act? Whatʼs my purpose? How would you describe my personality?"
                />
              </label>
            </div>
            <div>
              <label>
                Backstory
                <textarea
                  value={agent.backstory}
                  onChange={e =>
                    updateCurrentAgent({ backstory: e.target.value })
                  }
                  rows={5}
                  placeholder="What's my history? Where do I come from?"
                />
              </label>
            </div>
            {renderTeacherSettings()}
          </form>
        </div>

        <div>
          <div>
            <ul className="colorPicker">
              {AGENT_COLORS.map((color, i) => (
                <li
                  key={i}
                  className={c({ active: color === agent.bodyColor })}
                >
                  <button
                    style={{ backgroundColor: color }}
                    onClick={() => updateCurrentAgent({ bodyColor: color })}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="voicePicker">
            Voice
            <select
              value={agent.voice}
              onChange={e => {
                updateCurrentAgent({
                  voice: e.target.value as INTERLOCUTOR_VOICE,
                });
              }}
            >
              {INTERLOCUTOR_VOICES.map(voice => (
                <option key={voice} value={voice}>
                  {voice}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={() => onClose()} className="button primary">
          Let’s go!
        </button>
      </div>
    </Modal>
  );
}
