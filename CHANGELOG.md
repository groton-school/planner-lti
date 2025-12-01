# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.2](https://github.com/groton-school/planner-lti/compare/planner-lti/0.1.1...planner-lti/0.1.2) (2025-12-01)


### Features

* color code class meetings by color block ([7b985a2](https://github.com/groton-school/planner-lti/commit/7b985a2595fc0e080a5012ef1a269a3d486e5c77)), closes [#15](https://github.com/groton-school/planner-lti/issues/15)
* identify sections (where possible) ([290d7bf](https://github.com/groton-school/planner-lti/commit/290d7bfe79c94e81580f786526d745837d046d06))
* modal explaining Canvas API authorization ([c679c62](https://github.com/groton-school/planner-lti/commit/c679c628ea228c1151fa36683ef28bbbc33db01d))
* move to Bootstrap 5 theming in FullCalendar ([007aca0](https://github.com/groton-school/planner-lti/commit/007aca0c55aea2e360c5c63e96b22e88c25df2f7))
* pre-load assignments and assignment groups ([d511a5c](https://github.com/groton-school/planner-lti/commit/d511a5cd02d4e4d503320311dbab4f27269006f4))
* save calendar selector settings between sessions ([1e4c83a](https://github.com/groton-school/planner-lti/commit/1e4c83a2da41748c5448b3bf588b141bd41565e9))
* selectively hide and show calendar categories ([af34905](https://github.com/groton-school/planner-lti/commit/af3490537a8658bbd1eae2ee49f52d637bc35ca8))
* spinner when accessing APIs ([2cc7ff9](https://github.com/groton-school/planner-lti/commit/2cc7ff95ba46bc6f6233fe5f6e92058f2068199d)), closes [#22](https://github.com/groton-school/planner-lti/issues/22)
* store current view duration and style in cookie ([62ddac5](https://github.com/groton-school/planner-lti/commit/62ddac5237ef8d32fcf3d6708953f2aafccece47))
* store secrets in 1Password ([4078fd3](https://github.com/groton-school/planner-lti/commit/4078fd3b3075f99c4165d45219beb28411945db7))


### Bug Fixes

* _public_-hoist-pattern ([d150656](https://github.com/groton-school/planner-lti/commit/d15065698b1f52c1fc0e83fc5baf57f21f664e0c))
* align all day events with current timezone ([b8bc0fe](https://github.com/groton-school/planner-lti/commit/b8bc0fe2e18e946cf76f75862841443fc59052dd)), closes [#23](https://github.com/groton-school/planner-lti/issues/23)
* block colors supercede custom colors (for now) ([77538be](https://github.com/groton-school/planner-lti/commit/77538be87b2bd1441fd23f4cc66152fb7970755b))
* color coding, marking planner items done ([5f25bf0](https://github.com/groton-school/planner-lti/commit/5f25bf08d44cce242acf593e7252200762907765)), closes [#17](https://github.com/groton-school/planner-lti/issues/17) [#43](https://github.com/groton-school/planner-lti/issues/43) [#32](https://github.com/groton-school/planner-lti/issues/32)
* detect HTTP_ORIGIN more accurately for API proxies ([ee90c92](https://github.com/groton-school/planner-lti/commit/ee90c922bbc33e4d0a12b0b1713bb1691c461dab))
* externalize Canvas.Planner.PlannerItem definition tp @groton/canvas-cli.api ([c073372](https://github.com/groton-school/planner-lti/commit/c0733723fd895d6ab384725f2b54570b3d0288ec))
* fix corepack pnpm version ([fbb35de](https://github.com/groton-school/planner-lti/commit/fbb35de2faefbf46ebf12dc29a3c2ebe7a2529f1))
* instance-aware Canvas API proxy token storage ([eaed514](https://github.com/groton-school/planner-lti/commit/eaed514ccd2b79e77919d6a58713814bee2d0d3d))
* match all sections class meetings from Google to Canvas course ([d4e35f2](https://github.com/groton-school/planner-lti/commit/d4e35f2af94729ab05a8810f33d982ebb0ad43fe)), closes [#15](https://github.com/groton-school/planner-lti/issues/15)
* match Google events by SIS ID, but fall back to title if necessary ([9cc7d02](https://github.com/groton-school/planner-lti/commit/9cc7d0238e76b31f46710953d598798df9d6516f))
* protobuf PHP implementation now a subdependency of google packages ([c082a2f](https://github.com/groton-school/planner-lti/commit/c082a2fc471eb0a61c92a185869050fb55c135f9))
* recurring events now showing as intended ([041c1dd](https://github.com/groton-school/planner-lti/commit/041c1dd83946ef849d5ba351ab6a1601a1230a5e)), closes [#23](https://github.com/groton-school/planner-lti/issues/23)
* remove placement query argument from launch ([b3eaecb](https://github.com/groton-school/planner-lti/commit/b3eaecb969f5e0eb54ab73d30b47c8137ca01897))
* request Canvas API authorization if no valid stored token ([cafc165](https://github.com/groton-school/planner-lti/commit/cafc165d5e5cfb540801e0865d99b8f6aca14e4a))
* restore Google Calendar access ([9a9969c](https://github.com/groton-school/planner-lti/commit/9a9969c5d63ebebb45a9a9bf8a41ca8c886ccc4f))
* use JSON sis_course_id in description to map Google Calendar events to courses ([19cae7a](https://github.com/groton-school/planner-lti/commit/19cae7a5157e456e1d0deca34680f614a432dfb2))

## [0.1.1](https://github.com/groton-school/planner-lti/compare/planner-lti/0.1.0...planner-lti/0.1.1) (2025-05-24)


### Bug Fixes

* lighten completed assignments ([31b0f68](https://github.com/groton-school/planner-lti/commit/31b0f68c98b79df645fdf0d8dd50d20aa46adc4c))
* match Google calendar events to Canvas on non-user-changeable course_code ([147861f](https://github.com/groton-school/planner-lti/commit/147861f598c6cec767928aa543251af20a0fcf22))

## 0.1.0 (2025-05-14)
