// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
const semver = require('semver');

const pkg = require('./package.json');

function getMacVersions() {
    const stableVersion = semver.coerce(pkg.version)?.version || pkg.version;
    let buildVersion = stableVersion;
    if (process.env.GITHUB_RUN_ID) {
        buildVersion = `${process.env.GITHUB_RUN_ID}${process.env.GITHUB_RUN_ATTEMPT || ''}`;
    } else {
        const match = pkg.version.match(/-[^.]+\.(\d+)$/);
        if (match) {
            buildVersion = match[1];
        }
    }
    return {bundleShortVersion: stableVersion, bundleVersion: buildVersion};
}

const config = {
    appId: 'ai.getdumont.chat',
    artifactName: '${version}/${name}-${version}-${os}-${arch}.${ext}',
    directories: {
        buildResources: 'src/assets',
        output: 'release',
    },
    extraMetadata: {
        main: 'index.js',
    },
    files: [
        '!node_modules/**/*',
        'node_modules/bindings/**/*',
        'node_modules/file-uri-to-path/**/*',
        'node_modules/macos-notification-state/**/*',
        'node_modules/windows-focus-assist/**/*',
        'node_modules/registry-js/**/*',
        'node_modules/cf-prefs/**/*',
        '!**/node_modules/macos-notification-state/bin/**/*',
        '!**/node_modules/macos-notification-state/build/**/*',
        '!**/node_modules/windows-focus-assist/bin/**/*',
        '!**/node_modules/windows-focus-assist/build/**/*',
        '!**/node_modules/registry-js/bin/**/*',
        '!**/node_modules/registry-js/build/**/*',
        '!**/node_modules/cf-prefs/bin/**/*',
        '!**/node_modules/cf-prefs/build/**/*',
        'node_modules/macos-notification-state/build/**/*.node',
        'node_modules/windows-focus-assist/build/Release/**/*.node',
        'node_modules/registry-js/build/Release/**/*.node',
        'node_modules/cf-prefs/build/Release/**/*.node',
        {
            from: 'dist',
            to: '.',
            filter: '**/*',
        },
    ],
    protocols: [
        {
            name: 'Mattermost',
            schemes: [
                'mattermost',
            ],
        },
    ],
    beforePack: 'scripts/beforepack.js',
    afterPack: 'scripts/afterpack.js',
    deb: {
        artifactName: '${version}/${name}_${version}-1_${arch}.${ext}',
        synopsis: 'Mattermost Desktop App',
        depends: [
            'libnotify4',
            'libxtst6',
            'libnss3',
        ],
        priority: 'optional',
    },
    asarUnpack: [
        './node_modules/macos-notification-state/build/Release/**/*.node',
        './node_modules/windows-focus-assist/build/Release/**/*.node',
        './node_modules/registry-js/build/Release/**/*.node',
        './node_modules/cf-prefs/build/Release/**/*.node',
    ],
    linux: {
        category: 'Network;InstantMessaging',
        target: [
            'deb',
            'tar.gz',
            'appimage',
            'rpm',
            'flatpak',
        ],
        appId: 'ai.getdumont.chat',
        extraFiles: [
            {
                filter: [
                    'LICENSE.txt',
                    'NOTICE.txt',
                ],
            },
            {
                from: 'src/assets/linux',
                filter: [
                    'create_desktop_file.sh',
                    'app_icon.png',
                    'README.md',
                ],
            },
        ],
    },
    appImage: {
        executableArgs: [' '],
    },
    mac: {
        artifactName: '${version}/${productName}-${version}-${arch}.${ext}',
        category: 'public.app-category.productivity',
        target: [
            'zip',
            'dmg',
        ],
        darkModeSupport: true,
        extraResources: [
            {
                filter: [
                    'LICENSE.txt',
                    'NOTICE.txt',
                ],
            },
        ],
        hardenedRuntime: true,
        gatekeeperAssess: true,
        entitlements: './resources/mac/entitlements.mac.plist',
        entitlementsInherit: './resources/mac/entitlements.mac.inherit.plist',
        extendInfo: {
            NSMicrophoneUsageDescription: 'Microphone access is used to capture audio for voice communication and recordings.',
            NSCameraUsageDescription: 'Camera access is used to capture video for video conferencing and recordings.',
            NSFocusStatusUsageDescription: 'Focus status is used by Dumont Chat to determine whether to send notifications or not.',
            LSFileQuarantineEnabled: true,
        },
        ...getMacVersions(),
    },
    mas: {
        entitlements: './resources/mac/entitlements.mas.plist',
        entitlementsInherit: './resources/mac/entitlements.mas.inherit.plist',
        entitlementsLoginHelper: './resources/mac/entitlements.mas.inherit.plist',
        provisioningProfile: './mas.provisionprofile',
        extendInfo: {
            ITSAppUsesNonExemptEncryption: false,
            NSUserActivityTypes: ['INSendMessageIntent'],
        },
        singleArchFiles: '*',
    },
    masDev: {
        provisioningProfile: './dev.provisionprofile',
    },
    dmg: {
        background: 'src/assets/osx/DMG_BG.tiff',
        contents: [
            {
                x: 180,
                y: 230,
            },
            {
                x: 480,
                y: 230,
                type: 'link',
                path: '/Applications',
            },
        ],
        iconSize: 100,
        iconTextSize: 14,
        window: {
            width: 660,
            height: 400,
        },
    },
    win: {
        target: [
            'zip',
            'msi',
        ],
        extraFiles: [
            {
                filter: [
                    'LICENSE.txt',
                    'NOTICE.txt',
                ],
            },
            {
                from: 'resources/windows/gpo',
                to: 'gpo',
            },
        ],
        signExts: ['.dll', '.node'],
        azureSignOptions: process.env.AZURE_CLIENT_ID ? {
            certificateProfileName: 'mattermost-desktop-app',
            codeSigningAccountName: 'DesktopAppCodeSigning',
            endpoint: 'https://eus.codesigning.azure.net',
            publisherName: 'CN="Mattermost, Inc.", O="Mattermost, Inc.", L=Palo Alto, S=California, C=US',
        } : null,
    },
    msi: {
        additionalWixArgs: ['-ext', 'WixUtilExtension'],
        upgradeCode: '{8523DAF0-699D-4CC7-9A65-C5E696A9DE6D}',
        perMachine: true,
    },
    rpm: {
        fpm: ['--rpm-rpmbuild-define', '_build_id_links none', '--rpm-digest=sha256'],
    },
    flatpak: {
        baseVersion: process.env.FLATPAK_BASE_VERSION || '25.08',
        runtimeVersion: process.env.FLATPAK_RUNTIME_VERSION || '25.08',
        useWaylandFlags: true,
    },
};

// Dumont: unsigned local builds (no Apple Developer cert yet).
// Restricted entitlements + hardened runtime break ad-hoc-signed launches, so strip them.
// Usage: NO_CODESIGN=1 CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac dmg zip --arm64 --publish=never
if (process.env.NO_CODESIGN) {
    // note: identity stays unset so electron-builder falls back to ad-hoc signing (arm64 requires a signature)
    config.mac.hardenedRuntime = false;
    config.mac.gatekeeperAssess = false;
    delete config.mac.entitlements;
    delete config.mac.entitlementsInherit;
}

if (process.env.CI_MAC_ZIP_ONLY) {
    config.mac.target = ['zip'];
    config.mac.gatekeeperAssess = false;
}

module.exports = config;
