# SCALE_CODEC.md
Version: 2.0
Purpose: Token optimization via reference-based compression
Created: 2025-11-06

---

## PROBLEM STATEMENT

v1.0 session logging stored full diffs inline:
- Per session: 400-600 tokens
- Last 5 sessions: 2500 tokens in agent context
- Scaling limit: ~500 sessions before context overflow
- 3-year cost (1000 sessions): ~$75 (Sonnet 4.5)

This is unsustainable for enterprise use (10,000+ sessions).

---

## SOLUTION: REFERENCE-BASED COMPRESSION

Instead of loading full content, agents load:
1. PROJECT_REFERENCES.yaml (static, 200 tokens, loaded once)
2. SESSION_DELTAS.log (one-line entries, 50 tokens for last 30)
3. PROJECT_METRICS.tsv (queryable, not loaded into context)

Full diffs stored externally in .diffs/ (git-ignored, on-demand access).

---

## SYSTEM ARCHITECTURE

```
Agent starts task
  |
  v
Loads PROJECT_REFERENCES.yaml (once per session)
  - Stack: Next.js 22, Tailwind, Jest, Playwright
  - Mandates: 80% coverage, no emojis, diff-only commits
  - Routing rules: app/*.tsx -> test-worker + a11y-worker
  |
  v
Loads SESSION_DELTAS.log (last 30 entries)
  - 2025-11-06 | sonnet-4.5 | orchestration | PASS | L+847
  - 2025-11-06 | human | warp-ui | PASS | L+324,-45
  |
  v
Executes task
  |
  v
On completion:
  - Saves diff: git diff > .diffs/[timestamp].diff
  - Appends SESSION_DELTAS.log
  - Appends PROJECT_METRICS.tsv
  - Appends AGENT_PROGRESS_LOG_v2.md (reference entry)
```

---

## FILE FORMATS

### PROJECT_REFERENCES.yaml (Static Context)

Loaded once per agent session. Contains:
- Stack (framework, styling, testing, deployment)
- Mandates (coverage threshold, pre-commit checks, security)
- Routing rules (which agent handles which file types)
- Performance targets (CI time, coverage %, Lighthouse score)

Token cost: ~200 tokens (loaded once)

### SESSION_DELTAS.log (Append-Only Log)

One-line entries:
```
[timestamp] | [agent] | [task] | [status] | [metrics]
```

Example:
```
2025-11-06T14:30:00Z | sonnet-4.5 | orchestration | PASS | L+847,C:1,T:45min
2025-11-06T14:19:00Z | human | warp-ui-baseline | PASS | L+324,-45,C:1
2025-11-06T14:00:00Z | sonnet-4.5 | coverage-validation | PASS | L+1247,-89,C:11
```

Token cost: ~2 tokens per entry, 50 tokens for last 30 sessions

### PROJECT_METRICS.tsv (Queryable Table)

Tab-separated values for easy parsing:
```
timestamp	agent	task	status	lines_added	lines_removed	commits	duration_min	tokens_used
2025-11-06T14:30:00Z	sonnet-4.5	orchestration	PASS	847	0	1	45	0
2025-11-06T14:19:00Z	human	warp-ui-baseline	PASS	324	45	1	0	0
```

Token cost: 0 (not loaded, query as needed)

### .diffs/ (External Storage)

Full git diffs stored as files:
```
.diffs/2025-11-06T14:30:00Z.diff
.diffs/2025-11-06T14:19:00Z.diff
.diffs/archive/2025-11/
```

Token cost: 0 (loaded on-demand only)

---

## TOKEN ANALYSIS

### v1.0 (Full Format)

Agent loads last 5 sessions:
```markdown
### 2025-11-06T14:30:00Z | claude-sonnet-4-5 | orchestration
Agent: Claude Code (Sonnet 4.5)
Task: Implement orchestration...
Status: PASS

Diff Summary:
 .claude/orchestrator-agent/
 Lines: +847 -0

Full Diff:
```diff
[400 lines of diff]
```

Metrics:
- Commits: 1
- Lines: 847
- Duration: 45 min
[... 20 more lines]
```

Tokens per session: ~500
Total for 5 sessions: 2500 tokens

### v2.0 (Reference Format)

Agent loads:
1. PROJECT_REFERENCES.yaml (once): 200 tokens
2. Last 30 SESSION_DELTAS.log entries: 50 tokens

Total: 250 tokens

Reduction: 90%

If agent needs full diff, loads on-demand from .diffs/.

---

## QUERY PATTERNS

### Find sessions by agent
```bash
grep "sonnet-4.5" SESSION_DELTAS.log
```

### Find failed sessions
```bash
awk -F'|' '$4 ~ /FAIL/' SESSION_DELTAS.log
```

