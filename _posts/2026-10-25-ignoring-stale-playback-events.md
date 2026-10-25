---
title: "Keeping old playback events out of the current track"
description: "A small state-management decision in Qingyin’s playback controller."
lang: en
sample: false
---

Switching tracks does not make every pending playback event disappear. A progress update or error from the previous track can arrive after the next one has started.

In Qingyin, playback events carry a load-generation identifier. The controller compares that identifier with the active generation before applying state changes, progress, end-of-stream events or errors. Events from an older generation are ignored.

The same idea protects asynchronous lyrics loading: a result for the previous track must not replace the lyrics for the current one.

This is a small boundary, but it makes ownership explicit. An event belongs to one load, rather than whichever track happens to be visible when the event arrives. The playback-controller tests cover stale progress, errors and lyrics results.

The implementation and its tests are in [Qingyin’s playback controller](https://github.com/Nook001/QingyinPlayer/blob/main/crates/ui_bridge/src/playback.rs).
