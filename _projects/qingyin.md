---
title: Qingyin
description: A Chinese-first local music player for Linux, built with Rust and Qt.
area: Desktop / Audio
featured: true
order: 3
sample: false
source_url: "https://github.com/Nook001/QingyinPlayer"
---

## Overview

Qingyin (清音) is my native Linux music player, with Rust domain logic, a Qt Quick/QML interface, GStreamer playback and a SQLite music library.

The player imports local music, supports pinyin search and sorting, browses artists and albums, and displays local lyrics. A compact lyrics capsule offers an alternative to the full library window.

## Implementation

Playback runs on a dedicated GLib thread, while scanning and search work stay off the UI thread. Playback events carry a generation identifier so that results from a previous track cannot overwrite the current session.

The project is in development. Desktop media controls through MPRIS are not connected yet.
