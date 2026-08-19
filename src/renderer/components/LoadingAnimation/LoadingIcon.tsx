// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import loadingIcon from 'assets/loading_icon.png';

/**
 * The logo shown on the splash screen while the app loads.
 *
 * Upstream inlines a 176-line animated SVG of the Mattermost logo. There is no
 * SVG of the Dumont mark, and drawing one would put a second, slightly-wrong
 * logo into the product, so this renders the same PNG the app icon is generated
 * from.
 *
 * CONTRACT, do not remove: the className MUST stay `LoadingAnimation__compass`.
 * LoadingAnimation.tsx gates the whole splash on an `animationend` event named
 * `LoadingAnimation__compass-shrink`, and LoadingAnimation.scss only attaches
 * that keyframe to `.LoadingAnimation--loading .LoadingAnimation__compass`.
 * Without the class no animation runs, the event never fires,
 * `loadingAnimationComplete` stays false, and the app hangs on the splash
 * screen forever. That shipped once in v6.2.2-dumont.1.
 *
 * The keyframe only animates `transform: scale3D`, so it applies cleanly to an
 * img. What is lost versus upstream is the stroke-draw effect, which animated
 * the SVG's own paths.
 */
function LoadingAnimation() {
    return (
        <img
            className='LoadingAnimation__compass'
            src={loadingIcon}
            width={104}
            height={104}
            alt=''
            draggable={false}
        />
    );
}

export default LoadingAnimation;
