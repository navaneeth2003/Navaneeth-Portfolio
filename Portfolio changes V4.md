Portfolio Website + Content Studio — Advanced Update & Quality-Safe Implementation Prompt
=========================================================================================

You are working on an existing portfolio website with a private Content Studio/CMS.

The website's existing functionality is currently working correctly.

**Your highest-priority responsibility is to preserve everything that already works.**

The requirements below introduce new functionality, CMS controls, UX improvements, visual refinements, project interaction changes, SEO/reach integrations, and bug fixes.

NON-NEGOTIABLE CORE RULE
------------------------

> **DO NOT BREAK EXISTING FUNCTIONALITY.**

This is more important than visual changes, new features, refactoring, code cleanliness, or implementation convenience.

Do not rewrite, replace, simplify, restructure, or refactor working systems unless it is genuinely necessary for one of the requirements below.

Do not assume how the existing application works.

**Inspect the actual implementation first.**

Do not hallucinate files, components, schemas, Firebase behavior, APIs, data structures, or existing functionality.

If something already works, preserve its behavior unless this prompt explicitly requires changing that behavior.

1\. FIRST: FULL EXISTING-SYSTEM INSPECTION
==========================================

Before modifying anything, thoroughly inspect the existing project.

Understand at minimum:

*   application architecture
    
*   routing
    
*   public website
    
*   Studio
    
*   Studio side panel
    
*   Site Settings
    
*   section rendering system
    
*   section ordering/hiding logic
    
*   shared section components
    
*   Studio preview
    
*   responsive behavior
    
*   project data structure
    
*   experience data structure
    
*   company banner implementation
    
*   hero implementation
    
*   footer implementation
    
*   contact implementation
    
*   project card interactions
    
*   project expansion/preview behavior
    
*   scroll-reactive colorful line implementation
    
*   upload components
    
*   file input implementation
    
*   Firebase configuration
    
*   Firestore schema
    
*   Firebase Storage usage
    
*   authentication
    
*   publishing/draft system
    
*   SEO configuration
    
*   analytics implementation
    
*   existing verification-token implementation
    
*   any script injection system
    
*   existing CSS/design tokens/theme variables
    
*   animation libraries and animation architecture
    
*   mobile/touch-specific behavior
    

Search the codebase rather than guessing.

Identify which components are shared between the public website and Studio preview.

Identify which values are currently hardcoded and which are CMS-controlled.

Identify all places where:

*   the name "Navaneeth C L" is hardcoded
    
*   section names are hardcoded
    
*   company names are derived from Experience
    
*   company logos are derived from Experience
    
*   project categories are hardcoded
    
*   footer copyright text is hardcoded
    
*   colors are hardcoded
    
*   SEO verification values are stored
    
*   analytics IDs are stored
    
*   scripts are injected
    
*   mailto links are generated
    
*   file upload inputs are rendered
    

Create an internal implementation map before making changes.

2\. ESTABLISH A BASELINE BEFORE CHANGING ANYTHING
=================================================

Before implementation, verify that the existing application currently works.

At minimum verify:

### Public website

*   homepage loads
    
*   all existing visible sections render
    
*   hidden sections remain hidden
    
*   section ordering works
    
*   dynamic content renders
    
*   Experience renders correctly
    
*   Projects render correctly
    
*   project categorization works
    
*   project buttons work
    
*   Tools render
    
*   Skills render
    
*   Certifications render
    
*   Education renders
    
*   Contact renders
    
*   footer renders
    
*   navigation works
    
*   animations work
    
*   responsive layouts work
    

### Studio

*   authentication works
    
*   Studio loads
    
*   side panel works
    
*   section ordering works
    
*   section visibility works
    
*   editing works
    
*   autosave works
    
*   publishing works
    
*   draft/published separation works
    
*   history/versioning works
    
*   rollback works
    
*   image uploads work
    
*   image crop functionality works
    
*   preview works
    
*   existing SEO settings work
    

Do not proceed as though these systems work based only on the specification.

Verify against the actual implementation.

3\. IMPLEMENTATION PRINCIPLE: EXTEND, DON'T REPLACE
===================================================

For every requirement:

1.  Inspect the existing implementation.
    
2.  Identify the smallest safe architectural extension.
    
3.  Determine whether the existing data model needs to change.
    
4.  Preserve backwards compatibility with existing saved data.
    
5.  Implement the feature.
    
6.  Test the feature.
    
7.  Test nearby existing functionality.
    
8.  Test public website and Studio preview.
    
9.  Test desktop, tablet, mobile and touch interactions.
    
10.  Only then move to the next requirement.
    

Avoid large uncontrolled refactors.

If a requirement can be implemented without changing the existing schema, prefer that.

If a schema change is necessary, make it backward compatible.

Existing content must continue rendering correctly after the update.

4\. COMPANY BANNER — CUSTOM COMPANIES + LOGO CONTROLS
=====================================================

The Company Banner currently allows editing company names.

