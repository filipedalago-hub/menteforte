import { useState } from 'react';
import { Bell, Shield, Palette, Check, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Theme = 'light' | 'dark' | 'auto';

type UserSettings = {
  theme: Theme;
  dailyReminders: boolean;
  achievementNotifications: boolean;
  reminderTime: string;
};

const STORAGE_KEY = 'menteforte_settings';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  dailyReminders: true,
  achievementNotifications: true,
  reminderTime: '09:00',
};

function loadSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    console.error('Failed to load settings');
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    console.error('Failed to save settings');
  }
}

export function SettingsPage() {
  const { profile, updateProfile } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      setSaveMessage('Nome nao pode estar vazio');
      return;
    }

    setIsSavingName(true);
    try {
      await updateProfile({ display_name: displayName.trim() });
      setIsEditingName(false);
      setSaveMessage('Nome atualizado com sucesso');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Erro ao atualizar nome');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setSaveMessage('Configuracoes restauradas');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Configuracoes</h1>
        <button
          onClick={handleResetSettings}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Restaurar padrao</span>
        </button>
      </div>

      {saveMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg md:text-xl font-bold">Conta</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              {isEditingName ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                    >
                      {isSavingName ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => {
                        setDisplayName(profile?.display_name || '');
                        setIsEditingName(false);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={profile?.display_name || ''}
                    disabled
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                O email nao pode ser alterado.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg md:text-xl font-bold">Notificacoes</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.dailyReminders}
                  onChange={(e) => updateSetting('dailyReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <div>
                <p className="font-medium">Lembretes Diarios</p>
                <p className="text-sm text-gray-600">Receba lembretes para manter sua sequencia</p>
              </div>
            </label>

            {settings.dailyReminders && (
              <div className="ml-14">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario do lembrete
                </label>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSetting('reminderTime', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.achievementNotifications}
                  onChange={(e) => updateSetting('achievementNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <div>
                <p className="font-medium">Conquistas</p>
                <p className="text-sm text-gray-600">Notificacoes ao desbloquear novas conquistas</p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-lg md:text-xl font-bold">Aparencia</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Escuro' },
                  { value: 'auto', label: 'Auto' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting('theme', option.value as Theme)}
                    className={`
                      relative px-3 md:px-4 py-3 border-2 rounded-lg font-medium transition-all text-sm md:text-base
                      ${settings.theme === option.value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {option.label}
                    {settings.theme === option.value && (
                      <Check className="absolute top-1 right-1 w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                O modo automatico segue as configuracoes do seu dispositivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
