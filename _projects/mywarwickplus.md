---
title: myWarwickPlus
description: A native Android client for Warwick timetables, coursework and messages.
area: Android
featured: true
order: 2
sample: false
source_url: "https://github.com/Nook001/MyWarwickPlus"
---

## Overview

MyWarwickPlus is my independent, open-source Android client for University of Warwick students, built with Kotlin and Jetpack Compose.

It brings timetables, coursework deadlines and university messages into a compact native interface. Previously loaded information is cached on-device for offline access.

## Implementation

The main interface uses Compose; a WebView is reserved for Warwick’s official sign-in flow. The timetable repository separates cached data from refresh operations. Optional reminders and a home-screen widget provide quick access to upcoming classes.

This is a student project, independent of the University of Warwick.