Currently, company names are automatically synchronized from the Experience section.

**Keep this automatic synchronization.**

Do not remove or weaken it.

However, extend the Company Banner system so it supports both:

### Automatically sourced companies

Companies existing in the Experience section should continue to appear automatically.

If a company is added to Experience, the Company Banner should be able to pick it up according to the current synchronization behavior.

### Custom companies

The Studio must also allow the user to manually add companies that do NOT exist in Experience.

Add an appropriate:

*   Add Company
    
*   Edit Company
    
*   Remove Company
    

interface where appropriate.

The final Company Banner list should support a mixture of:

*   Experience-derived companies
    
*   manually added/custom companies
    

Do not duplicate companies unnecessarily.

Handle company identity cleanly so the same company does not accidentally appear twice simply because it exists both in Experience and custom entries.

Company Logo behavior
---------------------

Currently, if a company logo is added in Experience, the Company Banner automatically uses that logo.

**Preserve this behavior.**

Add Studio controls allowing the user to control the Company Banner logo independently.

Each company should support an appropriate logo configuration such as:

*   Show Experience Logo: ON/OFF
    
*   Custom Logo: optional
    

Expected behavior:

### Default

If a company exists in Experience and has a logo:

*   Show Experience Logo = ON
    
*   Company Banner displays the Experience logo.
    

### Hide logo

If the user turns the logo visibility OFF:

*   do not display the logo in the Company Banner.
    

### Custom logo

If the user provides a custom logo:

*   use the custom logo according to the chosen configuration.
    

Do not modify the Experience logo itself when changing the Company Banner logo.

The Company Banner's logo configuration should be independent from Experience.

Design the data model so future changes do not create confusing synchronization conflicts.

5\. HERO — MOVE "NAVANEETH" SLIGHTLY DOWN
=========================================

Across all device sizes, the "Navaneeth" portion of the hero currently sits too close to the top navigation.

Move the hero name slightly downward.

This is a **small visual adjustment**, not a redesign.

The spacing should:

*   create better visual breathing room below the navbar
    
*   preserve the existing hero composition
    
*   preserve image positioning
    
*   preserve animations
    
*   preserve CTA positioning
    
*   preserve typography
    
*   preserve responsive behavior
    

Do not simply apply one fixed margin that looks correct on one screen.

Check:

*   desktop
    
*   large desktop
    
*   laptop
    
*   tablet
    
*   small tablet
    
*   mobile
    
*   narrow mobile
    

The final spacing should feel intentionally composed across all of them.

**Do not allow this change to create overlap or vertical overflow anywhere.**

6\. HERO NAME — MAKE IT EDITABLE FROM STUDIO
============================================

The hero currently displays:

**Navaneeth C L**

Add a Studio setting allowing the user to edit the displayed name.

Default value must remain:

**Navaneeth C L**

The value must be stored in the existing content/CMS system appropriately.

When changed:

*   Hero should update.
    
*   Any other area explicitly linked to the global display name should update where appropriate.
    
*   Footer name should update automatically.
    

Do not duplicate the name into separate unrelated fields unless there is a strong implementation reason.

Prefer a single source of truth for the person's display name.

7\. FOOTER NAME + COPYRIGHT TEXT
================================

The footer currently contains the user's name.

When the Hero/display name is changed in Studio, the footer name should update accordingly.

Default:

**Navaneeth C L**

Additionally, make the copyright text editable from Studio.

Current default:

**© 2026 Navaneeth C L. All rights reserved.**

The Studio should allow the user to edit the copyright text.

If the existing implementation already supports this correctly, preserve it and do not duplicate the functionality.

Do not unnecessarily hardcode the year if the existing system has a deliberate dynamic-year mechanism.

If the current requirement specifically expects the full copyright sentence to be editable, make the entire displayed copyright string editable.

8\. EDITABLE SECTION NAMES
==========================

The Studio currently has a side panel where users can:

*   reorder sections
    
*   hide/show sections
    
*   access sections for editing
    

Extend this area to allow the user to edit the **display name of each section**.

For example:

*   Experience → Work Experience
    
*   Projects → Selected Work
    
*   Skills → Capabilities
    

The user should only be changing the section's display label.

Do not change the section's internal identity/type.

This distinction is extremely important.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   internal section ID/type:  experience  display name:  Work Experience   `

The rendering logic should continue to understand the section as experience.

The display label should be independently editable.

Section-name behavior
---------------------

When the user changes a section name:

*   Studio side panel should update immediately.
    
*   Website section heading/label should update immediately.
    
*   Studio preview should update immediately.
    
*   Published website should use the updated name after publishing.
    
*   Section ordering must continue working.
    
*   Section visibility must continue working.
    
*   Section editing must continue working.
    

Do not allow custom labels to break:

*   section navigation
    
*   anchors
    
*   internal IDs
    
*   rendering
    
*   ordering
    
*   visibility
    
*   Studio routing
    
*   preview
    

The editable label is presentation data, not a replacement for the internal section identifier.

9\. PROJECT CATEGORIES — CUSTOM CATEGORY SYSTEM
===============================================

The Projects section currently has predefined categories such as:

*   Product Creation
    
*   Product Design
    
*   Product Improvement
    
*   Product Teardowns
    
*   Analytical Case Studies
    

Preserve all existing categories and their current behavior.

Add a Studio category-management system.

The Studio should allow:

*   Add category
    
*   Edit category
    
*   Remove category where safe/appropriate
    

The user should be able to create a custom category.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Growth Experiments   `

