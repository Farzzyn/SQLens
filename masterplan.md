# 30-second elevator pitch

SQL Sandbox turns plain English into safe, readable SQL—then runs it and shows results instantly.
Learn, explore, and query databases without fear or friction.

# Problem & mission

## Problem

SQL is powerful but intimidating.

Non-technical users can’t query data directly.

Developers lack a safe, fast playground for ad-hoc queries.

## Mission

Make database querying approachable for beginners.

Keep it powerful and transparent for experts.

Never make the user think twice.

# Target audience

## Primary

Non-technical users (PMs, students, founders).

Developers & data analysts.

## Secondary

Educators teaching SQL.

Teams sharing read-only database access.

# Core features

## Input

Plain-English question box.

Optional schema/context hints.

## Translation

English → SQL conversion.

Highlighted SQL with explanations.

## Execution

Run query against sandboxed database.

Read-only by default.

## Output

Results table.

Row count + execution status.

Plain-English summary of what happened.

## Modes

### Beginner mode

Guided prompts.

Friendly explanations.

Error forgiveness.

### Expert mode

SQL-first view.

Editable queries.

Fast reruns.

# High-level tech stack (conceptual)

Frontend: Web app (fast iteration, low friction).

Backend API: Query orchestration + safety checks.

LLM layer: Natural language → SQL translation.

Database layer: Isolated sandbox DBs.

Auth: Lightweight accounts; optional guest mode.

## Why this fits:

Separates “thinking” (LLM) from “doing” (DB).

Keeps dangerous operations isolated.

Scales from learning tool → serious workspace.

# Conceptual data model (in words)

User

id, role, mode preference

Project / Sandbox

connected database, schema snapshot

Query

natural_language_input

generated_sql

execution_status

result_preview

Audit Log

who ran what, when (read-only focus)

# UI design principles

Calm, technical, forgiving.

Show results before explanations.

Errors guide, never blame.

Progressive disclosure:

Beginner sees “what”.

Expert sees “how”.

(Krug rule: users should succeed without reading docs.)

# Security & compliance notes

Read-only queries by default.

Hard block: DROP, DELETE, UPDATE unless explicitly enabled.

Query timeouts and row limits.

Full query audit trail.

# Phased roadmap

## MVP

Plain English → SQL.

Single sandbox DB.

Beginner + Expert toggle.

Table output.

## V1

Multiple databases.

SQL editing + rerun.

Saved queries.

Shareable read-only links.

## V2

Schema-aware suggestions.

Visualization (charts).

Team workspaces.

Usage analytics.

# Risks & mitigations

## Incorrect SQL

Show SQL clearly.

Require confirmation in Expert mode.

## User confusion

Mode-specific UI.

Inline explanations.

## Security concerns

Strict sandboxing.

Query allow-list.
