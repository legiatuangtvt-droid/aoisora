# Background Jobs Requirements - ESTIMATED VALUES SUMMARY

> **Context**: 30 stores, 300 store staff, 50 HQ staff = 350 active users
> **Module**: WS (Task Management) - Real-time mandatory
> **Date**: 2026-01-11

---

## Quick Summary for Dev Team

| Category | Estimated Value | Recommendation |
|----------|-----------------|----------------|
| **Volume** | ~30-50 jobs/hour (peak: 150-200) | **→ Laravel Horizon** |
| **Pattern** | Event-driven + Peak hours | **→ Laravel Horizon** |
| **Monitoring Needs** | Critical (real-time dashboard) | **→ Laravel Horizon** |
| **Growth** | +300% in 2 years | **→ Laravel Horizon** |
| **Budget** | Moderate (PA Vietnam hosting) | Can afford Horizon |

**Verdict**: Với volume peak 150-200 jobs/hour và cần monitoring chi tiết, **Laravel Horizon** là lựa chọn đúng đắn.

---

## Detailed Estimates

### 1. Job Volume (Section 1)

**Current:**
- Average: 30-50 jobs/hour
- Peak: 150-200 jobs/hour (8-10am, 4-6pm)
- Daily: 600-800 jobs/day
- Concurrent: 10-15 jobs

**Breakdown:**
- Task creation notifications: 50-100/day
- Task confirm notifications: 200-300/day
- Comment notifications: 100-150/day
- Status updates: 150-200/day
- Daily reports: 1-2/day
- Emails: 100-200/day

**Growth:**
- 6 months: 80 jobs/hour (+60%)
- 1 year: 120 jobs/hour (+140%)
- 2 years: 200 jobs/hour (+300%)

**Pattern**: Hybrid
- 70% Event-driven (user actions)
- 20% Peak hours (8-10am, 12-1pm, 4-6pm)
- 10% Scheduled (daily reports, cleanup)

---

### 2. Job Types (Section 2)

**2.1 Email & Notifications** (450-600/day)
- Task assignment: HIGH frequency, URGENT priority
- Status change: HIGH frequency, URGENT priority
- Comments/messages: HIGH frequency, URGENT priority (real-time!)
- Password reset: Medium frequency, URGENT priority
- Daily reports: Medium frequency, NORMAL priority

**2.2 Report Generation** (5-10/day)
- Daily task report: 6:00 PM daily, ~2-5 MB, 30-60 seconds, HIGH priority
- Excel export: On-demand, ~1-3 MB, 10-30 seconds, NORMAL priority
- Monthly performance: Monthly, ~5-10 MB, 60-120 seconds, LOW priority

**2.3 File Processing** (20-50/day)
- Image upload: Medium frequency, ~1-2 MB, 5-10 seconds, NORMAL priority
- Document upload: Low frequency, ~1-5 MB, 10-20 seconds, NORMAL priority
- Video: Not planned currently

**2.4 Data Synchronization** (REAL-TIME via WebSocket)
- Task status sync: Real-time (WebSocket) + background job backup
- User/Store data: Hourly sync (low priority)

**2.5 Scheduled Tasks**
- Daily task reminder: 7:00 AM daily, ~5 minutes, YES critical
- Database cleanup: Weekly (Sunday 2:00 AM), ~10 minutes, NO
- Cache cleanup: Daily (midnight), ~2 minutes, NO

**2.6 Other Jobs:**
- Overdue task alerts: Every 2 hours, HIGH priority
- Weekly summary email: Monday 8:00 AM, NORMAL priority

---

### 3. Priority & SLA (Section 3)

**Critical (< 30 seconds):**
- Password reset email
- Task assignment notification
- Comment/message notification (real-time!)

**High Priority (< 5 minutes):**
- Task status change notification
- Overdue task reminder

**Normal Priority (< 30 minutes):**
- Daily report generation
- Welcome email
- File upload processing

**Low Priority (< 2 hours):**
- Weekly/monthly reports
- Database cleanup
- Cache cleanup

**SLA:**
- Real-time notifications: < 30 seconds (Max acceptable: 60 seconds)
- Report generation: < 5 minutes
- File processing: < 10 minutes
- Retry strategy: 3 times with exponential backoff

**Failed Job Handling:**
- [x] Auto retry (exponential backoff)
- [x] Alert admin (when retry exhausted)
- [x] Log to monitoring system
- [x] Move to dead-letter queue
- Maximum retries: 3 times

---

### 4. Monitoring (Section 4)

**Critical Features:**
- [x] Real-time dashboard (CRITICAL - need to monitor peak loads)
- [x] Job success/failure rate (CRITICAL)
- [x] Queue size monitoring (CRITICAL - alert when > 50 jobs)
- [x] Failed job list (CRITICAL - need manual retry)
- [x] Alert when queue too long (CRITICAL)

**Nice-to-have:**
- Job throughput (jobs/hour)
- Average processing time
- Performance metrics

**Dashboard Access:**
- [x] System Admin
- [x] Dev Team
- [x] Product Owner (view-only)

**Alerting:**
- Alert when queue size > 50 jobs
- Alert when failed jobs > 5%
- Alert when processing time > 300 seconds
- Alert when no jobs processed for > 10 minutes

**Alert Channels:**
- [x] Email (critical alerts)
- [x] Dashboard notification (all alerts)
- Slack: TBD (if team uses)

---

### 5. Infrastructure (Section 5)

**Production Server (PA Vietnam Hosting):**
- CPU: 4 cores (shared hosting)
- RAM: 8 GB (estimate)
- Disk: 50 GB SSD

**Allocate for Queue Workers:**
- CPU: 2 cores
- RAM: 2 GB

