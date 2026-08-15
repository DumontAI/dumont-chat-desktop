// Copyright (c) 2015-2016 Yuya Ochiai
// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {BuildConfig} from 'types/config';

import {DEFAULT_ACADEMY_LINK, DEFAULT_HELP_LINK, DEFAULT_UPGRADE_LINK} from '../../common/constants';

// For detailed guides, please refer to https://docs.mattermost.com/deployment/desktop-app-deployment.html

/**
 * Build-time configuration. End-users can't change these parameters.
 * @prop {Object[]} defaultServers
 * @prop {string} defaultServers[].name - The view name for default server.
 * @prop {string} defaultServers[].url - The URL for default server.
 * @prop {string} defaultServers[].order - Sort order for server views (0, 1, 2)
 * @prop {string} helpLink - The URL for "Help->Learn More..." menu item.
 *                           If null is specified, the menu disappears.
 * @prop {boolean} enableServerManagement - Whether users can edit servers configuration.
 *                                          Specify at least one server for "defaultServers"
 *                                          when "enableServerManagement is set to false
 * @prop {[]} managedResources - Defines which paths are managed
 * @prop {[]} allowedProtocols - Defines which protocols should be automatically allowed
 */
const buildConfig: BuildConfig = {
    defaultServers: [
        {
            name: 'Dumont Chat',
            url: 'https://chat.getdumont.ai',
        },
    ],
    helpLink: DEFAULT_HELP_LINK,
    academyLink: DEFAULT_ACADEMY_LINK,
    upgradeLink: DEFAULT_UPGRADE_LINK,
    enableServerManagement: true,
    enableUpdateNotifications: true,
    // Version feed: a plain text file, <url>/latest.txt, holding the newest
    // version string. Served from the dumont.au static site. Upstream pointed
    // this at releases.mattermost.com, so accepting an update installed stock
    // Mattermost and silently reverted every bit of branding.
    updateNotificationURL: 'https://dumont.au/desktop',
    // We ship a direct DMG, not a Mac App Store build. Upstream sent macOS users
    // to Mattermost Desktop's App Store listing.
    macAppStoreUpdateURL: 'https://github.com/DumontAI/dumont-chat-desktop/releases',
    windowsStoreUpdateURL: 'https://github.com/DumontAI/dumont-chat-desktop/releases',
    linuxUpdateURL: 'https://github.com/DumontAI/dumont-chat-desktop/releases',
    linuxGitHubReleaseURL: 'https://github.com/DumontAI/dumont-chat-desktop/releases/tag/v',
    managedResources: ['trusted'],
    allowedProtocols: [
        'mattermost',
        'ftp',
        'mailto',
        'tel',
    ],
};

export default buildConfig;