The custom category must behave exactly like the predefined categories from a UI/rendering perspective.

Only the displayed category name changes.

Project editor integration
--------------------------

The existing project editor has a category dropdown.

All custom categories created in Studio must automatically appear in this dropdown.

Selecting a custom category should work exactly like selecting an existing category.

The existing categorization/filtering/grouping logic must continue to work.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Project A  Category: Growth Experiments   `

should appear under the "Growth Experiments" category using the same UI treatment as existing categories.

Do not create a second categorization system.

Extend the existing one.

Category safety
---------------

Do not allow category deletion to silently orphan projects.

If a category is currently used by projects, the Studio should handle this safely.

Possible safe approaches include:

*   prevent deletion and explain why
    
*   require reassignment of affected projects before deletion
    
*   provide a safe migration flow
    

Choose the approach that best fits the existing Studio UX.

Do not leave projects referencing nonexistent categories.

Existing projects must remain valid after the feature is introduced.

10\. PROJECT CARD — REDESIGN THE COLLAPSED/EXPANDED EXPERIENCE
==============================================================

This is a significant UX change.

**Before coding, first understand the current project-card interaction and visually reason through the new interaction model.**

Do not immediately modify the card.

The goal is to make project cards substantially less vertically lengthy while preserving the existing visual language, animations and interaction quality.

Current problem
---------------

The collapsed card currently shows too much information immediately:

*   project image
    
*   title
    
*   overview
    
*   results/impact
    

This makes the card feel unnecessarily long.

New collapsed card
------------------

Remove the overview and results/impact content from the initial collapsed card.

The collapsed card should primarily communicate:

*   project image
    
*   project title
    
*   existing category/context where applicable
    
*   existing visual identity
    

The project title should now appear **over the project image**.

11\. PROJECT TITLE OVER IMAGE
=============================

Place the project title over the project image.

To maintain readability, introduce a subtle dark gradient directly behind/below the title.

Important:

**Do NOT darken the entire image.**

The gradient should:

*   begin around/under the title
    
*   fade naturally into the image
    
*   provide sufficient contrast
    
*   preserve the visual detail and brightness of the image
    
*   feel integrated rather than like a black rectangle
    

Avoid:

*   heavy black overlays
    
*   hard-edged gradient blocks
    
*   excessive opacity
    
*   visual clutter
    
*   poor text contrast
    

Use the existing typography and design language.

The result should feel like an intentional editorial/project-card treatment, not a workaround.

Test titles of different lengths.

Make sure long project titles:

*   wrap gracefully
    
*   never overflow
    
*   do not collide with other UI
    
*   remain readable on mobile
    

12\. DESKTOP HOVER — "CLICK TO EXPAND"
======================================

On desktop/pointer devices, when hovering over a collapsed project card, display an interaction cue:

**Click to Expand**

This should behave visually like the existing:

**Click to preview**

interaction pattern where appropriate.

Reuse the existing animation/component pattern if possible.

Do not introduce an unrelated visual style.

The hover treatment should not interfere with:

*   title
    
*   image
    
*   category
    
*   existing hover animation
    
*   click target
    

13\. CLICK TO EXPAND
====================

When a user clicks a collapsed project card:

The card should expand and reveal the information currently shown in the existing card:

*   title
    
*   overview
    
*   results/impact
    
*   View project
    
*   Read case study
    

Preserve the existing content and button behavior.

The expanded card should feel like a natural extension of the collapsed card.

Do not create an entirely different visual component unless necessary.

14\. ONLY ONE PROJECT SHOULD BE EXPANDED
========================================

At any given time:

**Maximum expanded projects = 1**

When Project A is expanded and the user clicks Project B:

*   Project A should smoothly minimize/collapse.
    
*   Project B should expand.
    

Do not allow multiple cards to remain expanded simultaneously.

The transition should feel intentional and smooth.

15\. CLICK OUTSIDE TO COLLAPSE
==============================

When a project is expanded and the user clicks somewhere outside the project/card interaction area:

*   collapse the expanded project
    
*   return all projects to their compact state
    

Handle this carefully so clicks on:

*   View project
    
*   Read case study
    
*   internal buttons
    
*   links
    
*   controls
    

do not accidentally trigger the outside-click collapse before the intended action occurs.

Do not introduce event propagation bugs.

16\. PRESERVE EXISTING PROJECT ANIMATIONS
=========================================

This is critical.

Keep the existing:

*   hover animations
    
*   transitions
    
*   card motion
    
*   image behavior
    
*   interaction feel
    
*   buttons
    
*   colors
    
*   typography
    
*   Studio behavior
    

unless a specific modification above requires changing them.

The requested change is primarily:

**collapsed card → expanded card interaction model**

not a complete project-card redesign.

Do not unnecessarily change the visual language.

17\. TOUCHSCREEN EXPERIENCE
===========================

Do not assume mobile users have hover.

On touch devices:

There must be an obvious, intuitive way to expand a project.

For example, an appropriately designed:

*   Expand button
    
*   expand icon
    
*   "Tap to Expand"
    

control

can be used.

It must be:

*   easy to tap
    
*   visually discoverable
    
*   accessible
    
*   consistent with the existing design
    
*   large enough for comfortable touch interaction
    

When another project is opened:

*   previously open project collapses
    
*   new project expands
    

When the user taps outside:

*   expanded project collapses
    

Make sure this does not conflict with scrolling.

Do not create accidental expansion/collapse when the user is simply scrolling.

18\. PROJECT EXPANSION — RESPONSIVE QUALITY
===========================================

The project interaction must work properly on:

*   large desktop
    
*   desktop
    
*   laptop
    
*   tablet landscape
    
*   tablet portrait
    
*   mobile landscape
    
*   mobile portrait
    
*   narrow mobile devices
    
*   touch-enabled laptops/tablets
    

Do not simply make the desktop implementation responsive.

Design the interaction around the actual capabilities of the device.

Check:

*   pointer devices
    
*   touch devices
    
*   hybrid devices
    
*   keyboard navigation where applicable
    

19\. PROJECT CARD — DYNAMIC CONTENT SAFETY
==========================================

The project card must remain robust when CMS content changes.

Test:

*   very short title
    
*   long title
    
*   long overview
    
*   long results
    
*   missing overview
    
*   missing results
    
*   missing project URL
    
*   missing case study URL
    
*   different image aspect ratios
    
*   many projects
    
*   one project
    
*   many categories
    
*   custom categories
    

Adding/removing projects from Studio must not break the layout.

20\. SCROLL-REACTIVE CURVY COLORFUL LINE — FIRST CURVE
======================================================

The existing scroll-reactive colorful line has a good overall curvy character.

Do not redesign it.

There is one specific visual issue:

**The first curve currently bends too sharply.**

It should become more rounded and fluid.

Modify the first curve so the transition feels:

*   smoother
    
*   more circular
    
*   more organic
    
*   less angular
    
*   consistent with the rest of the line
    

Do not flatten the curve.

Do not remove its personality.

Preserve the existing scroll-reactive behavior.

Increase line opacity slightly
------------------------------

Increase the line's opacity somewhat.

Do NOT make it 100% opaque.

It should remain subtle and integrated with the page.

The new opacity should simply make it slightly more visible than it is currently.

Check the line against:

*   background
    
*   section content
    
*   cards
    
*   typography
    
*   mobile layouts
    

It must remain decorative and must never interfere with readability.

21\. STUDIO UPLOAD BUG — UNEXPECTED FILE EXPLORER
=================================================

There is a Studio bug where clicking on a white/empty area near an upload button unexpectedly opens the system file explorer.

This strongly suggests that the clickable , hidden file input, event propagation, overlay, or parent click handler may be covering more area than intended.

Do NOT assume the cause.

Inspect the actual implementation.

Determine:

*   which element receives the click
    
*   whether a surrounds too much content
    
*   whether the hidden  has an incorrectly sized clickable area
    
*   whether CSS positioning causes the input to overlap surrounding UI
    
*   whether an ancestor click handler triggers the file input
    
*   whether pointer-events are incorrectly configured
    
*   whether an overlay is intercepting clicks
    

Fix the underlying cause.

The file picker should open **only when the intended upload control is activated**.

Clicking surrounding whitespace should not open the file explorer.

After fixing it, verify that:

*   image upload still works
    
*   drag/drop still works if currently supported
    
*   crop still works
    
*   replace-image behavior still works
    
*   upload cancellation still works
    
*   other Studio controls near upload fields still work
    

Do not solve this by globally disabling pointer events.

Fix the actual interaction boundary.

22\. MAILTO FUNCTIONALITY
=========================

The current mailto functionality is not working correctly.

Inspect the existing implementation.

Make the email interaction actually invoke the user's configured mail client.

The expected behavior is to use a valid mailto: URL so users can be taken to their available email application/service, such as Gmail or another configured mail handler.

Do not hardcode a personal email address if the existing Contact/CMS system already provides it.

Use the configured contact email as the source of truth.

Correctly handle:

*   email links
    
*   buttons
    
*   footer email links if any remain
    
*   contact section email actions
    

If the design intentionally opens a browser/mail-handler rather than a native desktop mail client, preserve the platform's normal behavior.

Do not claim that a specific email provider can always be forced to open if browser/device settings do not allow that.

The important requirement is:

**the mailto action must be valid and functional.**

23\. COLOR PALETTE SYSTEM IN STUDIO
===================================

Add a new **Color Palette** option under:

**Studio → Site Settings**

This should allow users to change the overall color personality of the website without manually editing individual colors.

This is not simply a background-color switch.

The system should be designed as a proper theme/palette layer.

First: audit existing colors
----------------------------

Before implementing:

Identify the current color system.

Determine:

*   primary colors
    
*   background colors
    
*   surface colors
    
*   text colors
    
*   muted text
    
*   borders
    
*   accents
    
*   gradients
    
*   interactive states
    
*   buttons
    
*   hover states
    
*   project accents
    
*   line colors
    
*   glass effects
    
*   shadows where color-dependent
    

Determine whether the current website already has CSS variables/design tokens.

If it does, extend that system.

If colors are currently scattered through CSS, introduce a controlled token layer only where necessary.

Do not rewrite unrelated components.

24\. CURATE THE PALETTES YOURSELF
=================================

Create several carefully curated palettes that work with the existing portfolio design.

Do not provide random color combinations.

Each palette must have:

*   primary/accent color
    
*   secondary/accent color
    
*   background
    
*   surface
    
*   text
    
*   muted text
    
*   border
    
*   interaction states
    
*   any other tokens required by the current design
    

The palettes should feel:

*   premium
    
*   cohesive
    
*   modern
    
*   professional
    
*   readable
    
*   aesthetically compatible with the existing design
    

Create multiple distinct choices so the user can change the overall visual feel.

For example, conceptually you might have palettes inspired by:

*   Warm Minimal
    
*   Graphite
    
*   Earth
    
*   Emerald
    
*   Midnight
    
*   Editorial
    

But choose the actual names and colors based on what genuinely works with the existing design.

Do not blindly use these example names.

25\. PALETTE IMPLEMENTATION
===========================

The palette system must be token-based.

Do not create separate hardcoded versions of every component for every palette.

Prefer:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   current theme     ↓  design tokens     ↓  components   `

