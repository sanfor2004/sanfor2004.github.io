---
title: "Distributing 5 million leads by rules, not by hand"
description: "How a rule-based system kept 5M+ leads, 2,000+ accounts and their orders under control, and saved an estimated 48+ hours of manual work a week."
image: "/images/writing/distributing-leads-by-rules.webp"
imageAlt: "Illustration: a brass sorting machine on a workbench takes a stack of lead cards and routes them along orange arrows into colour-tabbed trays, while an engineer relaxes with tea."
imageWidth: 1376
imageHeight: 768
date: 2026-10-08
topic: Automation
tags: ["Lead distribution", "PHP", "Case study"]
featured: false
draft: true
---

<!--
  DRAFT for Ahmed to review. It stays unpublished while `draft: true` (visible only in `npm run dev`).
  Every fact below comes from the Skylimit case study (src/data/case-studies.ts):
  5M+ / 5.4M+ leads, 2,000+ accounts, 53,000+ orders, $1.35M+ in payments processed, rule-based distribution,
  dedup + validation, Twilio/Plivo calls, SMS and IVR, Stripe, reporting, team of 2 to 10,
  an estimated 48+ hours a week saved, 2022 – 2026.
  CHECK before publishing:
  - The rule examples in "What a rule looks like" are generic. Replace them with the real ones.
  - Add anything true that's missing (how leads arrived, how accounts received them).
  - Then set `draft: false`. Cover: generated with Figma AI (owner-approved), PNG original + WebP + JPG share copy.
-->

Five million leads is not a spreadsheet problem any more. When I started working with Skylimit LLC in 2022, the job was to keep control of more than 5 million leads and over 2,000 accounts, with orders coming in on top, and to hand those leads out in one organized way, by set rules.

This is how I think about that kind of automation, and what it changed for the business.

## Why distributing by hand stops working

Handing leads out by hand works while there are a few hundred of them and one person who knows every account. It stops working the moment either number grows. Someone has to remember who gets what, check that nobody receives the same lead twice, and keep track of which account has paid for how many. Every one of those steps is a place where a lead goes to the wrong account, or to nobody.

The fix isn't working faster. It's writing the rules down once, in a system, and letting the system apply them every time.

## Clean data comes first

A distribution rule is only as good as the leads it runs on. Before any lead went anywhere, it was deduplicated and validated, so millions of records stayed usable instead of slowly filling up with copies and broken entries.

> Automation multiplies whatever you feed it. Clean the data before you automate the decisions.

## What a rule looks like

<!-- CHECK: generic examples. Replace with the real rules. -->
A rule answers one question: which account should get this lead, right now? In practice that means combining a few plain conditions, for example what the account has ordered, what kind of lead it is, and how many leads the account has already received. Written down once, the same rule runs the same way on the first lead and on the five-millionth.

## Orders, payments and calls in the same system

Distribution doesn't live on its own. In the same platform:

- **Orders** tied to accounts: 53,000+ of them over the years.
- **Payments** through Stripe checkout, reconciled for every order: $1.35M+ in total.
- **Calls, SMS and IVR** on Twilio and Plivo, inbound and outbound.
- **Reporting**: the numbers the business ran on, without spreadsheets.

Keeping all of it in one system is what made the rules trustworthy. Each decision could see the order, the payment and the account behind it.

## What changed

Over 2022 to 2026, the platform processed 5.4M+ leads, 53,000+ orders and $1.35M+ in payments processed, while the team ranged from 2 to 10 people. By our estimate, it saved more than 48 hours of manual work every week.

## Wrapping up

If your team still decides by hand who gets each lead, order or ticket, write the rules down first: what goes where, and why. That list is most of the automation. If you'd like a second pair of eyes on it, book a free call and show me the manual work.