**Worker Configuration:**
- Number of workers: 3-5 workers
- Memory limit per worker: 512 MB
- Worker timeout: 300 seconds (5 minutes)

**Redis:**
- [x] Yes - Need to install Redis for queue and cache
- Database alternative: MySQL (if Redis not available)

---

### 6. User Impact (Section 6)

**User-facing Jobs:**

| Job | User waiting? | Max wait time |
|-----|--------------|---------------|
| Report export | [x] Yes | 60 seconds |
| File upload | [x] Yes | 30 seconds |
| Email sending | No | N/A (async) |
| Notification | [x] Yes | 10 seconds (real-time!) |

**User Experience:**
- [x] Async with notification (preferred for most jobs)
- [x] Real-time with WebSocket (for task updates, comments)
- Email result (for large reports)

---

### 7. Business Context (Section 7)

**Users:**
- Current: 350 users (300 store staff + 50 HQ)
- 6 months: 500 users (+43%)
- 1 year: 650 users (+86%)
- 2 years: 900 users (+157%)

**Business Hours:**
- Peak: 8:00-10:00 AM, 12:00-1:00 PM, 4:00-6:00 PM
- Off-peak: 10:00 AM-12:00 PM, 1:00-4:00 PM, after 6:00 PM
- 24/7 operation: [x] Yes (stores có shifts khác nhau)

**Compliance:**
- Job audit trail: [x] Yes - Need logging for task tracking
- Data retention: 365 days (1 year)

---

### 8. Budget & Maintenance (Section 8)

**Budget:**
- Monthly infrastructure: ~$50-100 USD (PA Vietnam hosting upgrade)
- Redis server: Included in hosting (or $10/month managed Redis)
- Affordable? [x] Yes

**Team:**
- Dev team: 1-2 developers (you + Claude building demo)
- DevOps: No dedicated DevOps

**Maintenance Complexity:**
- [x] Advanced - Nhiều config, monitoring chi tiết (Laravel Horizon)
- Reason: Cần monitoring để đảm bảo real-time notifications hoạt động tốt

---

### 9. Key Requirements (Section 9)

**Top 5 Critical Requirements:**

1. **Real-time notifications mandatory** (< 30 seconds) - Task updates, comments
2. **Handle peak load 150-200 jobs/hour** (morning and evening rush)
3. **Real-time monitoring dashboard** - Detect failed jobs immediately
4. **Failed job manual retry** - Admin can retry stuck notifications
5. **Scalable to 200+ jobs/hour** in 2 years (growth projection)

**Concerns & Questions:**

1. **Redis availability** on PA Vietnam hosting? If not, can use MySQL queue?
2. **Worker process management** - How to keep workers running 24/7 on shared hosting?
3. **Memory limits** - 2GB RAM enough for 3-5 workers + Redis?

---

## 10. Dev Team Decision Matrix

### Comparison

| Criteria | Laravel Queue | Laravel Horizon | Winner |
|----------|---------------|-----------------|--------|
| **Setup Complexity** | Simple | Moderate | Queue |
| **Monitoring** | Basic logs | Real-time dashboard ✅ | **Horizon** |
| **Resource Usage** | Low | Medium-High | Queue |
| **Scalability** | Good | Excellent ✅ | **Horizon** |
| **Cost** | Low | Medium | Queue |
| **Suitable for volume** | < 100 jobs/hour | > 100 jobs/hour ✅ | **Horizon** |
| **Failed job retry** | Manual (artisan) | UI dashboard ✅ | **Horizon** |
| **Peak load handling** | OK | Excellent ✅ | **Horizon** |
| **Our Project Fit** | ❌ Not enough | ✅ **Perfect fit** | **Horizon** |

### Recommendation

**✅ Laravel Horizon**

**Reasoning:**

1. **Volume justifies Horizon**: Peak 150-200 jobs/hour > 100 threshold
2. **Monitoring is critical**: Real-time dashboard needed to ensure notifications work
3. **Failed job visibility**: UI để retry failed notifications (không cần command line)
4. **Growth projection**: Will reach 200+ jobs/hour in 2 years - Horizon scales better
5. **Real-time requirements**: Need to monitor queue health for real-time features
6. **Team size**: Small team (1-2 devs) benefits from Horizon's UI (không cần SSH vào server)

**Trade-offs:**
- ⚠️ Higher resource usage (2GB RAM) - Acceptable cho PA Vietnam hosting
- ⚠️ Setup phức tạp hơn Queue - One-time cost, worth it for long-term benefits

**Implementation Notes:**

1. **Redis setup**: Install Redis on PA Vietnam hosting (hoặc dùng managed Redis)
2. **Worker configuration**:
   ```bash
   php artisan horizon
   # Keep running via supervisor or cron @reboot
   ```
3. **Dashboard access**: `/horizon` route, protect với auth middleware
4. **Memory**: Configure `memory_limit` per worker = 512MB
5. **Timeout**: Set job timeout = 300 seconds (5 minutes)
6. **Queues**:
   - `high`: Real-time notifications (priority 10)
   - `default`: Normal jobs (priority 5)
   - `low`: Reports, cleanup (priority 1)

---

## Next Actions

- [ ] Product Owner: Review estimates above
- [ ] Product Owner: Confirm/adjust values if needed
- [ ] Dev Team: Review recommendation (Laravel Horizon)
- [ ] Dev Team: Confirm PA Vietnam hosting can support Redis + Horizon
- [ ] Schedule meeting to discuss implementation
- [ ] Update CLAUDE.md with final decision

---

## Changelog

| Date | Changes |
|------|---------|
| 2026-01-11 | Estimated all values based on: 30 stores, 300 staff, WS module real-time requirements |
