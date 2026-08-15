// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import loadingIcon from 'assets/loading_icon.png';

/**
 * The logo shown on the splash screen while the app loads.
 *
 * Upstream inlines a 176-line animated SVG of the Mattermost logo, which the
 * sibling SCSS animates by stroke length. There is no SVG of the Dumont mark,
 * and drawing one would put a second, slightly-wrong logo into the product, so
 * this renders the same PNG the app icon is generated from. The container fade
 * and scale in LoadingAnimation.scss still apply; only the stroke-draw effect,
 * which was specific to the upstream paths, is lost.
 */
function LoadingAnimation() {
    return (
        <img
            src={loadingIcon}
            width={104}
            height={104}
            alt=''
            draggable={false}
        />
    );
}

export default LoadingAnimation;