The selected palette should automatically affect all relevant visual elements.

Changing the palette must NOT change:

*   layout
    
*   component structure
    
*   typography
    
*   spacing
    
*   animations
    
*   project functionality
    
*   Studio functionality
    
*   content
    
*   section ordering
    
*   section visibility
    

Only the visual color system should change.

26\. PALETTE PREVIEW + SELECTION
================================

In Studio, make palette selection visually understandable.

Each palette should have a small visual preview showing its main colors.

The user should be able to select a palette easily.

Selection should update the Studio preview immediately.

After publishing, the public website should use the selected palette.

Ensure the selected palette persists across reloads.

Existing sites/content without a saved palette must automatically use the current/default visual palette.

This is critical for backward compatibility.

27\. COLOR PALETTE QUALITY CHECKS
=================================

Every palette must be checked for:

*   readable body text
    
*   readable muted text
    
*   button contrast
    
*   link contrast
    
*   section heading visibility
    
*   image overlay readability
    
*   project title readability
    
*   navigation readability
    
*   footer readability
    
*   form/input readability
    
*   hover states
    
*   focus states
    
*   mobile readability
    

Do not choose a visually attractive palette that creates accessibility or usability problems.

28\. SEO + REACH — AUDIT THE EXISTING IMPLEMENTATION
====================================================

