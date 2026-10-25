---
title: Dynamic Shader
description: Dynamic lighting, shadows and water effects for Stardew Valley.
area: Graphics
featured: true
order: 1
sample: false
source_url: ""
project_url: "https://www.nexusmods.com/stardewvalley/mods/40775"
---

## Overview

Dynamic Shader is my rendering mod for Stardew Valley. It adds time-dependent shadows, bloom, vegetation wind, tilt-shift and custom water reflections through SMAPI, Harmony and HLSL effects.

## Rendering work

The rendering pipeline separates object collection, shadow preparation and post-processing. Water reflections use selected scene elements rather than mirroring the whole scene.

My work includes render-target management, cached static shadows, request batching and reducing unnecessary rendering work. Performance depends on the scene, resolution and configuration.

The mod is available on Nexus Mods; the source repository is private.
