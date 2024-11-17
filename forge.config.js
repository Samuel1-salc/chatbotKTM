const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const { getUnpackedSettings } = require('http2');
const path = require('path');
module.exports = {
  packagerConfig: {
    name: 'chatbotfama',
    asar:{unpack: '**/*.node'},
    
  },

  extraResources: [
    {
      from: path.join(__dirname, 'node_modules/puppeteer-core/.local-chromium/'),
      to: 'node_modules/puppeteer-core/.local-chromium',
      filter: ['**/*'],
    }
  ],
  rebuildConfig: {
    force: true, // Força a reconstrução de todos os módulos nativos
    // Defina a versão do Electron com a qual os módulos nativos serão reconstruídos
    electronVersion: '33.2.0', // Substitua pela versão do Electron que você está usando

    // Configurações para módulos específicos que você deseja reconstruir
    forceRebuildModules: ['puppeteer', 'puppeteer-core'],
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'chatbotfama', 
        iconUrl: 'C:\\Desenvolvimento\\APP\\Nova_pasta\\chatbotfama\\src\\imagens\\desktop.ico', 
        setupIcon: 'C:\\Desenvolvimento\\APP\\Nova_pasta\\chatbotfama\\src\\imagens\\janela.ico', // Ícone do instalador
        description: 'Chatbot Fama', // Descrição do aplicativo
        authors: 'samuel - Fama', // Autor do aplicativo
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [],
    },
    {
      name: '@electron-forge/maker-deb',
      config: { },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: { },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: true,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};
