# Planner LTI

A more planner-oriented Canvas calendar view for students and teachers

## Overview

This LTI provides an alternative calendar view in canvas for students and teachers.

![Student view](https://raw.githubusercontent.com/groton-school/planner-lti/refs/heads/main/docs/student-view.png)

In it, students can (1) check off assignments as complete or incomplete and track their todos ((2) undated assignments and planner items). This is an alternative to the default calendar's approach of "now you see it, now you don't" when you mark a to do item as complete. (3) All of this is overlaid on the schedule of class meetings, color-coded based on the user's course color settings in Canvas.

![Student view](https://raw.githubusercontent.com/groton-school/planner-lti/refs/heads/main/docs/teacher-view.png)

For teachers, this provides a similar view, with the addition that, when clicking on a class meeting (3), a teacher is able to (1) instantly create an assignment due at the start or end of the class period. (2) By default this assignment is ungraded, but -- as in the standard calendar view -- the teacher can choose _More Options_ to add more detail (including grading information).

## Prerequisites

In order to provide the class schedule overlay, the class meetings are pulled from a Google Calendar that contains all class meetings for all students and teachers. We just happen to have such a calendar because we use [SchoolCal](https://schoolcal.co) to sync this information out of our SIS and into student and teacher Google Calendars.

The app is built to run on Google App Engine storing its data in Firestore (although it could easily be adapted to run on other cloud services: look in [/src/Infrastructure](./src/Infrastructure) for implementation details and [/app/dependencies.php](./app/dependencies.php), [/app/repositories.php](./app/repositories.php), and [/app/settings.php](./app/settings.php) for configuration details).

To set this up you will need:

1. A Google account with access to create billable Cloud Projects (and a billing account)
2. A Canvas admin account that can create developer keys and configure LTI apps
3. A computer [Node](https://nodejs.) and [gcloud](https://cloud.google.com/sdk/docs/install) installed.
4. Make sure that `gcloud` is [initialized](https://cloud.google.com/sdk/docs/initializing) and [authorized](https://cloud.google.com/sdk/docs/authorizing).
5. (Optional) I prefer [pnpm](https://pnpm.io/) over Node's built in [npm](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) package manager.
6. (Optional) If you intend to tweak any of the PHP code, you will need [Composer](https://getcomposer.org/) as well.

## Admin Installation

Download the repository:

```sh
git clone git@github.com:groton-school/planner-lti.git <path/to/working/folder>
```

Install the Node dependencies (necessary for admin tasks):

```sh
cd <path/to/working/folder>
pnpm install
```

Optionaly, install the PHP dependencies (if planning to edit the backend):

```sh
composer install
```

Run the deploy script to create a Google Cloud project and configure it for use:

```sh
node bin/deploy.js
```

This will guide you through the configuration steps, including links to directions for the tricky bits. It will deploy a working version of the app to Google App Engine, and close with directions on how to connect that to your Canvas instance.

## User Setup

When user's first visit the Planner (in the global navigation sidebar), they are warned that they will need to authorize the app:

![Authorization warning](https://raw.githubusercontent.com/groton-school/planner-lti/refs/heads/main/docs/warning.png)

This warning is to prepare them for the more ominous-appearing Canvas API authorization that comes next.

![Canvas API authorization](https://raw.githubusercontent.com/groton-school/planner-lti/refs/heads/main/docs/authorize.png)

This authorization is necessary so that the Planner can access their course, assignment, and planner information _as the student themselves_.

#### A note on version tags

As this was built from our [slim-lti-gae-skeleton](https://github.com/groton-school/slim-lti-gae-skeleton), which is a fork of [slim-skeleton](https://github.com/slimphp/Slim-Skeleton), there are overlaid version tags. I have opted to track versions for _this app_ with the prefix `planner-lti`. Un-prefixed version numbers refer to the Slim Skeleton.