The Studio currently has a section similar to:

### Google Search Console Verification

Token from Google Search Console HTML tag method (google-site-verification)

### Bing Webmaster Verification

Token for Bing Webmaster Tools (msvalidate.01)

### Google Analytics 4

Measurement ID beginning with G-

These controls must be **real and functional**, not dummy UI.

Before changing anything, inspect how these values are currently stored and injected.

Determine whether:

*   metadata is actually generated
    
*   verification tags are actually added to
    
*   GA4 is actually initialized
    
*   scripts are injected safely
    
*   published content receives the settings
    
*   draft/preview incorrectly injects production analytics
    
*   duplicate scripts can occur
    
*   values persist through publishing
    

29\. GOOGLE SEARCH CONSOLE VERIFICATION
=======================================

If a valid verification token is entered:

Generate the correct verification metadata in the document using the expected verification mechanism.

Do not merely save the value in Firestore and display it in Studio.

It must actually affect the published site's HTML/head output.

Handle empty values correctly.

Do not inject malformed metadata.

Do not create duplicate verification tags after repeated publishing.

30\. BING WEBMASTER VERIFICATION
================================

Similarly, the Bing Webmaster verification token must actually produce the appropriate verification metadata in the published site.

Do not treat the Studio field as decorative.

Ensure:

*   valid value → correct metadata
    
*   empty value → no unnecessary tag
    
*   editing value → replaces previous value
    
*   publishing → reflected on public site
    
*   repeated publishing → no duplicate tags
    

31\. GOOGLE ANALYTICS 4
=======================

