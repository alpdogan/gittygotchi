-- GittyGotchi Phase 1 schema.
-- UNIQUE(github_username) is the lookup index; do not add a redundant username index.

CREATE TABLE pets (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	github_username TEXT NOT NULL UNIQUE,
	github_created_at TEXT NOT NULL,
	born_at TEXT NOT NULL,
	class TEXT NOT NULL,
	class_algorithm_version TEXT NOT NULL DEFAULT 'v1',
	growth_stage TEXT NOT NULL DEFAULT 'egg',
	growth_points INTEGER NOT NULL DEFAULT 0,
	active_days INTEGER NOT NULL DEFAULT 0,
	last_active_date TEXT,
	last_contribution_level INTEGER NOT NULL DEFAULT 0,
	last_github_sync_at TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);
