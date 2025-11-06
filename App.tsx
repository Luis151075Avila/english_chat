/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AgentEdit from './components/AgentEdit';
import ControlTray from './components/console/control-tray/ControlTray';
import ErrorScreen from './components/demo/ErrorSreen';
import KeynoteCompanion from './components/demo/keynote-companion/KeynoteCompanion';
import Header from './components/Header';
import UserSettings from './components/UserSettings';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { useUI } from './lib/state';

const API_KEY = process.env.API_KEY;

/**
 * Main application component that provides a streaming interface for Live API.
 * Manages video streaming state and provides controls for webcam/screen capture.
 */
function App() {
  const { showUserConfig, showAgentEdit } = useUI();

  if (!API_KEY) {
    return (
      <div className="App">
        <div
          className="error-screen"
          style={{
            transform: 'none',
            position: 'static',
            height: '100vh',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48 }}>🔑</div>
          <div
            className="error-message-container"
            style={{ fontSize: 22, lineHeight: 1.2, opacity: 0.8 }}
          >
            API Key Not Configured
          </div>
          <div
            className="error-raw-message-container"
            style={{
              fontSize: 15,
              lineHeight: 1.4,
              opacity: 0.6,
              marginTop: '16px',
            }}
          >
            The <code>API_KEY</code> environment variable is not set. Please
            ensure it is available in your execution environment for the
            application to connect to the Gemini API.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <LiveAPIProvider apiKey={API_KEY}>
        <ErrorScreen />
        <Header />

        {showUserConfig && <UserSettings />}
        {showAgentEdit && <AgentEdit />}
        <div className="streaming-console">
          <main>
            <div className="main-app-area">
              <KeynoteCompanion />
            </div>

            <ControlTray></ControlTray>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
