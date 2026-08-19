// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import fs from 'fs';
import path from 'path';

/**
 * Guards the one coupling that hangs the whole app on the splash screen.
 *
 * LoadingAnimation.tsx will not leave the loading state until it sees an
 * `animationend` event named `LoadingAnimation__compass-shrink`. That keyframe
 * is only attached by LoadingAnimation.scss to `.LoadingAnimation__compass`.
 * So whatever LoadingIcon renders has to carry that class, or the app shows the
 * splash forever with no error anywhere.
 *
 * This is a static check rather than a render test because this project's jest
 * testMatch only picks up .ts/.js and there is no React testing library. It is
 * a smoke check, not a behavioural one, but it fails on the exact mistake that
 * shipped in v6.2.2-dumont.1.
 */
const dir = __dirname;
const CLASS = 'LoadingAnimation__compass';
const ANIMATION = 'LoadingAnimation__compass-shrink';

describe('LoadingIcon splash handoff contract', () => {
    const icon = fs.readFileSync(path.join(dir, 'LoadingIcon.tsx'), 'utf8');
    const scss = fs.readFileSync(path.join(dir, 'LoadingAnimation.scss'), 'utf8');
    const animation = fs.readFileSync(path.join(dir, 'LoadingAnimation.tsx'), 'utf8');

    it('renders an element carrying the class the shrink keyframe targets', () => {
        expect(icon).toContain(CLASS);
    });

    it('still has a stylesheet rule attaching the keyframe to that class', () => {
        expect(scss).toContain(`.${CLASS} {`);
        expect(scss).toContain(ANIMATION);
    });

    it('still gates the splash on that animation name', () => {
        expect(animation).toContain(ANIMATION);
    });
});