The GA4 field accepts a Measurement ID beginning with:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   G-   `

If a valid GA4 Measurement ID is provided, the tracking implementation should actually work on the published website.

Before implementing, inspect the current analytics architecture.

Avoid:

*   duplicate script injection
    
*   multiple initialization
    
*   malformed IDs
    
*   accidental tracking from Studio preview
    
*   tracking unpublished/draft content
    
*   breaking page rendering if analytics fails
    

Validate the basic expected GA4 ID format.

Do not pretend that simply storing the ID means analytics works.

32\. MICROSOFT CLARITY
======================

Add Microsoft Clarity support to the same SEO/Reach/Site Settings area.

The implementation must be legitimate.

Do not create fake settings that do nothing.

First determine what integration approach is actually appropriate for the existing application architecture.

If Clarity can be safely configured through a Project ID, provide a Project ID field.

If the user's Clarity setup requires custom script/configuration that genuinely cannot be represented through a simple ID, provide a controlled custom-script configuration only if it can be implemented securely and reliably.

33\. CUSTOM CLARITY SCRIPT — SECURITY REQUIREMENT
=================================================

If allowing custom scripts:

**Do not blindly inject arbitrary user-provided JavaScript into the website.**

This is especially important because the Studio is an authenticated content-management interface.

Before implementing custom script injection, evaluate:

*   XSS risk
    
*   stored script injection
    
*   account compromise implications
    
*   CSP implications
    
*   script execution scope
    
*   whether only the site owner can configure it
    
*   whether scripts should run only on published content
    
*   whether preview should execute them
    
*   whether scripts can affect Studio
    
*   whether scripts can access application data
    

If a safe custom-script architecture cannot be implemented without materially weakening security, do not implement arbitrary script execution merely to satisfy the UI requirement.

Instead, use the supported Clarity configuration mechanism where possible.

If the exact requested script-pasting approach cannot be safely implemented, explicitly report that after the implementation analysis.

**Never compromise the existing website or Studio security just to make this feature possible.**

34\. SEO SETTINGS MUST BE PERSISTENT AND PUBLISHED
==================================================

All SEO/Reach settings must follow the existing:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Draft → Publish → Public Website   `

architecture.

Changing a setting in Studio should not automatically alter the live public website unless that is already how the existing publishing system intentionally behaves.

Publishing should update the public website.

Rollback should restore the previous configuration.

Version history should remain coherent.

Do not bypass the existing publishing system.

35\. SEO INTEGRATION WITH NEW CMS FEATURES
==========================================

Audit whether the new CMS capabilities affect SEO.

Specifically consider:

### Editable section names

Updated section display headings should appear correctly in rendered HTML where appropriate.

Do not change internal IDs unnecessarily.

### Custom project categories

Ensure category names are rendered correctly in semantic markup.

Do not create duplicate or confusing SEO URLs unless the current architecture already uses category routes.

### Dynamic project content

Expanded/collapsed UI must not hide content from crawlers in a way that unintentionally removes important project information from the page source.

The project content should remain semantically available where appropriate even if visually collapsed.

### Company banner

The Company Banner should not introduce unnecessary SEO noise.

### Name

The editable name should correctly update relevant semantic content.

### Palette

Changing a color palette must not alter semantic HTML or content.

### Analytics / verification

Third-party scripts must not interfere with page rendering or SEO metadata.

36\. STUDIO DATA-MODEL DESIGN
=============================

Before adding fields, determine the best compatible schema.

Potential new data areas may include:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   site identity  - displayName  - copyrightText  section metadata  - displayLabel  company banner  - customCompanies  - logo visibility  - customLogo  project categories  - customCategories / category registry  theme  - selectedPalette  seo/reach  - googleVerificationToken  - bingVerificationToken  - ga4MeasurementId  - clarityConfiguration   `

These are conceptual examples, not instructions to blindly create exactly this structure.

Use the existing schema conventions.

Maintain backwards compatibility.

Existing documents without the new fields must continue to render correctly using sensible defaults.

37\. DO NOT DUPLICATE SOURCES OF TRUTH
======================================

Pay special attention to:

### Name

Prefer one global display-name value.

### Company information

Keep Experience as the source for automatically synchronized company information while allowing Company Banner-specific custom additions/overrides.

### Project categories

Maintain one category system used by:

*   Studio
    
*   project editor
    
*   project categorization
    
*   public rendering
    

### Section labels

Maintain:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   internal section identity  +  editable display label   `

rather than replacing internal identifiers.

### Theme

Maintain one selected palette/theme value.

### SEO

Maintain one authoritative SEO/Reach configuration.

Avoid multiple competing sources of truth.

38\. RESPONSIVE + DEVICE QUALITY IS A CORE REQUIREMENT
======================================================

Every change must be intentionally designed for:

### Desktop

*   large desktop
    
*   standard desktop
    
*   laptop
    

### Tablet

*   landscape
    
*   portrait
    
*   intermediate widths
    

### Mobile

*   large phones
    
*   standard phones
    
*   narrow phones
    
*   landscape phones
    

### Input modes

*   mouse
    