### Calculate total lines added (last 30 sessions)
```bash
awk -F'\t' 'NR>1 {sum+=$5} END {print sum}' PROJECT_METRICS.tsv
```

### Get average duration per agent
```bash
awk -F'\t' '$2=="sonnet-4.5" {sum+=$8; count++} END {print sum/count}' PROJECT_METRICS.tsv
```

### Load specific diff
```bash
cat .diffs/2025-11-06T14:30:00Z.diff
```

---

## SCALING PROJECTIONS

| Sessions | v1.0 Tokens | v2.0 Tokens | Reduction | Cost Savings (Sonnet 4.5) |
|----------|-------------|-------------|-----------|---------------------------|
| 10       | 5,000       | 250         | 95%       | $0.71                     |
| 100      | 50,000      | 300         | 99.4%     | $7.43                     |
| 1,000    | 500,000     | 500         | 99.9%     | $74.78                    |
| 10,000   | 5,000,000   | 1,000       | 99.98%    | $747.85                   |

Assumptions:
- Sonnet 4.5 pricing: $0.015 per 1K input tokens
- v1.0: 500 tokens per session average
- v2.0: 250 tokens static + 0.025 tokens per session

---

## MIGRATION GUIDE

### From v1.0 to v2.0

1. **Extract static context** (one-time):
   - Stack, mandates, routing rules -> PROJECT_REFERENCES.yaml

2. **Convert session entries**:
   - For each session in AGENT_PROGRESS_LOG.md:
     - Save full diff to .diffs/[timestamp].diff
     - Extract metadata (timestamp, agent, task, status, metrics)
     - Append one-line to SESSION_DELTAS.log
     - Append row to PROJECT_METRICS.tsv
     - Add reference entry to AGENT_PROGRESS_LOG_v2.md

3. **Update CLAUDE.md**:
   - Agents read PROJECT_REFERENCES.yaml first
   - Agents append to SESSION_DELTAS.log after task
   - Agents query PROJECT_METRICS.tsv as needed

4. **Verify**:
   - Count tokens before: `wc -w AGENT_PROGRESS_LOG.md`
   - Count tokens after: `wc -w PROJECT_REFERENCES.yaml SESSION_DELTAS.log`
   - Confirm 90%+ reduction

---

## BEST PRACTICES

### For Agents

1. **Load static context once**:
   ```python
   if not hasattr(self, 'references_loaded'):
       self.references = load_yaml('PROJECT_REFERENCES.yaml')
       self.references_loaded = True
   ```

2. **Query logs, don't load all**:
   ```bash
   tail -30 SESSION_DELTAS.log  # Last 30 only
   ```

3. **Load diffs on-demand**:
   ```bash
   if need_full_diff:
       cat .diffs/[timestamp].diff
   ```

4. **Append, never rewrite**:
   ```bash
   echo "[entry]" >> SESSION_DELTAS.log
   ```

### For Humans

1. **Review weekly**:
   ```bash
   tail -50 SESSION_DELTAS.log | grep FAIL
   ```

2. **Archive monthly**:
   ```bash
   mv .diffs/*.diff .diffs/archive/$(date +%Y-%m)/
   tar -czf .diffs/archive/$(date +%Y-%m).tar.gz .diffs/archive/$(date +%Y-%m)/
   ```

3. **Query metrics**:
   ```bash
   # Sessions per agent
   awk -F'\t' 'NR>1 {count[$2]++} END {for (a in count) print a, count[a]}' PROJECT_METRICS.tsv
   ```

---

## TROUBLESHOOTING

### Issue: Agents loading full AGENT_PROGRESS_LOG.md

**Symptom**: High token usage, slow startup

**Fix**: Update agent instructions to load PROJECT_REFERENCES.yaml + SESSION_DELTAS.log only

**Verify**:
```bash
# Check agent logs for file access patterns
grep "Loading" agent.log
```

### Issue: SESSION_DELTAS.log not updating

**Symptom**: Empty or stale log

**Fix**: Agents must append after each task completion

**Verify**:
```bash
tail -5 SESSION_DELTAS.log
# Should show recent timestamps
```

### Issue: .diffs/ growing too large

**Symptom**: Disk space warnings

**Fix**: Archive old diffs monthly

**Script**:
```bash
find .diffs/ -name "*.diff" -mtime +30 -exec mv {} .diffs/archive/ \;
```

---

## FUTURE ENHANCEMENTS

1. **Compression**: gzip old diffs in .diffs/archive/
2. **S3 sync**: Upload .diffs/ to object storage for disaster recovery
3. **Vector search**: Embed session descriptions for semantic search
4. **Auto-summarization**: LLM summarizes 100+ sessions into quarterly reports

---

END OF SCALE_CODEC.md
For implementation details, see ORCHESTRATION_DEPLOYMENT_GUIDE.md