*   trackpad
    
*   touchscreen
    
*   hybrid touch + pointer
    

Do not define success as merely "responsive."

The interface must actually feel designed for each interaction mode.

39\. TOUCH INTERACTION AUDIT
============================

For every interactive feature added or modified, ask:

*   Does it require hover?
    
*   If yes, what happens on touch?
    
*   Is the target large enough?
    
*   Can users understand what is clickable?
    
*   Can scrolling accidentally trigger it?
    
*   Does tapping outside behave correctly?
    
*   Does keyboard navigation remain usable?
    
*   Does focus state remain visible?
    

This is especially important for:

*   project expansion
    
*   company controls
    
*   category controls
    
*   palette selection
    
*   Studio upload controls
    
*   buttons
    
*   navigation
    

40\. ACCESSIBILITY
==================

Do not sacrifice accessibility for visual polish.

Check:

*   keyboard navigation
    
*   focus states
    
*   semantic buttons vs clickable divs
    
*   appropriate ARIA labels where needed
    
*   color contrast
    
*   text readability
    
*   touch target sizes
    
*   reduced-motion behavior where the existing animation architecture supports it
    
*   image alt text where applicable
    

The new project expansion interaction should be understandable to keyboard users as well.

41\. SECURITY-SAFE IMPLEMENTATION
=================================

While implementing these features, do not introduce new security weaknesses.

Pay particular attention to:

*   custom scripts
    
*   Studio authentication
    
*   Firestore write permissions
    
*   Storage permissions
    
*   user-controlled URLs
    
*   user-controlled text
    
*   user-controlled HTML
    
*   external scripts
    
*   analytics IDs
    
*   verification tokens
    
*   uploaded files
    

Never trust client-side authorization alone.

Do not expose sensitive Firebase configuration or credentials.

Do not introduce dangerouslySetInnerHTML or equivalent arbitrary HTML execution unless there is a thoroughly justified and safely sanitized requirement.

Never execute arbitrary user-provided JavaScript without a carefully controlled architecture.

42\. QUALITY-CHECK PROCESS
==========================

After each major feature, perform a targeted regression check.

Then perform a full regression pass after all changes.

The final QA must include:

Content/CMS
-----------

*   edit name
    
*   edit section names
    
*   reorder sections
    
*   hide/show sections
    
*   edit company
    
*   add custom company
    
*   edit custom company
    
*   company logo toggle
    
*   custom company logo
    
*   add project category
    
*   edit project category
    
*   assign project to custom category
    
*   edit project
    
*   add/remove project
    
*   edit copyright
    
*   select color palette
    
*   edit SEO settings
    
*   publish
    
*   preview
    
*   rollback
    
*   reload Studio
    

Public website
--------------

*   Hero
    
*   navigation
    
*   About
    
*   Company Banner
    
*   Stats
    
*   Experience
    
*   Projects
    
*   Tools
    
*   Skills
    
*   Certifications
    
*   Education
    
*   Contact
    
*   Footer
    

Project interaction
-------------------

*   hover
    
*   expand
    
*   collapse
    
*   click another card
    
*   click outside
    
*   View project
    
*   Read case study
    
*   touch expand
    
*   touch collapse
    
*   keyboard interaction
    

Responsive
----------

Test at multiple realistic viewport sizes rather than only one desktop and one mobile breakpoint.

Animations
----------

Verify:

*   hero animation
    
*   hover animations
    
*   project expansion
    
*   project collapse
    
*   Experience/scroll line
    
*   existing section animations
    
*   reduced-motion behavior where relevant
    

Upload
------

Verify:

*   upload button
    
*   whitespace near upload button
    
*   image selection
    
*   cancel selection
    
*   replace image
    
*   crop
    
*   save
    
*   publish
    

SEO
---

Verify rendered output for:

*   Google verification
    
*   Bing verification
    
*   GA4
    
*   Clarity
    
*   title/meta behavior if applicable
    
*   semantic section headings
    

Do not assume SEO functionality because the Studio field exists.

Inspect the resulting rendered HTML/head behavior.

43\. DATA-INTEGRITY TESTING
===========================

Test with existing data.

Do not test only with freshly created content.

Verify that an existing portfolio document created before these changes:

*   loads successfully
    
*   displays correctly
    
*   can still be edited
    
*   can still be published
    
*   does not lose existing fields
    
*   does not lose images
    
*   does not lose project categories
    
*   does not lose section visibility/order
    
*   does not lose history
    
*   does not break Studio preview
    

New fields should have safe defaults when absent.

44\. FAILURE-SAFETY
===================

Every new feature should fail gracefully.

Examples:

### Invalid GA4 ID

Do not break the website.

### Missing logo

Do not show broken image UI.

### Deleted/invalid custom category

Do not crash the Projects section.

### Missing palette

Fall back to the default palette.

### Missing display name

Fall back to:

**Navaneeth C L**

### Missing copyright text

Use a sensible default.

### Missing Clarity configuration

Do nothing.

### Invalid verification token

Do not break rendering.

### Missing project URLs

Hide the relevant button rather than rendering a broken link.

45\. PERFORMANCE
================

Do not allow the new features to unnecessarily increase page weight or runtime cost.

Pay particular attention to:

*   theme switching
    
*   project expansion
    
*   scroll-reactive line
    
*   analytics
    
*   Clarity
    
*   verification scripts
    
*   image handling
    
*   Studio preview
    

Third-party scripts must not block the core website.

Do not add heavy dependencies when the existing stack can handle the requirement.

46\. FINAL VISUAL QUALITY REVIEW
================================

After implementation, do a visual review of the entire website.

Do not only verify that things technically work.

Look for:

*   awkward spacing
    
*   inconsistent alignment
    
*   visual jumps
    
*   typography collisions
    
*   image clipping
    
*   excessive gradients
    
*   poor contrast
    
*   overly large project cards
    
*   broken expanded project states
    
*   touch controls that look like desktop controls
    
*   inconsistent buttons
    
*   inconsistent section labels
    
*   color palette combinations that feel wrong
    
*   animation discontinuities
    
*   mobile overflow
    
*   tablet layout problems
    

The goal is not merely:

**"The code works."**

The goal is:

**"The website works perfectly and looks intentionally designed."**

47\. DO NOT MAKE UNREQUESTED DESIGN CHANGES
===========================================

You have some freedom to improve UX where it directly supports the requirements.

However, do NOT use this as an excuse to redesign unrelated parts of the portfolio.

Do not arbitrarily change:

*   typography
    
*   layout
    
*   spacing
    
*   colors
    
*   navigation
    
*   cards
    
*   animations
    
*   content
    
*   section structure
    

unless the change is required to implement the requested feature or is a very small UX adjustment necessary for consistency.

Preserve the established visual identity.

48\. FINAL REGRESSION GATE
==========================

Before declaring the implementation complete, verify all of the following:

### Existing functionality

**No existing working feature has regressed.**

### Studio

All existing editing, ordering, hiding, preview, publishing, history, rollback and upload functionality still works.

### Public website

All existing sections render and behave correctly.

### New CMS

All newly added fields persist correctly and survive reload/publish/rollback.

### Projects

Collapsed/expanded behavior works correctly on desktop and touch devices.

### Company Banner

Experience synchronization still works, while custom companies and logo controls work independently.

### Section names

Display labels update without breaking internal section identity.

### Theme

Palette switching changes colors without changing layout or functionality.

### SEO

Configured verification and analytics integrations actually affect the published site as intended.

### Clarity

Works through the implemented supported configuration, or the limitation is clearly identified if arbitrary script injection cannot safely be supported.

### Mail

mailto functionality works.

### Upload

Whitespace near upload controls no longer unexpectedly opens the file picker.

### Responsive

Desktop, tablet and mobile all work properly.

### Touch

Touch-specific interactions work without relying on hover.

### Accessibility

Interactive controls remain usable with keyboard and assistive technologies where applicable.

### Security

No new obvious security vulnerabilities have been introduced.

49\. FINAL IMPLEMENTATION REPORT
================================

At the end, provide a concise implementation report containing:

### Completed

List every requested feature that was implemented.

### Files/components changed

List the actual files/components modified.

Do not invent file names.

### Data/schema changes

Explain any actual schema changes and backward-compatibility behavior.

### SEO/Reach

Explain exactly how:

*   Google Search Console
    
*   Bing Webmaster
    
*   GA4
    
*   Microsoft Clarity
    

are implemented.

### Security

Summarize security-sensitive changes and protections.

### Testing performed

Report what was actually tested.

### Remaining limitations

If something could not safely or correctly be implemented, state:

1.  what it is
    
2.  why
    
3.  what was implemented instead
    
4.  whether it affects existing functionality
    

Do not claim something works if it was not actually verified.

ABSOLUTE PRIORITY ORDER
=======================

When making implementation decisions, follow this priority:

1.  **Preserve existing working functionality**
    
2.  **Preserve existing data and publishing integrity**
    
3.  **Avoid introducing security vulnerabilities**
    
4.  **Implement the explicitly requested functionality**
    
5.  **Preserve the existing visual language**
    
6.  **Responsive and touch quality**
    
7.  **Accessibility**
    
8.  **Performance**
    
9.  **Visual polish**
    
10.  **Code cleanup/refactoring**
    

If a proposed implementation improves one requirement but risks breaking an existing working feature, choose the safer implementation.

If you discover that a requirement conflicts with existing architecture, stop and reason through the conflict before changing the architecture.

**Do not guess.**

**Do not hallucinate.**

**Do not replace working systems unnecessarily.**

**Do not declare success merely because the application compiles.**

The final result must be a stable, production-quality portfolio website and Content Studio in which the new functionality feels native to the existing product rather than bolted on.

Most importantly:

> **The existing website is already working. Treat that working state as something to protect throughout the entire implementation.**